#!/usr/bin/env node
/**
 * Imports the generic foods of the Swiss Food Composition Database
 * (Schweizer Nährwertdatenbank, BLV) into src/data/blvFoods.json.
 *
 *   1. Download the Excel file from https://naehrwertdaten.ch/de/downloads/
 *   2. npm run import:blv -- path/to/Schweizer_Nahrwertdatenbank.xlsx
 *
 * Kept per food: name, sub-category (shown as food group), top-level
 * categories (for the category filter) and, per 100 g edible portion: available
 * carbohydrates, sugar, total fat. "Sp." (traces) and "<x" become 0. Foods with
 * an unknown ("k.A.") value for any of the three are skipped rather than
 * guessed. The database has no glycaemic index and no portion sizes.
 *
 * Source attribution is required by the BLV terms of use; the app shows it
 * for every BLV food and in the privacy screen.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import ExcelJS from 'exceljs';

const SHEET = 'Generische Lebensmittel';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'src', 'data', 'blvFoods.json');

const input = process.argv[2];
if (!input) {
  console.error('Usage: npm run import:blv -- path/to/Schweizer_Nahrwertdatenbank.xlsx');
  process.exit(1);
}

/** Plain value of an ExcelJS cell (rich text and formulas flattened). */
function cellValue(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') {
    if ('result' in v) return v.result ?? '';
    if ('richText' in v) return v.richText.map((t) => t.text).join('');
    if ('text' in v) return v.text;
  }
  return v;
}

/** Nutrient value: number, 0 for traces / below detection, null if unknown. */
function nutrient(v) {
  if (typeof v === 'number') return Math.round(v * 10) / 10;
  const s = String(v).trim();
  if (s === 'Sp.' || s.startsWith('<')) return 0;
  const n = Number(s.replace(',', '.'));
  return s !== '' && Number.isFinite(n) ? Math.round(n * 10) / 10 : null;
}

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(input);
const ws = wb.getWorksheet(SHEET);
if (!ws) {
  console.error(`Sheet "${SHEET}" not found.`);
  process.exit(1);
}

const rows = [];
ws.eachRow({ includeEmpty: false }, (row) => {
  rows.push(row.values.slice(1).map(cellValue)); // ExcelJS rows are 1-based
});

// Title row, e.g. "Schweizer Nährwertdatenbank – Generische Lebensmittel V 7.1 (01.07.2026)".
const version = String(rows[0]?.[0] ?? '').match(/V\s*[\d.]+\s*\([^)]*\)/)?.[0] ?? 'unbekannt';
const headerIdx = rows.findIndex((r) => r[0] === 'ID');
if (headerIdx < 0) {
  console.error('Header row (starting with "ID") not found.');
  process.exit(1);
}
const header = rows[headerIdx];
const col = (name) => {
  const i = header.indexOf(name);
  if (i < 0) throw new Error(`Column "${name}" not found`);
  return i;
};
const C = {
  id: col('ID'),
  name: col('Name'),
  category: col('Kategorie'),
  unit: col('Bezugseinheit'),
  carbs: col('Kohlenhydrate, verfügbar (g)'),
  sugar: col('Zucker (g)'),
  fat: col('Fett, total (g)'),
};

const foods = [];
let skipped = 0;
for (const r of rows.slice(headerIdx + 1)) {
  if (r[C.id] === '' || r[C.id] === undefined) continue;
  if (!String(r[C.unit]).startsWith('pro 100g')) {
    skipped += 1;
    continue;
  }
  const carbs = nutrient(r[C.carbs]);
  const sugar = nutrient(r[C.sugar]);
  const fat = nutrient(r[C.fat]);
  if (carbs === null || sugar === null || fat === null) {
    skipped += 1;
    continue;
  }
  // "Früchte/Fruchtsäfte;Alkoholfreie Getränke/Frucht- und Gemüsesäfte"
  //   -> group "Fruchtsäfte", categories ["Früchte", "Alkoholfreie Getränke"]
  const paths = String(r[C.category]).split(';').map((p) => p.trim()).filter(Boolean);
  const group = paths[0]?.split('/').pop().trim() || paths[0] || '';
  const categories = [...new Set(paths.map((p) => p.split('/')[0].trim()))];
  foods.push([`blv-${r[C.id]}`, String(r[C.name]).trim(), group, categories, carbs, sugar, fat]);
}
foods.sort((a, b) => a[1].localeCompare(b[1], 'de'));

// Category names are stored once; foods reference them by index.
const categoryNames = [...new Set(foods.flatMap((f) => f[3]))].sort((a, b) => a.localeCompare(b, 'de'));
for (const f of foods) f[3] = f[3].map((c) => categoryNames.indexOf(c));

const out = {
  source: 'Schweizer Nährwertdatenbank, Bundesamt für Lebensmittelsicherheit und Veterinärwesen (BLV)',
  version,
  // Tuple layout keeps the bundled file small; `categories` holds indexes
  // into `categoryNames`.
  fields: ['id', 'name', 'food_group', 'categories', 'carbs_per_100g', 'sugar_per_100g', 'fat_per_100g'],
  categoryNames,
  foods,
};
writeFileSync(outPath, JSON.stringify(out) + '\n');
console.log(`✔ ${foods.length} foods written to src/data/blvFoods.json (${version}), ${skipped} skipped.`);
