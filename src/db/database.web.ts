import initSqlJs, { type Database as SqlJsDatabase } from 'sql.js';
import { Asset } from 'expo-asset';
import { migrate } from '@/db/schema';

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

  const db: WebDatabase = {
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

  // Same schema + migrations as native (src/db/schema.ts).
  await migrate(db);
  return db;
}
