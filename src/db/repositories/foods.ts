import { getDb } from '@/db/database';
import { getLanguage, type Language } from '@/i18n';
import { localizedFoodName, parseFoodNames } from '@/i18n/foods';
import type { Food, Portion } from '@/types/models';

interface FoodRow extends Omit<Food, 'portions' | 'categories' | 'names'> {
  portions: string;
  categories: string; // ";"-separated
  names: string; // JSON
}

function mapRow(row: FoodRow): Food {
  let portions: Portion[] = [];
  try {
    portions = JSON.parse(row.portions) as Portion[];
  } catch {
    portions = [];
  }
  const categories = row.categories ? row.categories.split(';') : [];
  return { ...row, portions, categories, names: parseFoodNames(row.names) };
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
  const name = localizedFoodName(food.name, food.names, lang);
  return name === food.name ? food : { ...food, name };
};

interface IndexedFood {
  food: Food; // name in the index language
  key: string; // folded
  lower: string; // lower-case, umlauts kept
  germanKey: string | null; // folded German name, if it differs
  /** Searchable words from the displayed, original and translated names. */
  tokens: string[];
}

// Loaded once per language (foods with carbohydrates only), searched in
// memory. Rebuilt after foods were downloaded and when the language changes.
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
        // Names in `names` act as useful aliases when a user knows a food by
        // a different language. De-duplicating here keeps the hot search loop
        // small even for the full ~23k catalogue.
        const aliases = [food.name, german.name, ...Object.values(german.names ?? {})]
          .map(foldText)
          .join(' ');
        const tokens = [...new Set(aliases.split(/[^a-z0-9]+/).filter((token) => token.length > 1))];
        return { food, key, lower: food.name.toLowerCase(), germanKey, tokens };
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
    const normalizedQuery = terms.join(' ');
    const ranked: Array<{ food: Food; score: number }> = [];
    for (const candidate of foods) {
      const score = scoreFood(candidate, terms, exactTerms, normalizedQuery);
      if (score !== null) ranked.push({ food: candidate.food, score });
    }
    // Scores deliberately leave large gaps: an exact phrase always wins over
    // prefixes, which win over token/substring matches, then fuzzy matches.
    // Alphabetical tie-breaking makes the result order predictable.
    return ranked
      .sort((a, b) => a.score - b.score || a.food.name.localeCompare(b.food.name))
      .map((r) => r.food);
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
      const rows = await db.getAllAsync<{ id: string; name: string; names: string }>(
        `SELECT id, name, names FROM foods WHERE id IN (${chunk.map(() => '?').join(',')})`,
        chunk
      );
      for (const r of rows) names.set(r.id, localizedFoodName(r.name, parseFoodNames(r.names), lang));
    }
    return names;
  },
};

/**
 * Weighted relevance model. It is intentionally conservative: fuzzy matching
 * only accepts short edit distances against complete words, so a typo such as
 * "bananna" finds banana without filling the list with unrelated foods.
 */
function scoreFood(
  candidate: IndexedFood,
  terms: string[],
  exactTerms: string[],
  normalizedQuery: string
): number | null {
  const { key, lower, germanKey, tokens } = candidate;
  if (key === normalizedQuery) return 0;
  if (key.startsWith(normalizedQuery)) return 10;

  let score = 0;
  for (let i = 0; i < terms.length; i += 1) {
    const term = terms[i]!;
    const isExactCase = exactTerms.includes(term) && lower.includes(term);
    if (tokens.includes(term)) {
      score += isExactCase ? 20 : 24;
      continue;
    }
    if (tokens.some((token) => token.startsWith(term))) {
      score += 40;
      continue;
    }
    if (key.includes(term) || germanKey?.includes(term)) {
      score += 60;
      continue;
    }

    // Candidate pruning: only compare words with a compatible first letter
    // and length. This keeps a 23k-item catalogue responsive on mobile.
    const maxDistance = term.length <= 4 ? 1 : term.length <= 8 ? 2 : 3;
    let nearest = Number.POSITIVE_INFINITY;
    for (const token of tokens) {
      if (Math.abs(token.length - term.length) > maxDistance || token[0] !== term[0]) continue;
      nearest = Math.min(nearest, damerauLevenshteinWithin(term, token, maxDistance));
      if (nearest === 0) break;
    }
    if (nearest > maxDistance) return null;
    score += 100 + nearest * 12;
  }
  return score;
}

/** Bounded Damerau-Levenshtein: insertion, deletion, substitution, transpose. */
export function damerauLevenshteinWithin(a: string, b: string, limit: number): number {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  let beforePrevious: number[] | null = null;
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    let rowMin = current[0]!;
    for (let j = 1; j <= b.length; j += 1) {
      const substitution = previous[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1);
      const insertion = current[j - 1]! + 1;
      const deletion = previous[j]! + 1;
      const transpose =
        i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1] && beforePrevious
          ? beforePrevious[j - 2]! + 1
          : Number.POSITIVE_INFINITY;
      const value = Math.min(substitution, insertion, deletion, transpose);
      current.push(value);
      rowMin = Math.min(rowMin, value);
    }
    if (rowMin > limit) return limit + 1;
    beforePrevious = previous;
    previous = current;
  }
  return previous[b.length]!;
}
