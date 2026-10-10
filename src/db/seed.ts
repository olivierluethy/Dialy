import { getDb } from '@/db/database';
import { foodsRepo } from '@/db/repositories/foods';
import { SEED_FOODS } from '@/data/seedFoods';
import BLV_FOODS from '@/data/blvFoods.json';
import BLS_FOODS from '@/data/blsFoods.json';
import MENUCH from '@/data/menuchPortions.json';
import { USUAL_PORTION_LABEL } from '@/data/foodCategories';
import { nowIso } from '@/utils/id';

/**
 * Idempotently seed the food database. Ratgeber articles are not seeded: they
 * are read live from Supabase (services/articles.ts). There is no example
 * diary content: diary entries always belong to an account.
 *
 * Foods are upserted by their stable seed id, so re-running is safe.
 */
export async function seedDatabase(): Promise<void> {
  const db = await getDb();
  const ts = nowIso();

  await db.withTransactionAsync(async () => {
    for (const f of SEED_FOODS) {
      await db.runAsync(
        `INSERT INTO foods
           (id, user_id, created_at, updated_at, deleted_at, name, food_group, categories,
            carbs_per_100g, sugar_per_100g, fat_per_100g, glycemic_index, portions)
         VALUES (?,?,?,?,NULL,?,?,?,?,?,?,?,?)
         ON CONFLICT(id) DO UPDATE SET
           name=excluded.name, food_group=excluded.food_group, categories=excluded.categories,
           carbs_per_100g=excluded.carbs_per_100g, sugar_per_100g=excluded.sugar_per_100g,
           fat_per_100g=excluded.fat_per_100g, glycemic_index=excluded.glycemic_index,
           portions=excluded.portions, updated_at=excluded.updated_at`,
        [
          f.id,
          null,
          ts,
          ts,
          f.name,
          f.food_group,
          f.categories.join(';'),
          f.carbs_per_100g,
          f.sugar_per_100g,
          f.fat_per_100g,
          f.glycemic_index,
          JSON.stringify(f.portions),
        ]
      );
    }
  });

  await seedBlvFoods();
  await seedBlsFoods();
  foodsRepo.invalidateSearch();
}

type ImportedFood = [
  id: string,
  name: string,
  group: string,
  categories: number[], // indexes into categoryNames
  carbs: number,
  sugar: number,
  fat: number,
];

interface ImportedFoods {
  version: string;
  categoryNames: string[];
  foods: unknown;
}

// Bump when the stored shape of imported foods changes, to force a re-import.
// 4: imported foods named like a curated one are skipped (no duplicates).
const IMPORT_FORMAT = 4;

// Name key for duplicate checks: case and punctuation don't matter.
const nameKey = (name: string): string =>
  name.toLowerCase().replace(/[^a-zäöüéèàß0-9]+/g, ' ').trim();

// Curated foods carry portions and GI, so they win over an imported food
// with the same name (e.g. BLV "Joghurt, nature" vs. curated "Joghurt nature").
const CURATED_NAMES = new Set(SEED_FOODS.map((f) => nameKey(f.name)));

/**
 * Foods from the Swiss Food Composition Database (BLV, `npm run import:blv`)
 * with usual portions from menuCH (`npm run import:menuch`).
 */
function seedBlvFoods(): Promise<void> {
  return seedImportedFoods('blv', BLV_FOODS, MENUCH.portions as Record<string, number>);
}

/**
 * Foods from the German Federal Food Code (BLS 4.0, `npm run import:bls`),
 * already de-duplicated against BLV and the curated foods, with usual
 * portions from menuCH where a rule matches (`npm run import:menuch`).
 */
function seedBlsFoods(): Promise<void> {
  return seedImportedFoods('bls', BLS_FOODS, MENUCH.portions as Record<string, number>);
}

/**
 * Writes an imported food database (ids "<prefix>-…") into the foods table.
 * Thousands of rows, so only when the imported data changed (marker in
 * app_meta). No GI in these sources.
 */
async function seedImportedFoods(
  prefix: 'blv' | 'bls',
  source: ImportedFoods,
  usual: Record<string, number>
): Promise<void> {
  const db = await getDb();
  const foods = source.foods as ImportedFood[];
  const metaKey = `${prefix}_foods`;
  const marker =
    `${source.version} · ${foods.length} · f${IMPORT_FORMAT} · p${Object.keys(usual).length}`;
  const current = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_meta WHERE key = ?',
    [metaKey]
  );
  if (current?.value === marker) return;

  const ts = nowIso();
  await db.withTransactionAsync(async () => {
    // Foods dropped from a newer version stay soft-deleted.
    await db.runAsync('UPDATE foods SET deleted_at = ? WHERE id LIKE ?', [ts, `${prefix}-%`]);
    for (const [id, name, group, categoryIdx, carbs, sugar, fat] of foods) {
      if (CURATED_NAMES.has(nameKey(name))) continue; // stays soft-deleted
      const categories = categoryIdx.map((i) => source.categoryNames[i]).join(';');
      const grams = usual[id];
      const portions = JSON.stringify(
        grams ? [{ label: `${USUAL_PORTION_LABEL} (${grams} g)`, grams }] : []
      );
      await db.runAsync(
        `INSERT INTO foods
           (id, user_id, created_at, updated_at, deleted_at, name, food_group, categories,
            carbs_per_100g, sugar_per_100g, fat_per_100g, glycemic_index, portions)
         VALUES (?,NULL,?,?,NULL,?,?,?,?,?,?,NULL,?)
         ON CONFLICT(id) DO UPDATE SET
           name=excluded.name, food_group=excluded.food_group, categories=excluded.categories,
           carbs_per_100g=excluded.carbs_per_100g, sugar_per_100g=excluded.sugar_per_100g,
           fat_per_100g=excluded.fat_per_100g, portions=excluded.portions,
           deleted_at=NULL, updated_at=excluded.updated_at`,
        [id, ts, ts, name, group, categories, carbs, sugar, fat, portions]
      );
    }
    await db.runAsync(
      'INSERT INTO app_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      [metaKey, marker]
    );
  });
}
