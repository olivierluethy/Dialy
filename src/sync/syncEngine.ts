import { getDb } from '@/db/database';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabase, isNetworkError } from '@/sync/supabaseClient';
import { Sentry } from '@/services/sentry';
import { refreshPremiumGrant } from '@/services/premium';
import { syncDiabetesType } from '@/services/userSettings';
import {
  appliedErasure,
  clearErasePending,
  isErasePending,
  purgeUserData,
  setAppliedErasure,
} from '@/db/repositories/userData';
import { nowIso } from '@/utils/id';
import { useAppStore } from '@/state/store';

/**
 * Offline-first sync engine implementing the §7 contract.
 *
 *  - Source of truth for the UI is the local SQLite DB.
 *  - Writes persist locally first (via repositories) and are queued in
 *    `sync_queue`; this engine pushes them to Supabase when online.
 *  - Conflict resolution: LAST-WRITE-WINS on `updated_at` (newer wins,
 *    regardless of origin).
 *  - Deletes are SOFT (`deleted_at`), never physical, so a deleted row can't
 *    resurface on another device. Exception: "Daten löschen" erases the
 *    account's rows physically (applyErasure).
 *  - Triggers: automatic. Every local change schedules a sync (debounced, so a
 *    burst of changes goes out together); also on app start, sign-in and
 *    return to the foreground. Without a connection it retries with growing
 *    pauses. (FCM — the server pinging the client — is prepared but off.)
 *  - The account screen shows the resulting status (SyncStatus in the store).
 *
 * No-ops cleanly when Supabase isn't configured or no user is signed in.
 */

// User-owned tables participate in two-way sync. Read-mostly content tables
// (articles, foods) are pulled down separately and never pushed.
const USER_TABLES = ['meal_entries', 'sport_entries', 'bg_readings'] as const;
type UserTable = (typeof USER_TABLES)[number];

let syncing = false;
// A sync was requested while one was running: run once more afterwards.
let rerun = false;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;

// How long to wait for the server before treating the device as offline.
const ONLINE_CHECK_MS = 6000;
// Pause after a local change before syncing (bundles quick successive edits).
const DEBOUNCE_MS = 2000;
// Retry pauses while offline / failing: 30 s, doubling up to 5 min.
const RETRY_MIN_MS = 30_000;
const RETRY_MAX_MS = 5 * 60_000;
let retryDelay = RETRY_MIN_MS;

const clearTimer = (t: ReturnType<typeof setTimeout> | null) => {
  if (t) clearTimeout(t);
};

type SyncResult = { pushed: number; pulled: number; error?: string };

export const syncEngine = {
  isSyncing(): boolean {
    return syncing;
  },

  /** Sync soon — called after every local change (see enqueueSync). */
  scheduleSync(): void {
    if (!getSupabase()) return;
    clearTimer(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      void syncEngine.syncNow();
    }, DEBOUNCE_MS);
  },

  /** Stop pending timers and forget the status (e.g. on sign-out). */
  reset(): void {
    clearTimer(debounceTimer);
    clearTimer(retryTimer);
    debounceTimer = retryTimer = null;
    retryDelay = RETRY_MIN_MS;
    useAppStore.getState().setSyncStatus({ state: 'idle', pending: 0 });
    useAppStore.getState().setLastSyncedAt(null);
  },

  /** Push local changes, then pull remote ones; updates the sync status. */
  async syncNow(): Promise<SyncResult> {
    const store = useAppStore.getState();
    if (!getSupabase()) {
      store.setSyncStatus({ state: 'disabled', pending: 0 });
      return { pushed: 0, pulled: 0, error: 'offline' };
    }
    if (syncing) {
      rerun = true;
      return { pushed: 0, pulled: 0, error: 'busy' };
    }
    syncing = true;
    clearTimer(retryTimer);
    retryTimer = null;
    store.setSyncStatus({ ...store.syncStatus, state: 'syncing' });

    let result: SyncResult;
    let uid: string | undefined;
    try {
      result = await runSync((id) => (uid = id));
    } catch (e) {
      Sentry.captureException(e);
      result = { pushed: 0, pulled: 0, error: String(e) };
    } finally {
      syncing = false;
    }

    const pending = uid ? await pendingCount(uid) : 0;
    const signedOut = result.error === 'no-session';
    const failed = result.error !== undefined && !signedOut;
    if (failed || pending > 0) {
      // Offline or a failed push: try again later, with growing pauses.
      retryTimer = setTimeout(() => void syncEngine.syncNow(), retryDelay);
      retryDelay = Math.min(retryDelay * 2, RETRY_MAX_MS);
    } else {
      retryDelay = RETRY_MIN_MS;
    }
    const after = useAppStore.getState();
    after.setSyncStatus({
      state: result.error === 'network' ? 'offline' : failed ? 'error' : 'idle',
      pending,
    });
    if (!failed && !signedOut) after.setLastSyncedAt(nowIso());
    if (result.pulled > 0) after.bumpDataRevision();

    if (rerun) {
      rerun = false;
      void syncEngine.syncNow();
    }
    return result;
  },
};

