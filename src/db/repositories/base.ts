import type { SQLiteDatabase } from 'expo-sqlite';
import { getDb } from '@/db/database';
import { nowIso } from '@/utils/id';
import { syncEngine } from '@/sync/syncEngine';

/**
 * Adds a row to the sync queue so the sync engine knows it has a local change
 * pending upload to Supabase. Read-mostly tables (articles, foods) are synced
 * *down* and never queued here.
 */
export async function enqueueSync(
  db: SQLiteDatabase,
  tableName: string,
  rowId: string
): Promise<void> {
  await db.runAsync(
    'INSERT INTO sync_queue (table_name, row_id, queued_at) VALUES (?, ?, ?)',
    [tableName, rowId, nowIso()]
  );
  syncEngine.scheduleSync();
}

/** Soft delete: set deleted_at + bump updated_at, then queue for sync. */
export async function softDelete(
  tableName: string,
  rowId: string
): Promise<void> {
  const db = await getDb();
  const ts = nowIso();
  await db.runAsync(
    `UPDATE ${tableName} SET deleted_at = ?, updated_at = ? WHERE id = ?`,
    [ts, ts, rowId]
  );
  await enqueueSync(db, tableName, rowId);
}

/**
 * Moves diary entries to another point in time (date/time edit). Only rows of
 * `userId` are touched; each changed row is queued for sync.
 */
export async function setLoggedAt(
  tableName: string,
  rowIds: string[],
  userId: string,
  loggedAt: string
): Promise<void> {
  if (rowIds.length === 0) return;
  const db = await getDb();
  const ts = nowIso();
  await db.withTransactionAsync(async () => {
    for (const id of rowIds) {
      const result = await db.runAsync(
        `UPDATE ${tableName} SET logged_at = ?, updated_at = ? WHERE id = ? AND user_id = ?`,
        [loggedAt, ts, id, userId]
      );
      if (result.changes > 0) await enqueueSync(db, tableName, id);
    }
  });
}
