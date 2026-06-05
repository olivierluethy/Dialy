import { getDb } from '@/db/database';

/**
 * Privacy: data erasure. Soft-deletes all user-generated rows (meals, sport,
 * BG readings) so the deletion propagates to other devices via sync and can
 * never resurface. Read-mostly content (articles, foods) is shared seed data
 * and is left intact.
 *
 * The caller is responsible for the matching Supabase delete (see
 * services/auth.ts deleteAccountData) and for clearing the local session.
 */
const USER_TABLES = ['meal_entries', 'sport_entries', 'bg_readings'] as const;

export async function softDeleteAllUserData(): Promise<void> {
  const db = await getDb();
  const ts = new Date().toISOString();
  for (const table of USER_TABLES) {
    const rows = await db.getAllAsync<{ id: string }>(
      `SELECT id FROM ${table} WHERE deleted_at IS NULL`
    );
    await db.runAsync(
      `UPDATE ${table} SET deleted_at = ?, updated_at = ? WHERE deleted_at IS NULL`,
      [ts, ts]
    );
    for (const row of rows) {
      await db.runAsync(
        'INSERT INTO sync_queue (table_name, row_id, queued_at) VALUES (?, ?, ?)',
        [table, row.id, ts]
      );
    }
  }
}
