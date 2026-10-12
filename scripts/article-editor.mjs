#!/usr/bin/env node
/**
 * Serves the Dialy editor - Ratgeber articles, KH-Rechner foods, Kontakt
 * messages and backups (tools/article-editor/index.html) - on
 * http://localhost:8095, with the Supabase URL and publishable key from .env.
 *
 * Editing needs an account listed in public.article_editors
 * (supabase/migrations/0006_article_editors.sql). Backing up user accounts
 * needs SUPABASE_SERVICE_ROLE_KEY in .env (used only by this server).
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 8095;

function readEnv() {
  const envPath = join(root, '.env');
  const env = {};
  if (!existsSync(envPath)) return env;
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return env;
}

const env = { ...readEnv(), ...process.env };
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || '';
const config = {
  url: env.EXPO_PUBLIC_SUPABASE_URL || '',
  key: env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  // Whether the user accounts can be backed up (the key itself stays here).
  usersBackup: Boolean(env.EXPO_PUBLIC_SUPABASE_URL && serviceKey),
};
if (!config.url || !config.key) {
  console.warn('⚠ EXPO_PUBLIC_SUPABASE_URL / _ANON_KEY missing in .env - the editor will ask for them.');
}
if (!serviceKey) {
  console.warn('ℹ SUPABASE_SERVICE_ROLE_KEY missing in .env - backups without user accounts.');
}

// ------------------------------------------------------------ user accounts
// Accounts (auth.users) and their synced data are only readable with the
// service-role key, so the editor gets them from here. The key never leaves
// this process; every request must carry the access token of an editor
// (public.article_editors).
const USER_TABLES = ['profiles', 'meal_entries', 'sport_entries', 'bg_readings'];
const admin = config.usersBackup
  ? createClient(config.url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function requireEditor(req) {
  if (!admin) throw new HttpError(501, 'SUPABASE_SERVICE_ROLE_KEY fehlt in .env.');
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const { data, error } = token ? await admin.auth.getUser(token) : { data: null };
  if (error || !data?.user) throw new HttpError(401, 'Nicht angemeldet.');
  const editor = await admin.from('article_editors').select('user_id').eq('user_id', data.user.id).maybeSingle();
  if (editor.error) throw editor.error;
  if (!editor.data) throw new HttpError(403, 'Kein Editor-Konto.');
}

async function allRows(table, columns = '*') {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await admin.from(table).select(columns).order('id').range(from, from + 999);
    if (error) throw error;
    rows.push(...data);
    if (data.length < 1000) break;
  }
  return rows;
}

async function allUsers() {
  const users = [];
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 1000) break;
  }
  return users;
}

// Password hashes aren't available through the API: restored accounts sign
// in again with "Passwort vergessen".
const accountOf = (u) => ({
  id: u.id,
  email: u.email ?? null,
  phone: u.phone || null,
  created_at: u.created_at,
  last_sign_in_at: u.last_sign_in_at ?? null,
  email_confirmed_at: u.email_confirmed_at ?? null,
  user_metadata: u.user_metadata ?? {},
});

async function usersBackup() {
  const tables = { users: (await allUsers()).map(accountOf) };
  for (const table of USER_TABLES) tables[table] = await allRows(table);
  return tables;
}

/**
 * Re-creates accounts that no longer exist (same id) and adds data rows
 * that are missing. Existing rows are left alone: devices sync them
 * last-write-wins, so the server copy is as new as the backup or newer.
 * dryRun only counts.
 */
async function usersRestore(backup, dryRun) {
  const result = { users: 0, skipped: 0 };
  const existing = new Set((await allUsers()).map((u) => u.id));
  for (const account of Array.isArray(backup.users) ? backup.users : []) {
    if (!account || typeof account.id !== 'string' || existing.has(account.id)) continue;
    if (!account.email) {
      result.skipped++;
      continue;
    }
    if (!dryRun) {
      const { error } = await admin.auth.admin.createUser({
        id: account.id,
        email: account.email,
        email_confirm: Boolean(account.email_confirmed_at),
        user_metadata: account.user_metadata || {},
      });
      if (error) throw new Error(`${account.email}: ${error.message}`);
    }
    existing.add(account.id);
    result.users++;
  }
  for (const table of USER_TABLES) {
    const rows = Array.isArray(backup[table]) ? backup[table] : [];
    const have = new Set((await allRows(table, 'id')).map((r) => r.id));
    const missing = rows.filter((r) => r && !have.has(r.id) && existing.has(r.user_id));
    result[table] = missing.length;
    if (dryRun) continue;
    for (let i = 0; i < missing.length; i += 500) {
      const { error } = await admin.from(table)
        .upsert(missing.slice(i, i + 500), { onConflict: 'id', ignoreDuplicates: true });
      if (error) throw error;
    }
  }
  return result;
}

const MAX_BODY = 200 * 1024 * 1024;
async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw new HttpError(413, 'Backup zu gross.');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

const api = {
  'GET /api/users-backup': () => usersBackup(),
  'POST /api/users-restore': async (req, url) =>
    usersRestore(await readJson(req), url.searchParams.get('dryRun') === '1'),
};