async function runSync(onUser: (uid: string) => void): Promise<SyncResult> {
  const sb = getSupabase()!;
  // getUser() asks the server (and refreshes an expired token), so it also
  // tells us whether we're online. Offline, a token refresh is retried for up
  // to ~30 s, so give up after a few seconds; everything stays queued locally.
  const reply = await Promise.race([
    sb.auth.getUser(),
    new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), ONLINE_CHECK_MS)),
  ]);
  if (reply === 'timeout' || (reply.error && isNetworkError(reply.error))) {
    // Still count what's waiting, for the status line.
    const stored = useAppStore.getState().user?.id;
    if (stored) onUser(stored);
    return { pushed: 0, pulled: 0, error: 'network' };
  }
  const uid = reply.data.user?.id;
  if (!uid) return { pushed: 0, pulled: 0, error: 'no-session' };
  onUser(uid);
  await refreshPremiumGrant(sb, uid);
  await syncDiabetesType(sb, reply.data.user!);
  const erased = await applyErasure(sb, uid);
  // The server copy still has to go: pulling now would bring it back.
  if (erased === null) return { pushed: 0, pulled: 0, error: 'erase-failed' };
  const { pushed, failed } = await pushPending(uid);
  const pulled = erased + (await pullRemote(uid));
  if (failed > 0) return { pushed, pulled, error: 'push-failed' };
  return { pushed, pulled };
}

/**
 * "Daten löschen" (services/auth.ts deleteAccountData): erases the server copy
 * if that is still pending on this device, and deletes the local rows when
 * the data was erased elsewhere (public.data_erasures). Returns the number of
 * local rows deleted, or null when the pending server erasure failed.
 */
async function applyErasure(sb: SupabaseClient, uid: string): Promise<number | null> {
  if (await isErasePending(uid)) {
    const { error } = await sb.rpc('erase_my_data');
    if (error) {
      Sentry.captureException(error);
      return null;
    }
    await clearErasePending(uid);
  }
  const { data, error } = await sb
    .from('data_erasures')
    .select('erased_at')
    .eq('user_id', uid)
    .maybeSingle();
  // Missing table (migration not run yet) or a failed request: next time.
  if (error || !data) return 0;
  const erasedAt = String(data.erased_at);
  if ((await appliedErasure(uid)) === erasedAt) return 0;
  const deleted = await purgeUserData(uid, erasedAt);
  await setAppliedErasure(uid, erasedAt);
  return deleted;
}

/** Changed rows of `uid` still queued, i.e. not on the server yet. */
async function pendingCount(uid: string): Promise<number> {
  const db = await getDb();
  const owned = (table: string) =>
    `EXISTS (SELECT 1 FROM ${table} t WHERE q.table_name = '${table}' AND t.id = q.row_id AND t.user_id = ?)`;
  const row = await db.getFirstAsync<{ n: number }>(
    `SELECT COUNT(DISTINCT q.table_name || ':' || q.row_id) AS n FROM sync_queue q
     WHERE ${USER_TABLES.map(owned).join(' OR ')}`,
    USER_TABLES.map(() => uid)
  );
  return row?.n ?? 0;
}

