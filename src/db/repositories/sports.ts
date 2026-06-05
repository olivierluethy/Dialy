import { getDb } from '@/db/database';
import { enqueueSync } from '@/db/repositories/base';
import { nowIso, uuidv4 } from '@/utils/id';
import type { BgCurvePoint, SportEntry } from '@/types/models';

export type NewSport = Pick<
  SportEntry,
  | 'activity'
  | 'duration_min'
  | 'bg_before_mmol'
  | 'carbs_before_g'
  | 'carbs_before_hours'
  | 'carbs_after_g'
  | 'carbs_after_hours'
  | 'pump_reduction_pct'
  | 'pump_reduction_min'
> & { bg_curve: BgCurvePoint[]; logged_at?: string };

interface SportRow extends Omit<SportEntry, 'bg_curve'> {
  bg_curve: string;
}

function mapRow(row: SportRow): SportEntry {
  let curve: BgCurvePoint[] = [];
  try {
    curve = JSON.parse(row.bg_curve) as BgCurvePoint[];
  } catch {
    curve = [];
  }
  return { ...row, bg_curve: curve };
}

export const sportsRepo = {
  async create(input: NewSport, userId: string | null): Promise<SportEntry> {
    const db = await getDb();
    const ts = nowIso();
    const entry: SportEntry = {
      id: uuidv4(),
      user_id: userId,
      created_at: ts,
      updated_at: ts,
      deleted_at: null,
      activity: input.activity,
      duration_min: input.duration_min,
      bg_before_mmol: input.bg_before_mmol,
      carbs_before_g: input.carbs_before_g,
      carbs_before_hours: input.carbs_before_hours,
      carbs_after_g: input.carbs_after_g,
      carbs_after_hours: input.carbs_after_hours,
      pump_reduction_pct: input.pump_reduction_pct,
      pump_reduction_min: input.pump_reduction_min,
      bg_curve: input.bg_curve,
      logged_at: input.logged_at ?? ts,
    };
    await db.runAsync(
      `INSERT INTO sport_entries
       (id, user_id, created_at, updated_at, deleted_at, activity, duration_min,
        bg_before_mmol, carbs_before_g, carbs_before_hours, carbs_after_g,
        carbs_after_hours, pump_reduction_pct, pump_reduction_min, bg_curve, logged_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        entry.id,
        entry.user_id,
        entry.created_at,
        entry.updated_at,
        entry.deleted_at,
        entry.activity,
        entry.duration_min,
        entry.bg_before_mmol,
        entry.carbs_before_g,
        entry.carbs_before_hours,
        entry.carbs_after_g,
        entry.carbs_after_hours,
        entry.pump_reduction_pct,
        entry.pump_reduction_min,
        JSON.stringify(entry.bg_curve),
        entry.logged_at,
      ]
    );
    await enqueueSync(db, 'sport_entries', entry.id);
    return entry;
  },

  async listAll(): Promise<SportEntry[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<SportRow>(
      `SELECT * FROM sport_entries WHERE deleted_at IS NULL ORDER BY logged_at DESC`
    );
    return rows.map(mapRow);
  },
};
