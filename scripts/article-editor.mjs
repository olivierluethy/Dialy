#!/usr/bin/env node
/**
 * Serves the Dialy editor - Ratgeber articles, KH-Rechner foods and Kontakt
 * messages (tools/article-editor/index.html) - on http://localhost:8095, with
 * the Supabase URL and publishable key from .env.
 *
 * Editing needs an account listed in public.article_editors
 * (supabase/migrations/0006_article_editors.sql).
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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
const config = {
  url: env.EXPO_PUBLIC_SUPABASE_URL || '',
  key: env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
};
if (!config.url || !config.key) {
  console.warn('⚠ EXPO_PUBLIC_SUPABASE_URL / _ANON_KEY missing in .env - the editor will ask for them.');
}

/**
 * The foods the app ships with, as src/db/seed.ts writes them: curated foods
 * and brand drinks, then BLV, BLS and Open Food Facts (if imported) without
 * the ones named like a curated food. The .ts data files load through Node's
 * type stripping (Node 22.18+).
 */
async function bundledFoods() {
  const load = (file) => import(pathToFileURL(join(root, 'src', 'data', file)).href);
  const [{ SEED_FOODS }, { BRAND_DRINKS }, { FOOD_CATEGORIES, USUAL_PORTION_LABEL }] =
    await Promise.all([load('seedFoods.ts'), load('brandDrinks.ts'), load('foodCategories.ts')]);
  const json = (file) => JSON.parse(readFileSync(join(root, 'src', 'data', file), 'utf8'));
  const usual = json('menuchPortions.json').portions;
  const menuch = (id) =>
    usual[id] ? { label: `${USUAL_PORTION_LABEL} (${usual[id]} g)`, grams: usual[id] } : null;
  const sources = [[json('blvFoods.json'), menuch], [json('blsFoods.json'), menuch]];
  if (existsSync(join(root, 'src', 'data', 'offFoods.json'))) {
    const off = json('offFoods.json');
    sources.push([off, (id) => {
      const serving = off.portions?.[id];
      return serving
        ? { label: `Portion laut Packung (${serving[0]} ${serving[1]})`, grams: serving[0] }
        : null;
    }]);
  }

  // Same name key as seed.ts.
  const nameKey = (name) => name.toLowerCase().replace(/[^a-zäöüéèàß0-9]+/g, ' ').trim();
  const curatedNames = new Set(SEED_FOODS.map((f) => nameKey(f.name)));
  const foods = [...SEED_FOODS, ...BRAND_DRINKS];
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
      });
    }
  }
  return { categories: FOOD_CATEGORIES, foods };
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
  const pathname = new URL(req.url, 'http://localhost').pathname;
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
