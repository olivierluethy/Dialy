#!/usr/bin/env node
/**
 * Imports the German Federal Food Code (Bundeslebensmittelschlüssel, BLS 4.0,
 * Max Rubner-Institut, CC BY 4.0) into src/data/blsFoods.json — without the
 * foods the app already has.
 *
 *   1. Download from https://www.blsdb.de/download
 *   2. npm run import:blv -- …  (BLS is de-duplicated against BLV, so first)
 *   3. npm run import:bls -- data-sources/BLS_4_0_Daten_2025_DE.xlsx
 *
 * Duplicate rule — a BLS food is skipped when an existing food (Swiss BLV
 * database or the curated src/data/seedFoods.ts) has
 *   - the same words in its name (ignoring case, umlauts, punctuation,
 *     bracketed notes and word order) — even if the values differ, or
 *   - nearly the same name (>= 75 % of the words) and is a dish (recipes
 *     always differ a little), or
 *   - nearly the same name and similar carbohydrates (within 5 g or 30 %).
 * The existing food always wins, so no food appears twice. Similar names with
 * clearly different values stay (e.g. wheat cooked vs. raw). Every decision
 * is written to data-sources/bls-duplicates-report.txt for review.
 *
 * Attribution (required by CC BY 4.0) is shown in the app.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import ExcelJS from 'exceljs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'src', 'data', 'blsFoods.json');
const reportPath = join(root, 'data-sources', 'bls-duplicates-report.txt');

const input = process.argv[2];
if (!input) {
  console.error('Usage: npm run import:bls -- path/to/BLS_4_0_Daten_2025_DE.xlsx');
  process.exit(1);
}

// BLS food groups (first letter of the BLS code) -> app category (see
// src/data/foodCategories.ts). A few groups are split by name.
const GROUPS = {
  B: ['Brot', () => 'Brote, Flocken und Frühstückscerealien'],
  C: ['Getreide', (n) => (/flocken|flakes|müsli|muesli|cerealien/i.test(n)
    ? 'Brote, Flocken und Frühstückscerealien'
    : 'Getreideprodukte, Hülsenfrüchte und Kartoffeln')],
  D: ['Backwaren', () => 'Süssigkeiten'],
  E: ['Eier, Teigwaren', (n) => (/^(hühnerei|wachtelei|ei |eier |eigelb|eiklar)/i.test(n)
    ? 'Eier'
    : 'Getreideprodukte, Hülsenfrüchte und Kartoffeln')],
  F: ['Obst', (n) => (/saft|nektar|schorle/i.test(n) ? ['Früchte', 'Alkoholfreie Getränke'] : 'Früchte')],
  G: ['Gemüse', () => 'Gemüse'],
  H: ['Hülsenfrüchte, Nüsse, Samen', (n) => (
    /soja|tofu|seitan|tempeh|lupine/i.test(n) ? 'Pflanzliche Proteinlieferanten und Alternativen zu tierischen Produkten'
      : /nuss|nüsse|mandel|kern|samen|marone|kastanie|pistazie|sesam|mohn|leinsaat|chia/i.test(n) ? 'Nüsse, Samen und Ölfrüchte'
        : 'Getreideprodukte, Hülsenfrüchte und Kartoffeln')],
  K: ['Kartoffeln, Pilze', (n) => (/pilz|champignon|trüffel|pfifferling|morchel|steinpilz|austernpilz|shiitake|seitling/i.test(n)
    ? 'Gemüse'
    : 'Getreideprodukte, Hülsenfrüchte und Kartoffeln')],
  M: ['Milch, Milchprodukte', () => 'Milch und Milchprodukte'],
  N: ['Alkoholfreie Getränke', () => 'Alkoholfreie Getränke'],
  P: ['Alkoholische Getränke', () => 'Alkoholhaltige Getränke'],
  Q: ['Fette, Öle', () => 'Fette und Öle'],
  R: ['Würzmittel, Saucen', () => 'Verschiedenes'],
  S: ['Süsswaren', () => 'Süssigkeiten'],
  T: ['Fisch', () => 'Fisch'],
  U: ['Fleisch', () => 'Fleisch und Innereien'],
  V: ['Geflügel, Wild, Innereien', () => 'Fleisch und Innereien'],
  W: ['Wurstwaren', () => 'Fleisch- und Wurstwaren'],
  X: ['Gerichte', () => 'Gerichte'],
  Y: ['Gerichte', () => 'Gerichte'],
};

// --- name comparison -------------------------------------------------------
const fold = (s) =>
  s.toLowerCase().replace(/ß/g, 'ss').replace(/[äàáâ]/g, 'a').replace(/[öòóô]/g, 'o')
    .replace(/[üùúû]/g, 'u').replace(/[éèêë]/g, 'e');
// Names are compared in several variants and the best match counts:
//  - bracketed notes ignored ("Honig (Blütenhonig)" = "Honig") or kept as
//    words ("Reis (gekocht)" = "Reis gekocht"),
//  - with or without light plural/inflection stemming ("Eier" = "Ei",
//    "Süßungsmitteln" = "Süssungsmittel"); without it, split compounds still
//    match ("Hafer Flocken" = "Haferflocken").
const stem = (w) => (w === 'eier' ? 'ei' : w.length > 4 ? w.replace(/(en|n|er|s)$/, '') : w);
const words = (s, keepBrackets, stemmed) => {
  const list = fold(keepBrackets ? s : s.replace(/\([^)]*\)/g, ' '))
    .split(/[^a-z0-9%]+/)
    .filter(Boolean);
  return stemmed ? list.map(stem) : list;
};
const similarCarbs = (a, b) => Math.abs(a - b) <= 5 || Math.abs(a - b) <= 0.3 * Math.max(a, b);
const nameSimilarity = (a, b) =>
  Math.max(
    ...[false, true].flatMap((keepBrackets) =>
      [false, true].map((stemmed) => similarity(a, b, keepBrackets, stemmed))
    )
  );
function similarity(a, b, keepBrackets, stemmed) {
  const la = words(a, keepBrackets, stemmed);
  const lb = words(b, keepBrackets, stemmed);
  if (la.join('') === lb.join('')) return 1;
  const wa = new Set(la);
  const wb = new Set(lb);
  const shared = [...wa].filter((w) => wb.has(w)).length;
  const union = new Set([...wa, ...wb]).size;
  if (union === 0) return 0;
  // Same word set regardless of order counts as identical.
  if (shared === union) return 1;
  // Stemmed words only prove identity; for partial matches they'd merge
  // different words ("Brät" / "Braten").
  if (stemmed) return 0;
  return shared >= 2 ? shared / union : 0;
}

// --- existing foods --------------------------------------------------------
const blv = JSON.parse(readFileSync(join(root, 'src', 'data', 'blvFoods.json'), 'utf8'));
const existing = blv.foods.map(([, name, , , carbs]) => ({ name, carbs, source: 'BLV' }));
const curatedTs = readFileSync(join(root, 'src', 'data', 'seedFoods.ts'), 'utf8');
for (const m of curatedTs.matchAll(/name: '([^']+)'[\s\S]*?carbs_per_100g: ([\d.]+)/g)) {
  existing.push({ name: m[1], carbs: Number(m[2]), source: 'kuratiert' });
}

// --- read BLS --------------------------------------------------------------
const cellValue = (v) => (v && typeof v === 'object' ? (v.result ?? v.text ?? '') : (v ?? ''));
const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(input);
const ws = wb.worksheets[0];
const rows = [];
ws.eachRow({ includeEmpty: false }, (row) => rows.push(Array.from(row.values, cellValue)));
const header = rows[0];
const col = (prefix) => {
  const i = header.findIndex((h) => String(h).startsWith(prefix));
  if (i < 0) throw new Error(`Column "${prefix}…" not found`);
  return i;
};
const C = {
  code: col('BLS Code'),
  name: col('Lebensmittelbezeichnung'),
  carbs: col('CHO '),
  sugar: col('SUGAR '),
  fat: col('FAT '),
};
const num = (v) => (typeof v === 'number' ? Math.round(v * 10) / 10 : Number.isFinite(Number(v)) && v !== '' ? Math.round(Number(v) * 10) / 10 : null);

const categoryNames = [...new Set(Object.values(GROUPS).flatMap(([, f]) => [f('')].flat()))];
const kept = [];
const report = { duplicate: [], keptSimilar: [], incomplete: [] };
for (const r of rows.slice(1)) {
  const code = String(r[C.code] ?? '').trim();
  const name = String(r[C.name] ?? '').trim();
  if (!code || !name) continue;
  const carbs = num(r[C.carbs]);
  const sugar = num(r[C.sugar]);
  const fat = num(r[C.fat]);
  if (carbs === null || sugar === null || fat === null) {
    report.incomplete.push(`${code} ${name}`);
    continue;
  }
  let best = null;
  for (const e of existing) {
    const s = nameSimilarity(name, e.name);
    if (s >= 0.75 && (!best || s > best.s)) best = { s, e };
  }
  const isDish = code[0] === 'X' || code[0] === 'Y';
  if (best && (best.s === 1 || isDish || similarCarbs(carbs, best.e.carbs))) {
    report.duplicate.push(`${name} (${carbs} g KH)  ->  ${best.e.source}: ${best.e.name} (${best.e.carbs} g KH)`);
    continue;
  }
  if (best) report.keptSimilar.push(`${name} (${carbs} g KH)  vs  ${best.e.source}: ${best.e.name} (${best.e.carbs} g KH)`);
  const [groupName, toCategory] = GROUPS[code[0]] ?? ['Verschiedenes', () => 'Verschiedenes'];
  for (const c of [toCategory(name)].flat()) if (!categoryNames.includes(c)) categoryNames.push(c);
  const categories = [toCategory(name)].flat().map((c) => categoryNames.indexOf(c));
  kept.push([`bls-${code}`, name, groupName, categories, carbs, sugar, fat]);
}
kept.sort((a, b) => a[1].localeCompare(b[1], 'de'));

writeFileSync(
  outPath,
  JSON.stringify({
    source: 'Max Rubner-Institut (2025): Bundeslebensmittelschlüssel (BLS), Version 4.0, CC BY 4.0',
    version: 'BLS 4.0 (2025)',
    fields: ['id', 'name', 'food_group', 'categories', 'carbs_per_100g', 'sugar_per_100g', 'fat_per_100g'],
    categoryNames,
    foods: kept,
  }) + '\n'
);
writeFileSync(
  reportPath,
  [
    `BLS import – duplicate check (${new Date().toISOString().slice(0, 10)})`,
    `Imported: ${kept.length}   Skipped as duplicate: ${report.duplicate.length}   Incomplete values: ${report.incomplete.length}`,
    '',
    `== Skipped as duplicate (existing food kept) – ${report.duplicate.length}`,
    ...report.duplicate,
    '',
    `== Imported despite a similar name (different food: values differ clearly) – ${report.keptSimilar.length}`,
    ...report.keptSimilar,
    '',
    `== Skipped: missing carbohydrate/sugar/fat value – ${report.incomplete.length}`,
    ...report.incomplete,
    '',
  ].join('\r\n')
);
console.log(`✔ ${kept.length} BLS foods written to src/data/blsFoods.json`);
console.log(`  ${report.duplicate.length} duplicates skipped, ${report.keptSimilar.length} kept despite a similar name, ${report.incomplete.length} incomplete.`);
console.log('  Details: data-sources/bls-duplicates-report.txt');
