#!/usr/bin/env node
/**
 * Builds the food-name translations src/data/foodNames/{en,fr,it}.json
 * (food id -> name) for the KH-Rechner. German names stay in the food files
 * themselves; run this after import:blv / import:bls.
 *
 *   npm run import:names
 *
 * Sources (all in data-sources/):
 *   - BLV (Swiss Food Composition Database): the official English, French and
 *     Italian editions, matched by BLV id. Download from
 *     https://naehrwertdaten.ch/en|fr|it/downloads/
 *       Swiss_food_composition_database.xlsx
 *       Base_de_donnees_suisse_des_valeurs_nutritives.xlsx
 *       Banca_dati_svizzera_dei_valori_nutritivi.xlsx
 *   - BLS 4.0: the official English name ("Food name" column) of
 *     BLS_4_0_Daten_2025_DE.xlsx. The BLS has no French or Italian names;
 *     those come from bls-names-fr-it.tsv (BLS code, French, Italian —
 *     translated from the English name, tab-separated).
 * Only foods with carbohydrates are translated (the others aren't
 * searchable). Curated foods and brand drinks carry their translations in
 * src/data/seedFoods.ts / brandDrinks.ts. Open Food Facts products get the
 * names from offFoods.json (`translations`, written by import:off) where
 * the product has them; the others keep the name they're sold under.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import ExcelJS from 'exceljs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = (f) => join(root, 'data-sources', f);
const outDir = join(root, 'src', 'data', 'foodNames');

const BLV_FILES = {
  en: 'Swiss_food_composition_database.xlsx',
  fr: 'Base_de_donnees_suisse_des_valeurs_nutritives.xlsx',
  it: 'Banca_dati_svizzera_dei_valori_nutritivi.xlsx',
};
const BLS_FILE = 'BLS_4_0_Daten_2025_DE.xlsx';
const BLS_FR_IT = 'bls-names-fr-it.tsv';

const cellValue = (v) => {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') {
    if ('result' in v) return v.result ?? '';
    if ('richText' in v) return v.richText.map((t) => t.text).join('');
    if ('text' in v) return v.text;
  }
  return v;
};
const clean = (s) => String(s).replace(/\s+/g, ' ').trim();

async function readRows(file, sheetIndex = 0) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(src(file));
  const rows = [];
  wb.worksheets[sheetIndex].eachRow({ includeEmpty: false }, (row) =>
    rows.push(row.values.slice(1).map(cellValue))
  );
  return rows;
}

const readJson = (f) => JSON.parse(readFileSync(join(root, 'src', 'data', f), 'utf8'));
// Only foods with carbohydrates are offered by the KH-Rechner.
const withCarbs = (f) => new Set(readJson(f).foods.filter((x) => x[4] > 0).map((x) => x[0]));
const blvIds = withCarbs('blvFoods.json');
const blsIds = withCarbs('blsFoods.json');

const names = { en: {}, fr: {}, it: {} };
const missing = { en: 0, fr: 0, it: 0 };

// ------------------------------------------------------------ BLV
for (const [lang, file] of Object.entries(BLV_FILES)) {
  const rows = await readRows(file);
  const headerIdx = rows.findIndex((r) => r[0] === 'ID');
  const byId = new Map();
  // Column 4 is the name in every edition (Name / Nom / Nome).
  for (const r of rows.slice(headerIdx + 1)) if (r[0] !== '') byId.set(`blv-${r[0]}`, clean(r[3]));
  for (const id of blvIds) {
    const name = byId.get(id);
    if (name) names[lang][id] = name;
    else missing[lang] += 1;
  }
}

// ------------------------------------------------------------ BLS
{
  const rows = await readRows(BLS_FILE);
  const header = rows[0];
  const code = header.indexOf('BLS Code');
  const en = header.indexOf('Food name');
  for (const r of rows.slice(1)) {
    const id = `bls-${clean(r[code])}`;
    if (blsIds.has(id) && clean(r[en])) names.en[id] = clean(r[en]);
  }
  for (const id of blsIds) if (!names.en[id]) missing.en += 1;
}
if (existsSync(src(BLS_FR_IT))) {
  for (const line of readFileSync(src(BLS_FR_IT), 'utf8').split(/\r?\n/)) {
    const [code, fr, it] = line.split('\t').map((s) => (s ?? '').trim());
    const id = `bls-${code}`;
    if (!blsIds.has(id)) continue;
    if (fr) names.fr[id] = fr;
    if (it) names.it[id] = it;
  }
}
for (const lang of ['fr', 'it']) for (const id of blsIds) if (!names[lang][id]) missing[lang] += 1;

// ------------------------------------------------------------ Open Food Facts
let offCount = 0;
if (existsSync(join(root, 'src', 'data', 'offFoods.json'))) {
  for (const [id, en, fr, it] of readJson('offFoods.json').translations || []) {
    for (const [lang, name] of Object.entries({ en, fr, it })) if (name) names[lang][id] = name;
    offCount += 1;
  }
}
console.log(`Open Food Facts: ${offCount} products with names in other languages`);

// ------------------------------------------------------------ write
mkdirSync(outDir, { recursive: true });
for (const lang of Object.keys(names)) {
  const sorted = Object.fromEntries(Object.entries(names[lang]).sort(([a], [b]) => (a < b ? -1 : 1)));
  writeFileSync(join(outDir, `${lang}.json`), JSON.stringify(sorted) + '\n');
  console.log(
    `✔ ${lang}: ${Object.keys(sorted).length} names` +
      (missing[lang] ? ` (${missing[lang]} without translation, shown in German)` : '')
  );
}