/**
 * The foods from the data files in src/data, for transferring them into the
 * database (public.foods, 0013_foods_from_database.sql) - the app no longer
 * bundles them. Curated foods and brand drinks, then BLV, BLS and Open Food
 * Facts (if imported) without the ones named like a curated food, with their
 * names in en/fr/it (src/data/foodNames). The .ts data files load through
 * Node's type stripping (Node 22.18+).
 */
async function bundledFoods() {
  const load = (file) => import(pathToFileURL(join(root, 'src', 'data', file)).href);
  const [
    { SEED_FOODS },
    { BRAND_DRINKS },
    { FOOD_CATEGORIES, USUAL_PORTION_LABEL, PACKAGE_PORTION_LABEL },
    { default: de },
  ] = await Promise.all([
    load('seedFoods.ts'),
    load('brandDrinks.ts'),
    load('foodCategories.ts'),
    import(pathToFileURL(join(root, 'src', 'i18n', 'locales', 'de.ts')).href),
  ]);
  const json = (file) => JSON.parse(readFileSync(join(root, 'src', 'data', file), 'utf8'));
  const translations = Object.fromEntries(
    ['en', 'fr', 'it'].map((lang) => [lang, json(`foodNames/${lang}.json`)]));
  const namesFor = (id) => {
    const names = {};
    for (const [lang, map] of Object.entries(translations)) if (map[id]) names[lang] = map[id];
    return names;
  };
  const usual = json('menuchPortions.json').portions;
  const menuch = (id) =>
    usual[id] ? { label: `${USUAL_PORTION_LABEL} (${usual[id]} g)`, grams: usual[id] } : null;
  const sources = [[json('blvFoods.json'), menuch], [json('blsFoods.json'), menuch]];
  if (existsSync(join(root, 'src', 'data', 'offFoods.json'))) {
    const off = json('offFoods.json');
    // [id, amount, "g" | "ml"], as in seed.ts.
    const servings = new Map((off.portions || []).map(([id, amount, unit]) => [id, [amount, unit]]));
    sources.push([off, (id) => {
      const serving = servings.get(id);
      return serving
        ? { label: `${PACKAGE_PORTION_LABEL} (${serving[0]} ${serving[1]})`, grams: serving[0] }
        : null;
    }]);
  }

  // Same name key as seed.ts.
  const nameKey = (name) => name.toLowerCase().replace(/[^a-zäöüéèàß0-9]+/g, ' ').trim();
  const curatedNames = new Set(SEED_FOODS.map((f) => nameKey(f.name)));
  const foods = [...SEED_FOODS, ...BRAND_DRINKS].map(({ names, ...food }) => ({
    ...food,
    names: { en: names.en, fr: names.fr, it: names.it },
  }));
  for (const [source, portionFor] of sources) {
    for (const [id, name, group, categoryIdx, carbs, sugar, fat] of source.foods) {
      if (curatedNames.has(nameKey(name))) continue;
      const portion = portionFor(id);
      foods.push({
        id,
        name,
        food_group: group,
        categories: categoryIdx.map((i) => source.categoryNames[i]),
        carbs_per_100g: carbs,
        sugar_per_100g: sugar,
        fat_per_100g: fat,
        glycemic_index: null,
        portions: portion ? [portion] : [],
        names: namesFor(id),
      });
    }
  }
  // Chip labels as in the German app.
  const categories = FOOD_CATEGORIES.map((name) => ({ name, label: de.foodCategories[name] ?? name }));
  return { categories, foods };
}

const files = {
  '/': {
    path: join(root, 'tools', 'article-editor', 'index.html'),
    type: 'text/html; charset=utf-8',
    // "<" escaped so the values can't close the script tag.
    transform: (html) =>
      html.replace('/*CONFIG*/null', JSON.stringify(config).replace(/</g, '\\u003c')),
  },
  '/supabase.js': {
    path: join(root, 'node_modules', '@supabase', 'supabase-js', 'dist', 'umd', 'supabase.js'),
    type: 'text/javascript; charset=utf-8',
  },
};

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname;
  const handler = api[`${req.method} ${pathname}`];
  if (handler) {
    try {
      await requireEditor(req);
      const body = JSON.stringify(await handler(req, url));
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(body);
    } catch (e) {
      if (!e.status) console.error(`✖ ${pathname}:`, e);
      res.writeHead(e.status || 500, { 'Content-Type': 'text/plain; charset=utf-8' }).end(String(e?.message || e));
    }
    return;
  }
  if (pathname === '/foods.json') {
    try {
      const body = JSON.stringify(await bundledFoods());
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(body);
    } catch (e) {
      console.error('✖ foods.json:', e);
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end(String(e?.message || e));
    }
    return;
  }
  const file = files[pathname];
  if (!file) {
    res.writeHead(404).end('Not found');
    return;
  }
  const body = readFileSync(file.path, 'utf8');
  res.writeHead(200, { 'Content-Type': file.type, 'Cache-Control': 'no-store' });
  res.end(file.transform ? file.transform(body) : body);
}).listen(PORT, '127.0.0.1', () => {
  console.log(`✔ Dialy-Editor: http://localhost:${PORT}  (Ctrl+C beendet)`);
});
