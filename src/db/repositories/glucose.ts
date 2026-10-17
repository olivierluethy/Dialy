import { getDb } from '@/db/database';
import { enqueueSync } from '@/db/repositories/base';
import { nowIso, uuidv4 } from '@/utils/id';
import type { ImportedReading } from '@/services/glucoseImport';
import type { GlucoseReading, GlucoseSource } from '@/types/models';

export interface ImportResult {
  inserted: number;
  duplicates: number;
}

export const glucoseRepo = {
  /**
   * Stores imported readings, skipping ones already present for this account
   * (same source + source_record_id). Each new row is queued for sync.
   */
  async importReadings(rows: ImportedReading[], userId: string | null): Promise<ImportResult> {
    const db = await getDb();
    const ts = nowIso();
    let inserted = 0;
    let duplicates = 0;

    await db.withTransactionAsync(async () => {
      for (const r of rows) {
        const existing = await db.getFirstAsync<{ id: string }>(
          `SELECT id FROM glucose_readings
           WHERE user_id IS ? AND source = ? AND source_record_id = ? AND deleted_at IS NULL`,
          [userId, r.source, r.source_record_id]
        );
        if (existing) {
          duplicates += 1;
          continue;
        }
        const id = uuidv4();
        await db.runAsync(
          `INSERT INTO glucose_readings
           (id, user_id, created_at, updated_at, deleted_at, source, source_record_id,
            timestamp_utc, display_time_local, value_mgdl, trend, status, imported_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [
            id, userId, ts, ts, null, r.source, r.source_record_id,
            r.timestamp_utc, r.display_time_local, r.value_mgdl, r.trend, r.status, ts,
          ]
        );
        await enqueueSync(db, 'glucose_readings', id);
        inserted += 1;
      }
    });
    return { inserted, duplicates };
  },

  /** Readings of one account between two instants (inclusive), oldest first. */
  async listBetween(userId: string, fromIso: string, toIso: string): Promise<GlucoseReading[]> {
    const db = await getDb();
    return db.getAllAsync<GlucoseReading>(
      `SELECT * FROM glucose_readings
       WHERE deleted_at IS NULL AND user_id = ? AND timestamp_utc >= ? AND timestamp_utc <= ?
       ORDER BY timestamp_utc ASC`,
      [userId, fromIso, toIso]
    );
  },

  /** How many readings the account has, per source (for the settings screen). */
  async counts(userId: string): Promise<Record<GlucoseSource, number>> {
    const db = await getDb();
    const rows = await db.getAllAsync<{ source: GlucoseSource; n: number }>(
      `SELECT source, COUNT(*) AS n FROM glucose_readings
       WHERE deleted_at IS NULL AND user_id = ? GROUP BY source`,
      [userId]
    );
    const out = { dexcom: 0, libre: 0, manual: 0, health_platform: 0 } as Record<GlucoseSource, number>;
    for (const r of rows) out[r.source] = r.n;
    return out;
  },

  /** Newest reading time of a source, for incremental sync (issue #21 §4). */
  async lastTimestamp(userId: string, source: GlucoseSource): Promise<string | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<{ t: string | null }>(
      `SELECT MAX(timestamp_utc) AS t FROM glucose_readings
       WHERE deleted_at IS NULL AND user_id = ? AND source = ?`,
      [userId, source]
    );
    return row?.t ?? null;
  },

  /**
   * Soft-deletes all of the account's glucose readings ("Verbindung trennen &
   * Daten löschen", §7). Each one is queued so the deletion syncs out.
   */
  async deleteAll(userId: string): Promise<number> {
    const db = await getDb();
    const ts = nowIso();
    const rows = await db.getAllAsync<{ id: string }>(
      `SELECT id FROM glucose_readings WHERE deleted_at IS NULL AND user_id = ?`,
      [userId]
    );
    await db.withTransactionAsync(async () => {
      for (const r of rows) {
        await db.runAsync(
          `UPDATE glucose_readings SET deleted_at = ?, updated_at = ? WHERE id = ?`,
          [ts, ts, r.id]
        );
        await enqueueSync(db, 'glucose_readings', r.id);
      }
    });
    return rows.length;
  },
};
