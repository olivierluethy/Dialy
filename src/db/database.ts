import * as SQLite from 'expo-sqlite';

/**
 * Local SQLite via expo-sqlite with a thin repository layer.
 *
 * Choice rationale: WatermelonDB requires a custom native module that does not
 * build in the Expo managed (Expo Go) workflow without ejecting. expo-sqlite
 * ships with Expo, runs immediately in Expo Go, and the §7 data model + sync
 * contract are implemented in a small repository/sync layer on top — so the
 * contract holds regardless of the storage engine. (See README.)
 *
 * The local DB is the source of truth for the UI. Writes persist here first,
 * then sync asynchronously to Supabase.
 */

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('dialy.db').then(async (db) => {
      await db.execAsync('PRAGMA journal_mode = WAL;');
      await db.execAsync('PRAGMA foreign_keys = ON;');
      await migrate(db);
      return db;
    });
  }
  return dbPromise;
}

/**
 * Schema. Every syncable table carries the common columns from §7:
 * id (UUID PK, client-generated), user_id, created_at, updated_at,
 * deleted_at (nullable; soft delete only).
 */
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
  glycemic_index REAL NOT NULL,
  portions TEXT NOT NULL
);

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
  glycemic_index REAL NOT NULL,
  be REAL NOT NULL,
  photo_uri TEXT,
  logged_at TEXT NOT NULL
);

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

async function migrate(db: SQLite.SQLiteDatabase): Promise<void> {
  // Simple versioned migration. Bump USER_VERSION when the schema changes.
  const USER_VERSION = 1;
  const row = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version;'
  );
  const current = row?.user_version ?? 0;
  await db.execAsync(SCHEMA);
  if (current < USER_VERSION) {
    await db.execAsync(`PRAGMA user_version = ${USER_VERSION};`);
  }
}
