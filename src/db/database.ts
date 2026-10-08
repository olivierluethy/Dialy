import * as SQLite from 'expo-sqlite';
import { migrate } from '@/db/schema';

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

