import { getDb } from '@/db/database';
import type { Food, Portion } from '@/types/models';

interface FoodRow extends Omit<Food, 'portions'> {
  portions: string;
}

function mapRow(row: FoodRow): Food {
  let portions: Portion[] = [];
  try {
    portions = JSON.parse(row.portions) as Portion[];
  } catch {
    portions = [];
  }
  return { ...row, portions };
}

export const foodsRepo = {
  async search(query: string): Promise<Food[]> {
    const db = await getDb();
    const q = `%${query.trim().toLowerCase()}%`;
    const rows = await db.getAllAsync<FoodRow>(
      `SELECT * FROM foods
       WHERE deleted_at IS NULL AND lower(name) LIKE ?
       ORDER BY name COLLATE NOCASE ASC`,
      [q]
    );
    return rows.map(mapRow);
  },

  async all(): Promise<Food[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<FoodRow>(
      `SELECT * FROM foods WHERE deleted_at IS NULL ORDER BY name COLLATE NOCASE ASC`
    );
    return rows.map(mapRow);
  },

  async byId(id: string): Promise<Food | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<FoodRow>(
      `SELECT * FROM foods WHERE id = ? AND deleted_at IS NULL`,
      [id]
    );
    return row ? mapRow(row) : null;
  },
};
