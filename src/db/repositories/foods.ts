import { getDb } from '@/db/database';
import { getLanguage, type Language } from '@/i18n';
import { localizedFoodName } from '@/i18n/foods';
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
  ç: 'c', ñ: 'n', ß: 'ss', œ: 'oe', æ: 'ae',
  // Typographic apostrophe, so "d'orange" finds "d’orange".
  '’': "'",
};

/**
 * Search key: lower-case with umlauts, accents and ligatures folded, so "öl"
 * finds "Thon im Öl", "creme" finds "Crèmeschnitte" and "oeuf" finds "Œuf".
 * (SQLite's lower()/LIKE only fold ASCII, which is why search runs in JS.)
 */
export const foldText = (s: string): string =>
  s.toLowerCase().replace(/[äàáâöòóôüùúûéèêëîïíìçñßœæ’]/g, (c) => FOLD[c] ?? c);

/** The food with its name in `lang` (stored names are German). */
const localize = (food: Food, lang: Language): Food => {
  const name = localizedFoodName(food.id, food.name, lang);
  return name === food.name ? food : { ...food, name };
};

interface IndexedFood {
  food: Food; // name in the index language
  key: string; // folded
  lower: string; // lower-case, umlauts kept
  germanKey: string | null; // folded German name, if it differs
}

// Loaded once per language (foods with carbohydrates only), searched in
// memory. Rebuilt after re-seeding and when the language changes.
let index: { lang: Language; foods: IndexedFood[] } | null = null;

async function loadIndex(): Promise<IndexedFood[]> {
  const lang = getLanguage();
  if (index?.lang !== lang) {
    const rows = await foodsRepo.all();
    const foods = rows
      // Foods without carbohydrates (meat, fish, oils, spirits …) don't
      // matter for counting carbs, so search doesn't offer them.
      .filter((food) => food.carbs_per_100g > 0)
      .map((german) => {
        const food = localize(german, lang);
        const key = foldText(food.name);
        const germanKey = food === german ? null : foldText(german.name);
        return { food, key, lower: food.name.toLowerCase(), germanKey };
      })
      .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
    index = { lang, foods };
  }
  return index.foods;
}

export const foodsRepo = {
  /**
   * Foods whose name (in the UI language) contains every word of the
   * query, in any order and regardless of punctuation ("apfel roh" finds
   * "Apfel, roh"); umlaut-, accent- and case-insensitive. Exact spellings
   * rank before folded ones ("öl": "… im Öl" before "Olive"), then by where
   * the first word matches: start of the name, start of a word ("Reis"
   * before "Milchreis"), anywhere; alphabetical within. In another language
   * the German name matches too, ranked after the translated ones.
   * Optionally limited to one top-level category.
   */
  async search(query: string, category: string | null = null): Promise<Food[]> {
    const all = await loadIndex();
    const foods = category ? all.filter((f) => f.food.categories.includes(category)) : all;
    const terms = foldText(query).split(/[\s,;/]+/).filter(Boolean);
    if (terms.length === 0) return foods.map((f) => f.food);
    const exactTerms = query.toLowerCase().split(/[\s,;/]+/).filter(Boolean);
    const first = terms[0]!;
    const ranked: Array<{ food: Food; rank: number }> = [];
    for (const { food, key, lower, germanKey } of foods) {
      if (!terms.every((t) => key.includes(t))) {
        if (germanKey && terms.every((t) => germanKey.includes(t))) ranked.push({ food, rank: 6 });
        continue;
      }
      const i = key.indexOf(first);
      const position = i === 0 ? 0 : /[a-z0-9]/.test(key[i - 1] ?? '') ? 2 : 1;
      const exact = exactTerms.every((t) => lower.includes(t));
      ranked.push({ food, rank: (exact ? 0 : 3) + position });
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

  /** All foods, names as stored (German). */
  async all(): Promise<Food[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<FoodRow>(
      `SELECT * FROM foods WHERE deleted_at IS NULL ORDER BY name COLLATE NOCASE ASC`
    );
    return rows.map(mapRow);
  },

  /** One food, name in the UI language. */
  async byId(id: string): Promise<Food | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<FoodRow>(
      `SELECT * FROM foods WHERE id = ? AND deleted_at IS NULL`,
      [id]
    );
    return row ? localize(mapRow(row), getLanguage()) : null;
  },

  /**
   * Names of the given foods in the UI language (for diary entries, which
   * keep the name they were logged with). Unknown ids are left out.
   */
  async namesFor(ids: string[]): Promise<Map<string, string>> {
    const names = new Map<string, string>();
    const unique = [...new Set(ids)];
    if (unique.length === 0) return names;
    const db = await getDb();
    const lang = getLanguage();
    // SQLite allows 999 parameters per statement.
    for (let i = 0; i < unique.length; i += 500) {
      const chunk = unique.slice(i, i + 500);
      const rows = await db.getAllAsync<{ id: string; name: string }>(
        `SELECT id, name FROM foods WHERE id IN (${chunk.map(() => '?').join(',')})`,
        chunk
      );
      for (const r of rows) names.set(r.id, localizedFoodName(r.id, r.name, lang));
    }
    return names;
  },
};
