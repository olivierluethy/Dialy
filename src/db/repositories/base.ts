import type { SQLiteDatabase } from 'expo-sqlite';
import { getDb } from '@/db/database';
import { nowIso } from '@/utils/id';

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
