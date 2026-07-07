import initSqlJs, { type Database as SqlJsDatabase } from 'sql.js';
import { Asset } from 'expo-asset';

/**
 * WEB implementation of the local database.
 *
 * expo-sqlite ships no web build in SDK 52 (`import 'expo-sqlite'` throws
 * "Cannot find native module 'ExpoSQLite'" in the browser), so Metro picks THIS
 * file on web (platform-specific `.web.ts` resolution) instead of database.ts.
 *
 * It backs the exact same async API the repositories/seed/sync layers use
 * (execAsync / runAsync / getFirstAsync / getAllAsync / withTransactionAsync)
 * with sql.js — SQLite compiled to WebAssembly, running fully in the browser.
 * The database is persisted to IndexedDB so diary entries survive a reload; if
 * persistence is unavailable it degrades to in-memory for the session.
 *
 * The native source of truth remains database.ts on iOS/Android.
 */

// `require` is provided by the Metro runtime; declared for the TS compiler only.
declare const require: (module: string) => number;

type Bind = ReadonlyArray<string | number | null>;

interface WebDatabase {
  execAsync(sql: string): Promise<void>;
  runAsync(
    sql: string,
    params?: Bind
  ): Promise<{ lastInsertRowId: number; changes: number }>;
  getFirstAsync<T>(sql: string, params?: Bind): Promise<T | null>;
  getAllAsync<T>(sql: string, params?: Bind): Promise<T[]>;
  withTransactionAsync(task: () => Promise<void>): Promise<void>;
}

// Schema mirrors src/db/database.ts (native). Keep the two in sync; both use
// `IF NOT EXISTS` so re-running is safe.
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

// --- Tiny IndexedDB blob store (persist the whole SQLite file) --------------
const IDB_NAME = 'dialy-sqlite';
const IDB_STORE = 'db';
const IDB_KEY = 'dialy.db';

function idbOpen(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbLoad(): Promise<Uint8Array | null> {
  try {
    const db = await idbOpen();
    return await new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
      req.onsuccess = () =>
        resolve(req.result ? new Uint8Array(req.result as ArrayBuffer) : null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null; // no IndexedDB (private mode etc.) -> in-memory only
  }
}

async function idbSave(bytes: Uint8Array): Promise<void> {
  try {
    const db = await idbOpen();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      // Copy into a plain ArrayBuffer for structured-clone storage.
      tx.objectStore(IDB_STORE).put(bytes.slice().buffer, IDB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    /* persistence is best-effort */
  }
}

// --- sql.js wrapper matching the expo-sqlite async surface ------------------
let dbPromise: Promise<WebDatabase> | null = null;

export function getDb(): Promise<WebDatabase> {
  if (!dbPromise) dbPromise = open();
  return dbPromise;
}

async function open(): Promise<WebDatabase> {
  const wasmAsset = Asset.fromModule(require('sql.js/dist/sql-wasm.wasm'));
  await wasmAsset.downloadAsync(); // no-op on web; guarantees .uri is set
  const SQL = await initSqlJs({ locateFile: () => wasmAsset.uri });

  const saved = await idbLoad();
  const sql: SqlJsDatabase = saved ? new SQL.Database(saved) : new SQL.Database();
  sql.run('PRAGMA foreign_keys = ON;');
  sql.run(SCHEMA);

  // Debounced persistence so a burst of writes results in one IndexedDB write.
  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  const scheduleSave = (): void => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => void idbSave(sql.export()), 250);
  };

  const query = <T>(s: string, params?: Bind, firstOnly = false): T[] => {
    const stmt = sql.prepare(s);
    try {
      if (params && params.length) stmt.bind([...params]);
      const rows: T[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject() as unknown as T);
        if (firstOnly) break;
      }
      return rows;
    } finally {
      stmt.free();
    }
  };

  return {
    async execAsync(s) {
      sql.run(s);
      scheduleSave();
    },
    async runAsync(s, params) {
      sql.run(s, [...(params ?? [])]);
      const changes = sql.getRowsModified();
      let lastInsertRowId = 0;
      const r = sql.exec('SELECT last_insert_rowid() AS id');
      if (r[0]?.values[0]?.[0] != null) lastInsertRowId = Number(r[0].values[0][0]);
      scheduleSave();
      return { lastInsertRowId, changes };
    },
    async getFirstAsync<T>(s: string, params?: Bind) {
      return query<T>(s, params, true)[0] ?? null;
    },
    async getAllAsync<T>(s: string, params?: Bind) {
      return query<T>(s, params);
    },
    async withTransactionAsync(task) {
      sql.run('BEGIN');
      try {
        await task();
        sql.run('COMMIT');
      } catch (e) {
        sql.run('ROLLBACK');
        throw e;
      }
      scheduleSave();
    },
  };
}
