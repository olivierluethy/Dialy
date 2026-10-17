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

/** Soft-deletes diary entries of `userId` (other accounts' rows are left alone). */
export async function deleteEntries(
  tableName: string,
  rowIds: string[],
  userId: string
): Promise<void> {
  if (rowIds.length === 0) return;
  const db = await getDb();
  const ts = nowIso();
  await db.withTransactionAsync(async () => {
    for (const id of rowIds) {
      const result = await db.runAsync(
        `UPDATE ${tableName} SET deleted_at = ?, updated_at = ? WHERE id = ? AND user_id = ? AND deleted_at IS NULL`,
        [ts, ts, id, userId]
      );
      if (result.changes > 0) await enqueueSync(db, tableName, id);
    }
  });
}

/** What the Tagebuch edit popup can change on a diary entry. */
export interface EntryChanges {
  logged_at?: string;
  note?: string | null;
}

/**
 * Edits diary entries: date/time and/or comment. Only rows of `userId` are
 * touched; each changed row is queued for sync.
 */
export async function updateEntries(
  tableName: string,
  rowIds: string[],
  userId: string,
  changes: EntryChanges
): Promise<void> {
  const fields = (Object.keys(changes) as Array<keyof EntryChanges>).filter(
    (k) => changes[k] !== undefined
  );
  if (rowIds.length === 0 || fields.length === 0) return;
  const db = await getDb();
  const ts = nowIso();
  const set = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => changes[f] ?? null);
  await db.withTransactionAsync(async () => {
    for (const id of rowIds) {
      const result = await db.runAsync(
        `UPDATE ${tableName} SET ${set}, updated_at = ? WHERE id = ? AND user_id = ?`,
        [...values, ts, id, userId]
      );
      if (result.changes > 0) await enqueueSync(db, tableName, id);
    }
  });
}
