/**
 * Local database schema + migrations, shared by the native (expo-sqlite,
 * database.ts) and web (sql.js, database.web.ts) implementations.
 *
 * Every syncable table carries the common columns from §7: id (UUID PK,
 * client-generated), user_id, created_at, updated_at, deleted_at (nullable;
 * soft delete only).
 *
 * Schema history (PRAGMA user_version):
 *   1 — initial schema
 *   2 — glycemic_index nullable in foods + meal_entries (the Swiss Food
 *       Composition Database has no GI values)
 */

/** Minimal DB surface needed to migrate; both implementations provide it. */
export interface MigratableDb {
  execAsync(sql: string): Promise<void>;
  getFirstAsync<T>(sql: string): Promise<T | null>;
}

export const SCHEMA_VERSION = 2;

const FOODS_TABLE = `
CREATE TABLE IF NOT EXISTS foods (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  name TEXT NOT NULL,
  food_group TEXT NOT NULL,
  carbs_per_100g REAL NOT NULL,
  sugar_per_100g REAL NOT NULL,
  fat_per_100g REAL NOT NULL,
  glycemic_index REAL,
  portions TEXT NOT NULL
);`;

const MEAL_COLUMNS =
  'id, user_id, created_at, updated_at, deleted_at, food_id, name, grams, carbs_g, ' +
  'sugar_g, fat_g, glycemic_index, be, photo_uri, logged_at';

const MEAL_ENTRIES_TABLE = `
CREATE TABLE IF NOT EXISTS meal_entries (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  food_id TEXT,
  name TEXT NOT NULL,
  grams REAL NOT NULL,
  carbs_g REAL NOT NULL,
  sugar_g REAL NOT NULL,
  fat_g REAL NOT NULL,
  glycemic_index REAL,
  be REAL NOT NULL,
  photo_uri TEXT,
  logged_at TEXT NOT NULL
);`;

/** Latest schema; `IF NOT EXISTS` makes it safe to run on every start. */
const SCHEMA = `
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read_minutes INTEGER NOT NULL,
  published_at TEXT NOT NULL,
  diabetes_type TEXT NOT NULL
);
${FOODS_TABLE}
${MEAL_ENTRIES_TABLE}

CREATE TABLE IF NOT EXISTS sport_entries (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  activity TEXT NOT NULL,
  duration_min INTEGER NOT NULL,
  bg_before_mmol REAL NOT NULL,
  carbs_before_g REAL NOT NULL,
  carbs_before_hours REAL NOT NULL,
  carbs_after_g REAL NOT NULL,
  carbs_after_hours REAL NOT NULL,
  pump_reduction_pct REAL,
  pump_reduction_min REAL,
  bg_curve TEXT NOT NULL,
  logged_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bg_readings (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  value_mmol REAL NOT NULL,
  source TEXT NOT NULL,
  logged_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS profile (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  diabetes_type TEXT NOT NULL,
  is_premium INTEGER NOT NULL DEFAULT 0,
  settings TEXT NOT NULL DEFAULT '{}'
);

/* Small key/value store for local bookkeeping (e.g. imported data versions). */
CREATE TABLE IF NOT EXISTS app_meta (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);

/* Tracks which local rows still need to be pushed to Supabase. */
CREATE TABLE IF NOT EXISTS sync_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT NOT NULL,
  row_id TEXT NOT NULL,
  queued_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_meal_logged ON meal_entries(logged_at);
CREATE INDEX IF NOT EXISTS idx_sport_logged ON sport_entries(logged_at);
CREATE INDEX IF NOT EXISTS idx_bg_logged ON bg_readings(logged_at);
`;

/**
 * v1 -> v2: SQLite can't drop NOT NULL in place, so the two tables are
 * rebuilt. foods only holds seed content (re-seeded on start); meal_entries
 * holds user data, so its rows are copied over.
 */
const MIGRATE_TO_2 = `
DROP TABLE IF EXISTS foods;
${FOODS_TABLE}
ALTER TABLE meal_entries RENAME TO meal_entries_v1;
${MEAL_ENTRIES_TABLE}
INSERT INTO meal_entries (${MEAL_COLUMNS}) SELECT ${MEAL_COLUMNS} FROM meal_entries_v1;
DROP TABLE meal_entries_v1;
CREATE INDEX IF NOT EXISTS idx_meal_logged ON meal_entries(logged_at);
`;

export async function migrate(db: MigratableDb): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
  const current = row?.user_version ?? 0;
  await db.execAsync(SCHEMA);
  // Also runs for fresh installs and for web databases created before
  // user_version was tracked (0) — rebuilding is harmless there.
  if (current < 2) {
    await db.execAsync('BEGIN;');
    try {
      await db.execAsync(MIGRATE_TO_2);
      await db.execAsync('COMMIT;');
    } catch (e) {
      await db.execAsync('ROLLBACK;');
      throw e;
    }
  }
  if (current < SCHEMA_VERSION) {
    await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION};`);
  }
}
