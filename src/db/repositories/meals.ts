import { getDb } from '@/db/database';
import { enqueueSync } from '@/db/repositories/base';
import { nowIso, uuidv4 } from '@/utils/id';
import type { MealEntry } from '@/types/models';

export type NewMeal = Pick<
  MealEntry,
  | 'food_id'
  | 'name'
  | 'grams'
  | 'carbs_g'
  | 'sugar_g'
  | 'fat_g'
  | 'glycemic_index'
  | 'be'
  | 'photo_uri'
> & { logged_at?: string };

export const mealsRepo = {
  async create(input: NewMeal, userId: string | null): Promise<MealEntry> {
    const db = await getDb();
    const ts = nowIso();
    const entry: MealEntry = {
      id: uuidv4(),
      user_id: userId,
      created_at: ts,
      updated_at: ts,
      deleted_at: null,
      food_id: input.food_id,
      name: input.name,
      grams: input.grams,
      carbs_g: input.carbs_g,
      sugar_g: input.sugar_g,
      fat_g: input.fat_g,
      glycemic_index: input.glycemic_index,
      be: input.be,
      photo_uri: input.photo_uri,
      logged_at: input.logged_at ?? ts,
    };
    await db.runAsync(
      `INSERT INTO meal_entries
       (id, user_id, created_at, updated_at, deleted_at, food_id, name, grams,
        carbs_g, sugar_g, fat_g, glycemic_index, be, photo_uri, logged_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        entry.id,
        entry.user_id,
        entry.created_at,
        entry.updated_at,
        entry.deleted_at,
        entry.food_id,
        entry.name,
        entry.grams,
        entry.carbs_g,
        entry.sugar_g,
        entry.fat_g,
        entry.glycemic_index,
        entry.be,
        entry.photo_uri,
        entry.logged_at,
      ]
    );
    await enqueueSync(db, 'meal_entries', entry.id);
    return entry;
  },

  /** Entries of one account only — a device can hold several accounts. */
  async listAll(userId: string): Promise<MealEntry[]> {
    const db = await getDb();
    return db.getAllAsync<MealEntry>(
      `SELECT * FROM meal_entries WHERE deleted_at IS NULL AND user_id = ? ORDER BY logged_at DESC`,
      [userId]
    );
  },
};
