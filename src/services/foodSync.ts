import { getDb } from '@/db/database';
import { foodsRepo } from '@/db/repositories/foods';
import { getSupabase, isNetworkError } from '@/sync/supabaseClient';
import { Sentry } from '@/services/sentry';
import { nowIso } from '@/utils/id';

/**
 * KH-Rechner foods, maintained in Supabase (table `foods`, world-readable;
 * edited in the Dialy-Editor, `npm run editor`). Nothing is bundled with the
 * app: it downloads the table into the local foods table, which also serves
 * offline. After the first full download only rows changed since are
 * fetched. `active = false` (or deleted_at) hides a food.
 */

// app_meta keys: position of the newest row stored so far.
const SINCE_KEY = 'foods_since';
const SINCE_ID_KEY = 'foods_since_id';
// PostgREST returns at most 1000 rows per request.
const PAGE_SIZE = 1000;

const COLUMNS =
  'id, created_at, updated_at, deleted_at, name, food_group, categories, carbs_per_100g, ' +
  'sugar_per_100g, fat_per_100g, glycemic_index, portions, active, names';

interface RemoteFood {
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
  names: unknown;
}

let pulling: Promise<boolean> | null = null;

/**
 * Fetches foods changed since the last pull (all of them the first time) and
 * stores them. True when something changed (the KH-Rechner should then search
 * again). Silent when offline or Supabase isn't configured.
 */
export function pullFoods(): Promise<boolean> {
  // One pull at a time (app start and return to the foreground can overlap).
  pulling ??= pull().finally(() => {
    pulling = null;
  });
  return pulling;
}

/** True once the device has foods (else the KH-Rechner explains why not). */
export async function hasFoods(): Promise<boolean> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM foods');
  return (row?.n ?? 0) > 0;
}

async function readMeta(key: string): Promise<string | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_meta WHERE key = ?', [
    key,
  ]);
  return row?.value ?? null;
}

async function pull(): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  let since = await readMeta(SINCE_KEY);
  let sinceId = (await readMeta(SINCE_ID_KEY)) ?? '';
  let changed = false;

  try {
    for (;;) {
      // Keyset paging over (updated_at, id): an import writes thousands of
      // rows with the same updated_at, so the id breaks the tie.
      let request = sb
        .from('foods')
        .select(COLUMNS)
        .order('updated_at')
        .order('id')
        .limit(PAGE_SIZE);
      if (since) {
        request = request.or(
          `updated_at.gt."${since}",and(updated_at.eq."${since}",id.gt."${sinceId}")`
        );
      }
      const { data, error } = await request;
      if (error) {
        if (!isNetworkError(error)) Sentry.captureException(error);
        break;
      }
      const rows = data as unknown as RemoteFood[];
      if (rows.length === 0) break;
      await storeFoods(rows);
      const last = rows[rows.length - 1]!;
      since = last.updated_at;
      sinceId = last.id;
      changed = true;
      if (rows.length < PAGE_SIZE) break;
    }
  } catch (e) {
    if (!isNetworkError(e)) Sentry.captureException(e);
  }

  if (changed) foodsRepo.invalidateSearch();
  return changed;
}

async function storeFoods(rows: RemoteFood[]): Promise<void> {
  const db = await getDb();
  const hiddenAt = nowIso();
  await db.withTransactionAsync(async () => {
    for (const r of rows) {
      const hidden = !r.active || r.deleted_at !== null;
      await db.runAsync(
        `INSERT INTO foods
           (id, user_id, created_at, updated_at, deleted_at, name, food_group, categories,
            carbs_per_100g, sugar_per_100g, fat_per_100g, glycemic_index, portions, names)
         VALUES (?,NULL,?,?,?,?,?,?,?,?,?,?,?,?)
         ON CONFLICT(id) DO UPDATE SET
           updated_at=excluded.updated_at, deleted_at=excluded.deleted_at,
           name=excluded.name, food_group=excluded.food_group, categories=excluded.categories,
           carbs_per_100g=excluded.carbs_per_100g, sugar_per_100g=excluded.sugar_per_100g,
           fat_per_100g=excluded.fat_per_100g, glycemic_index=excluded.glycemic_index,
           portions=excluded.portions, names=excluded.names`,
        [
          r.id,
          r.created_at,
          r.updated_at,
          hidden ? (r.deleted_at ?? hiddenAt) : null,
          r.name,
          r.food_group,
          r.categories,
          Number(r.carbs_per_100g),
          Number(r.sugar_per_100g),
          Number(r.fat_per_100g),
          r.glycemic_index === null ? null : Number(r.glycemic_index),
          JSON.stringify(Array.isArray(r.portions) ? r.portions : []),
          JSON.stringify(r.names && typeof r.names === 'object' ? r.names : {}),
        ]
      );
    }
    // Last row is the newest (ordered by updated_at, id).
    const last = rows[rows.length - 1]!;
    for (const [key, value] of [
      [SINCE_KEY, last.updated_at],
      [SINCE_ID_KEY, last.id],
    ]) {
      await db.runAsync(
        'INSERT INTO app_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
        [key!, value!]
      );
    }
  });
}
