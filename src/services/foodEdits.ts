import { getDb } from '@/db/database';
import { foodsRepo } from '@/db/repositories/foods';
import { getSupabase, isNetworkError } from '@/sync/supabaseClient';
import { Sentry } from '@/services/sentry';
import { nowIso } from '@/utils/id';

/**
 * KH-Rechner foods changed or added in the Dialy-Editor (`npm run editor`).
 * Supabase table `foods` (world-readable) holds one full row per such food,
 * keyed by the app's food id; `active = false` hides a food. The rows are
 * copied into the local table food_edits, so they work offline and survive
 * re-seeding, and applied over the bundled foods.
 */

// app_meta key: updated_at of the newest row pulled so far.
const SINCE_KEY = 'food_edits_since';
// PostgREST returns at most 1000 rows per request.
const PAGE_SIZE = 1000;

const COLUMNS =
  'id, created_at, updated_at, deleted_at, name, food_group, categories, carbs_per_100g, ' +
  'sugar_per_100g, fat_per_100g, glycemic_index, portions, active';

interface RemoteFoodEdit {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  food_group: string;
  categories: string;
  carbs_per_100g: number;
  sugar_per_100g: number;
  fat_per_100g: number;
  glycemic_index: number | null;
  portions: unknown;
  active: boolean;
}

/**
 * Writes all stored edits into foods: inactive (or removed) ones become
 * soft-deleted, so search no longer offers them. Run after every seed.
 */
export async function applyFoodEdits(): Promise<void> {
  const db = await getDb();
  // "WHERE true": SQLite needs a WHERE in an INSERT … SELECT with ON CONFLICT.
  await db.runAsync(
    `INSERT INTO foods
       (id, user_id, created_at, updated_at, deleted_at, name, food_group, categories,
        carbs_per_100g, sugar_per_100g, fat_per_100g, glycemic_index, portions)
     SELECT id, NULL, created_at, updated_at,
            CASE WHEN active = 1 AND deleted_at IS NULL THEN NULL ELSE ? END,
            name, food_group, categories, carbs_per_100g, sugar_per_100g, fat_per_100g,
            glycemic_index, portions
     FROM food_edits WHERE true
     ON CONFLICT(id) DO UPDATE SET
       name=excluded.name, food_group=excluded.food_group, categories=excluded.categories,
       carbs_per_100g=excluded.carbs_per_100g, sugar_per_100g=excluded.sugar_per_100g,
       fat_per_100g=excluded.fat_per_100g, glycemic_index=excluded.glycemic_index,
       portions=excluded.portions, deleted_at=excluded.deleted_at,
       updated_at=excluded.updated_at`,
    [nowIso()]
  );
}

let pulling: Promise<boolean> | null = null;

/**
 * Fetches edits made since the last pull and applies them. True when
 * something changed (the KH-Rechner should then search again). Silent when
 * offline or Supabase isn't configured.
 */
export function pullFoodEdits(): Promise<boolean> {
  // One pull at a time (app start and return to the foreground can overlap).
  pulling ??= pull().finally(() => {
    pulling = null;
  });
  return pulling;
}

async function pull(): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const db = await getDb();
  const stored = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_meta WHERE key = ?',
    [SINCE_KEY]
  );
  let since = stored?.value ?? null;
  let changed = false;

  try {
    for (;;) {
      let request = sb.from('foods').select(COLUMNS).order('updated_at').limit(PAGE_SIZE);
      if (since) request = request.gt('updated_at', since);
      const { data, error } = await request;
      if (error) {
        if (!isNetworkError(error)) Sentry.captureException(error);
        break;
      }
      const rows = data as unknown as RemoteFoodEdit[];
      if (rows.length === 0) break;
      await storeEdits(rows);
      since = rows[rows.length - 1]!.updated_at;
      changed = true;
      if (rows.length < PAGE_SIZE) break;
    }
  } catch (e) {
    if (!isNetworkError(e)) Sentry.captureException(e);
  }

  if (changed) {
    await applyFoodEdits();
    foodsRepo.invalidateSearch();
  }
  return changed;
}

async function storeEdits(rows: RemoteFoodEdit[]): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    for (const r of rows) {
      await db.runAsync(
        `INSERT INTO food_edits
           (id, created_at, updated_at, deleted_at, name, food_group, categories,
            carbs_per_100g, sugar_per_100g, fat_per_100g, glycemic_index, portions, active)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
         ON CONFLICT(id) DO UPDATE SET
           updated_at=excluded.updated_at, deleted_at=excluded.deleted_at,
           name=excluded.name, food_group=excluded.food_group, categories=excluded.categories,
           carbs_per_100g=excluded.carbs_per_100g, sugar_per_100g=excluded.sugar_per_100g,
           fat_per_100g=excluded.fat_per_100g, glycemic_index=excluded.glycemic_index,
           portions=excluded.portions, active=excluded.active`,
        [
          r.id,
          r.created_at,
          r.updated_at,
          r.deleted_at,
          r.name,
          r.food_group,
          r.categories,
          Number(r.carbs_per_100g),
          Number(r.sugar_per_100g),
          Number(r.fat_per_100g),
          r.glycemic_index === null ? null : Number(r.glycemic_index),
          JSON.stringify(Array.isArray(r.portions) ? r.portions : []),
          r.active ? 1 : 0,
        ]
      );
    }
    // Last row is the newest (ordered by updated_at).
    await db.runAsync(
      'INSERT INTO app_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      [SINCE_KEY, rows[rows.length - 1]!.updated_at]
    );
  });
}
