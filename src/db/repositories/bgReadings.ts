import { getDb } from '@/db/database';
import { enqueueSync } from '@/db/repositories/base';
import { nowIso, uuidv4 } from '@/utils/id';
import type { BgReading } from '@/types/models';

export type NewBgReading = Pick<BgReading, 'value_mmol' | 'source'> & {
  logged_at?: string;
};

export const bgReadingsRepo = {
  async create(input: NewBgReading, userId: string | null): Promise<BgReading> {
    const db = await getDb();
    const ts = nowIso();
    const reading: BgReading = {
      id: uuidv4(),
      user_id: userId,
      created_at: ts,
      updated_at: ts,
      deleted_at: null,
      value_mmol: input.value_mmol,
      source: input.source,
      logged_at: input.logged_at ?? ts,
    };
    await db.runAsync(
      `INSERT INTO bg_readings
       (id, user_id, created_at, updated_at, deleted_at, value_mmol, source, logged_at)
       VALUES (?,?,?,?,?,?,?,?)`,
      [
        reading.id,
        reading.user_id,
        reading.created_at,
        reading.updated_at,
        reading.deleted_at,
        reading.value_mmol,
        reading.source,
        reading.logged_at,
      ]
    );
    await enqueueSync(db, 'bg_readings', reading.id);
    return reading;
  },

  async listAll(): Promise<BgReading[]> {
    const db = await getDb();
    return db.getAllAsync<BgReading>(
      `SELECT * FROM bg_readings WHERE deleted_at IS NULL ORDER BY logged_at DESC`
    );
  },
};