/** Push every queued local row to Supabase (upsert; LWW handled by updated_at). */
async function pushPending(uid: string): Promise<{ pushed: number; failed: number }> {
  const sb = getSupabase()!;
  const db = await getDb();
  const queued = await db.getAllAsync<{ id: number; table_name: string; row_id: string }>(
    'SELECT id, table_name, row_id FROM sync_queue ORDER BY id ASC'
  );
  let pushed = 0;
  let failed = 0;

  for (const item of queued) {
    if (!USER_TABLES.includes(item.table_name as UserTable)) {
      await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [item.id]);
      continue;
    }
    const row = await db.getFirstAsync<Record<string, unknown>>(
      `SELECT * FROM ${item.table_name} WHERE id = ?`,
      [item.row_id]
    );
    // Rows without an owner never sync; rows of another account on this
    // device wait in the queue until that account signs in again.
    if (!row || !row.user_id) {
      await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [item.id]);
      continue;
    }
    if (row.user_id !== uid) continue;
    const payload = row;
    const { error } = await sb
      .from(item.table_name)
      .upsert(payload, { onConflict: 'id' });
    if (error) {
      // Leave it queued to retry on the next sync. Don't block the rest.
      Sentry.captureException(error);
      failed += 1;
      continue;
    }
    await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [item.id]);
    pushed += 1;
  }
  return { pushed, failed };
}

/**
 * Pull remote rows newer than what we have and merge with last-write-wins.
 * Soft deletes arrive as rows with a non-null deleted_at and are applied like
 * any other update.
 */
async function pullRemote(uid: string): Promise<number> {
  const sb = getSupabase()!;
  const db = await getDb();
  let pulled = 0;

  for (const table of USER_TABLES) {
    const rows = await pullAll(sb, table, uid);
    if (!rows) continue;
    for (const remote of rows) {
      const id = remote.id as string;
      const local = await db.getFirstAsync<{ updated_at: string }>(
        `SELECT updated_at FROM ${table} WHERE id = ?`,
        [id]
      );
      // Last-write-wins: only apply remote if it's newer (or new locally).
      if (local && local.updated_at >= String(remote.updated_at)) continue;
      await upsertLocal(table, remote);
      pulled += 1;
    }
  }
  return pulled;
}

// PostgREST returns at most this many rows per request (max_rows).
const PAGE_SIZE = 1000;

/**
 * All of the account's rows of one table, page by page (ordered by id, so
 * pages don't overlap). null when a page failed - then nothing is applied
 * for this table and the next sync tries again.
 */
async function pullAll(
  sb: SupabaseClient,
  table: UserTable,
  uid: string
): Promise<Array<Record<string, unknown>> | null> {
  const rows: Array<Record<string, unknown>> = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await sb
      .from(table)
      .select('*')
      .eq('user_id', uid)
      .order('id')
      .range(from, from + PAGE_SIZE - 1);
    if (error || !data) {
      if (error) Sentry.captureException(error);
      return null;
    }
    rows.push(...(data as Array<Record<string, unknown>>));
    if (data.length < PAGE_SIZE) return rows;
  }
}

async function upsertLocal(
  table: string,
  remote: Record<string, unknown>
): Promise<void> {
  const db = await getDb();
  const cols = Object.keys(remote);
  const placeholders = cols.map(() => '?').join(',');
  const updates = cols
    .filter((c) => c !== 'id')
    .map((c) => `${c}=excluded.${c}`)
    .join(', ');
  const values = cols.map((c) => normalize(remote[c]));
  await db.runAsync(
    `INSERT INTO ${table} (${cols.join(',')}) VALUES (${placeholders})
     ON CONFLICT(id) DO UPDATE SET ${updates}`,
    values
  );
}

/** SQLite can't bind objects/booleans directly; coerce for storage. */
function normalize(value: unknown): string | number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'object') return JSON.stringify(value);
  return value as string | number;
}

export const _testInternals = { nowIso };
