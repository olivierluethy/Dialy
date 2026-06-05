import { getDb } from '@/db/database';
import { getSupabase } from '@/sync/supabaseClient';
import { Sentry } from '@/services/sentry';
import { nowIso } from '@/utils/id';

/**
 * Offline-first sync engine implementing the §7 contract.
 *
 *  - Source of truth for the UI is the local SQLite DB.
 *  - Writes persist locally first (via repositories) and are queued in
 *    `sync_queue`; this engine pushes them to Supabase when online.
 *  - Conflict resolution: LAST-WRITE-WINS on `updated_at` (newer wins,
 *    regardless of origin).
 *  - Deletes are SOFT (`deleted_at`), never physical, so a deleted row can't
 *    resurface on another device.
 *  - Trigger: designed around FCM (server pings client) — no polling. Locally
 *    we fall back to sync-on-foreground and a manual `syncNow()`.
 *
 * No-ops cleanly when Supabase isn't configured or no user is signed in.
 */

// User-owned tables participate in two-way sync. Read-mostly content tables
// (articles, foods) are pulled down separately and never pushed.
const USER_TABLES = ['meal_entries', 'sport_entries', 'bg_readings'] as const;
type UserTable = (typeof USER_TABLES)[number];

let syncing = false;

export const syncEngine = {
  isSyncing(): boolean {
    return syncing;
  },

  /** Manual / on-foreground sync. Push local changes, then pull remote. */
  async syncNow(): Promise<{ pushed: number; pulled: number; error?: string }> {
    const sb = getSupabase();
    if (!sb) return { pushed: 0, pulled: 0, error: 'offline' };
    const { data: userData } = await sb.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) return { pushed: 0, pulled: 0, error: 'no-session' };
    if (syncing) return { pushed: 0, pulled: 0, error: 'busy' };

    syncing = true;
    try {
      const pushed = await pushPending(uid);
      const pulled = await pullRemote(uid);
      return { pushed, pulled };
    } catch (e) {
      Sentry.captureException(e);
      return { pushed: 0, pulled: 0, error: String(e) };
    } finally {
      syncing = false;
    }
  },
};

/** Push every queued local row to Supabase (upsert; LWW handled by updated_at). */
async function pushPending(uid: string): Promise<number> {
  const sb = getSupabase()!;
  const db = await getDb();
  const queued = await db.getAllAsync<{ id: number; table_name: string; row_id: string }>(
    'SELECT id, table_name, row_id FROM sync_queue ORDER BY id ASC'
  );
  let pushed = 0;

  for (const item of queued) {
    if (!USER_TABLES.includes(item.table_name as UserTable)) {
      await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [item.id]);
      continue;
    }
    const row = await db.getFirstAsync<Record<string, unknown>>(
      `SELECT * FROM ${item.table_name} WHERE id = ?`,
      [item.row_id]
    );
    if (!row) {
      await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [item.id]);
      continue;
    }
    // Stamp ownership so RLS (user_id = auth.uid()) accepts the write.
    const payload = { ...row, user_id: uid };
    const { error } = await sb
      .from(item.table_name)
      .upsert(payload, { onConflict: 'id' });
    if (error) {
      // Leave it queued to retry on the next sync. Don't block the rest.
      Sentry.captureException(error);
      continue;
    }
    await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [item.id]);
    pushed += 1;
  }
  return pushed;
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
    const { data, error } = await sb
      .from(table)
      .select('*')
      .eq('user_id', uid);
    if (error || !data) {
      if (error) Sentry.captureException(error);
      continue;
    }
    for (const remote of data as Array<Record<string, unknown>>) {
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
