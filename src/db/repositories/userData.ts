import { getDb } from '@/db/database';

/**
 * Privacy: data erasure. Physically deletes the given account's rows (meals,
 * sport, BG readings) — never other accounts on the same device — together
 * with their pending pushes. Read-mostly content (articles, foods) is shared
 * seed data and is left intact.
 *
 * The server side is erase_my_data() (supabase/migrations/0014_real_deletion.sql),
 * called by services/auth.ts deleteAccountData or, if that failed, by the next
 * sync (see markErasePending).
 */
const USER_TABLES = ['meal_entries', 'sport_entries', 'bg_readings', 'glucose_readings'] as const;

/**
 * Deletes the account's rows; with `upTo` (ISO time) only those last changed
 * at or before it. Returns the number of rows deleted.
 */
export async function purgeUserData(userId: string, upTo?: string): Promise<number> {
  const db = await getDb();
  const filter = upTo
    ? 'user_id = ? AND julianday(updated_at) <= julianday(?)'
    : 'user_id = ?';
  const params = upTo ? [userId, upTo] : [userId];
  let deleted = 0;
  for (const table of USER_TABLES) {
    await db.runAsync(
      `DELETE FROM sync_queue WHERE table_name = '${table}' AND row_id IN (SELECT id FROM ${table} WHERE ${filter})`,
      params
    );
    const { changes } = await db.runAsync(`DELETE FROM ${table} WHERE ${filter}`, params);
    deleted += changes;
  }
  return deleted;
}

// app_meta keys, per account.
const pendingKey = (userId: string) => `erase_pending:${userId}`;
const appliedKey = (userId: string) => `erased_at:${userId}`;

/** Remembers that the server copy still has to be erased (offline, failed request). */
export async function markErasePending(userId: string): Promise<void> {
  await writeMeta(pendingKey(userId), new Date().toISOString());
}

export async function isErasePending(userId: string): Promise<boolean> {
  return (await readMeta(pendingKey(userId))) !== null;
}

export async function clearErasePending(userId: string): Promise<void> {
  await deleteMeta(pendingKey(userId));
}

/** The server's erasure time (data_erasures) this device last applied. */
export async function appliedErasure(userId: string): Promise<string | null> {
  return readMeta(appliedKey(userId));
}

export async function setAppliedErasure(userId: string, erasedAt: string): Promise<void> {
  await writeMeta(appliedKey(userId), erasedAt);
}

/** Forgets the account's markers (after the account itself was deleted). */
export async function clearErasureMarkers(userId: string): Promise<void> {
  await deleteMeta(pendingKey(userId));
  await deleteMeta(appliedKey(userId));
}

async function readMeta(key: string): Promise<string | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_meta WHERE key = ?', [
    key,
  ]);
  return row?.value ?? null;
}

async function writeMeta(key: string, value: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO app_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    [key, value]
  );
}

async function deleteMeta(key: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM app_meta WHERE key = ?', [key]);
}
