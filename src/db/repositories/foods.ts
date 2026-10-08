import { getDb } from '@/db/database';
import type { Food, Portion } from '@/types/models';

interface FoodRow extends Omit<Food, 'portions' | 'categories'> {
  portions: string;
  categories: string; // ";"-separated
}

function mapRow(row: FoodRow): Food {
  let portions: Portion[] = [];
  try {
    portions = JSON.parse(row.portions) as Portion[];
  } catch {
    portions = [];
  }
  const categories = row.categories ? row.categories.split(';') : [];
  return { ...row, portions, categories };
}

// Explicit fold table (instead of String.normalize) so it behaves the same on
// every JS engine, Hermes included.
const FOLD: Record<string, string> = {
  ä: 'a', à: 'a', á: 'a', â: 'a',
  ö: 'o', ò: 'o', ó: 'o', ô: 'o',
  ü: 'u', ù: 'u', ú: 'u', û: 'u',
  é: 'e', è: 'e', ê: 'e', ë: 'e',
  î: 'i', ï: 'i', í: 'i', ì: 'i',
  ç: 'c', ñ: 'n', ß: 'ss',
};

/**
 * Search key: lower-case with umlauts and accents folded, so "öl" finds
 * "Thon im Öl" and "creme" finds "Crèmeschnitte". (SQLite's lower()/LIKE only
 * fold ASCII, which is why search runs in JS.)
 */
export const foldText = (s: string): string =>
  s.toLowerCase().replace(/[äàáâöòóôüùúûéèêëîïíìçñß]/g, (c) => FOLD[c] ?? c);

interface IndexedFood {
  food: Food;
  key: string; // folded
  lower: string; // lower-case, umlauts kept
}

// ~1200 foods: loaded once, searched in memory. Rebuilt after re-seeding.
let index: IndexedFood[] | null = null;

async function loadIndex(): Promise<IndexedFood[]> {
  if (!index) {
    const foods = await foodsRepo.all();
    index = foods
      .map((food) => ({ food, key: foldText(food.name), lower: food.name.toLowerCase() }))
      .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  }
  return index;
}

export const foodsRepo = {
  /**
   * Foods whose name contains the query (umlaut/accent/case-insensitive).
   * Exact spellings rank before folded ones ("öl": "… im Öl" before "Olive"),
   * then matches at the start of the name, at the start of a word ("Reis"
   * before "Milchreis"), anywhere; alphabetical within. Optionally limited
   * to one top-level category.
   */
  async search(query: string, category: string | null = null): Promise<Food[]> {
    const all = await loadIndex();
    const foods = category ? all.filter((f) => f.food.categories.includes(category)) : all;
    const q = foldText(query.trim());
    if (!q) return foods.map((f) => f.food);
    const exact = query.trim().toLowerCase();
    const ranked: Array<{ food: Food; rank: number }> = [];
    for (const { food, key, lower } of foods) {
      const i = key.indexOf(q);
      if (i < 0) continue;
      const position = i === 0 ? 0 : /[a-z0-9]/.test(key[i - 1] ?? '') ? 2 : 1;
      ranked.push({ food, rank: (lower.includes(exact) ? 0 : 3) + position });
    }
    // Array sort is stable, so the alphabetical order holds within a rank.
    return ranked.sort((a, b) => a.rank - b.rank).map((r) => r.food);
  },

  /** Categories that have at least one food. */
  async categories(): Promise<Set<string>> {
    const all = await loadIndex();
    return new Set(all.flatMap((f) => f.food.categories));
  },

  /** Drop the in-memory search index (call after the foods table changes). */
  invalidateSearch(): void {
    index = null;
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
