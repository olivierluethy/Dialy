#!/usr/bin/env node
/**
 * Imports branded products sold in Switzerland from Open Food Facts
 * (https://world.openfoodfacts.org/data, JSONL dump, ODbL) into
 * src/data/offFoods.json — without the foods the app already has.
 *
 *   1. Download openfoodfacts-products.jsonl.gz (~12 GB; it is streamed,
 *      no need to unpack)
 *   2. npm run import:blv / import:bls first (OFF is de-duplicated against them)
 *   3. npm run import:off -- path/to/openfoodfacts-products.jsonl.gz
 *
 * Takes about 25 minutes. A product is kept when it
 *   - is sold in Switzerland and not marked obsolete,
 *   - has a German name (product_name_de, or the main name of a German
 *     product) that doesn't look French,
 *   - declares carbohydrates per 100 g/ml as sold (not estimated), > 0 g,
 *   - has plausible values: sugar <= carbs, macros <= 100 g, and energy
 *     matching 4·carbs + 9·fat + 4·protein (±25 %, at least ±30 kcal),
 *   - has no Open Food Facts data-quality errors,
 *   - isn't already in the app under the same name (curated foods, brand
 *     drinks, BLV, BLS) and isn't a duplicate within OFF (same name + brand:
 *     the most scanned one wins).
 * Counts per rule and samples go to data-sources/off-import-report.txt.
 * The product's English, French and Italian names (product_name_en/fr/it),
 * where Open Food Facts has them, are kept for the app's other languages
 * (`translations`, merged by `npm run import:names`).
 *
 * License: Open Food Facts is under the Open Database License (ODbL 1.0).
 * src/data/offFoods.json is a derived database and therefore also ODbL —
 * see data-sources/open-food-facts-LICENSE.md. Attribution is shown in the
 * app (KH-Rechner source line, privacy screen).
 */
import { createReadStream, readFileSync, writeFileSync } from 'node:fs';
import { createGunzip } from 'node:zlib';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'src', 'data', 'offFoods.json');
const reportPath = join(root, 'data-sources', 'off-import-report.txt');

const input = process.argv[2];
if (!input) {
  console.error('Usage: npm run import:off -- path/to/openfoodfacts-products.jsonl.gz');
  process.exit(1);
}

// Same key as src/db/seed.ts: case and punctuation don't matter.
const nameKey = (s) => s.toLowerCase().replace(/[^a-zäöüéèàß0-9]+/g, ' ').trim();
const num = (v) =>
  typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' && !isNaN(+v) ? +v : null;
const round1 = (v) => Math.round(v * 10) / 10;

// ------------------------------------------------------------ existing foods
const existing = new Set();
for (const f of ['blvFoods.json', 'blsFoods.json']) {
  for (const food of JSON.parse(readFileSync(join(root, 'src', 'data', f), 'utf8')).foods) {
    existing.add(nameKey(food[1]));
  }
}
for (const f of ['seedFoods.ts', 'brandDrinks.ts']) {
  const src = readFileSync(join(root, 'src', 'data', f), 'utf8');
  for (const m of src.matchAll(/name: '([^']+)'/g)) existing.add(nameKey(m[1]));
  for (const m of src.matchAll(/drink\('[^']+', '([^']+)'/g)) existing.add(nameKey(m[1]));
}
// Brand drinks are curated with Swiss manufacturer values (brandDrinks.ts).
const BRAND_DRINK = /\b(rivella|coca[- ]?cola|fanta|sprite|pepsi|red ?bull|lipton)\b/i;
const DRINK_WORD = /getränk|drink|cola|limonade|tea|tee|rivella|sprite|fanta|bull|zero/i;

// ------------------------------------------------------------ categories
// Open Food Facts category tags -> app category (src/data/foodCategories.ts).
// First match wins, so specific rules come first.
const CATEGORY_RULES = [
  [/^en:(alcoholic-beverages|beers|wines|spirits|ciders|liqueurs)$/, 'Alkoholhaltige Getränke'],
  [/^en:(baby-foods|baby-milks|dietary-supplements|sports-nutrition|protein-powders|meal-replacements)$/, 'Speziallebensmittel'],
  [/^en:(plant-based-milk-alternatives|dairy-substitutes|meat-alternatives|meat-analogues|tofu|plant-based-yogurt-alternatives)$/, 'Pflanzliche Proteinlieferanten und Alternativen zu tierischen Produkten'],
  [/^en:(beverages|non-alcoholic-beverages|sodas|juices|fruit-juices|waters|teas|coffees|iced-teas|energy-drinks)$/, 'Alkoholfreie Getränke'],
  [/^en:(breads|breakfast-cereals|cereal-flakes|mueslis|crispbreads|rusks|toasts|flatbreads|sandwich-breads|viennoiseries)$/, 'Brote, Flocken und Frühstückscerealien'],
  [/^en:(pastas|rices|flours|cereal-grains|cereals-and-potatoes|legumes|potatoes|noodles|gnocchi|semolinas|couscous|polenta|pulses|lentils|beans|chickpeas)$/, 'Getreideprodukte, Hülsenfrüchte und Kartoffeln'],
  [/^en:(chocolates|sweet-snacks|biscuits|cakes|confectioneries|candies|sweet-spreads|honeys|jams|ice-creams|cookies|pastries|chocolate-spreads|cereal-bars|sweeteners|syrups|sugars)$/, 'Süssigkeiten'],
  [/^en:(cheeses|yogurts|milks|creams|dairy-desserts|fermented-milk-products|dairies|butters)$/, 'Milch und Milchprodukte'],
  [/^en:(salty-snacks|chips-and-fries|crisps|crackers|appetizers|popcorn|pretzels)$/, 'Salzige Snacks'],
  [/^en:(nuts|seeds|nuts-and-their-products|peanuts|almonds|nut-butters)$/, 'Nüsse, Samen und Ölfrüchte'],
  [/^en:(meals|prepared-meals|pizzas|sandwiches|soups|prepared-salads|frozen-ready-made-meals|ready-meals|lasagnas|quiches)$/, 'Gerichte'],
  [/^en:(fruits|fruit-based-foods|dried-fruits|compotes|fruit-purees|frozen-fruits)$/, 'Früchte'],
  [/^en:(vegetables|vegetable-based-foods|canned-vegetables|frozen-vegetables|mushrooms)$/, 'Gemüse'],
  [/^en:(sausages|hams|prepared-meats|charcuteries|salamis|cold-cuts)$/, 'Fleisch- und Wurstwaren'],
  [/^en:(meats|poultries|beef|pork|meat)$/, 'Fleisch und Innereien'],
  [/^en:(fishes|seafood|fish-and-seafood|smoked-fishes|canned-fishes)$/, 'Fisch'],
  [/^en:(eggs)$/, 'Eier'],
  [/^en:(fats|vegetable-oils|olive-oils|margarines|vegetable-fats)$/, 'Fette und Öle'],
  [/^en:(condiments|sauces|spices|groceries|cooking-helpers|dressings|mustards|ketchup|stocks)$/, 'Verschiedenes'],
];
const categoryNames = [...new Set(CATEGORY_RULES.map(([, c]) => c))];
function categoryOf(tags) {
  for (const [re, cat] of CATEGORY_RULES) if (tags.some((t) => re.test(t))) return cat;
  return null;
}

// ------------------------------------------------------------ names
const FRENCHISH = /\b(de|du|des|le|la|les|au|aux|avec|et|pour|sans|noir|lait|fromage|moutarde|chocolat)\b|[éèêàç]/i;
const GERMANISH = /\b(mit|und|ohne|aus|für|der|die|das|vom)\b|[äöüß]|(brot|käse|milch|wurst|joghurt|schokolade|kekse|nudeln|saft|sauce|creme|riegel)/i;
const looksGerman = (s) => GERMANISH.test(s) || !FRENCHISH.test(s);

/** "DARK CHOCOLATE®" -> "Dark Chocolate"; trims and collapses spaces. */
function cleanName(s) {
  let n = s.replace(/[®™©]/g, '').replace(/\s+/g, ' ').trim();
  if (n.length > 4 && n === n.toUpperCase() && /[A-ZÄÖÜ]/.test(n)) {
    n = n.toLowerCase().replace(/(^|[\s(-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
  }
  // First letter upper case ("10 milchbrötchen" -> "10 Milchbrötchen").
  return n.replace(/^([^\p{L}]*)(\p{Ll})/u, (m, a, b) => a + b.toUpperCase());
}

// ------------------------------------------------------------ nutrients
/** Newer dumps: nutrition.aggregated_set; older ones: nutriments.<x>_100g. */
function nutrients(p) {
  const agg = p.nutrition && p.nutrition.aggregated_set;
  const aggOk = agg && /^100(g|ml)$/.test(agg.per || '') && (!agg.preparation || agg.preparation === 'as_sold');
  const an = (aggOk && agg.nutrients) || {};
  const old = p.nutriments || {};
  const get = (key, oldKey, unit = 'g') => {
    const e = an[key];
    if (e && num(e.value) !== null && (!e.unit || e.unit === unit)) return { v: num(e.value), src: e.source || '' };
    const o = num(old[oldKey]);
    return o !== null ? { v: o, src: 'nutriments' } : null;
  };
  return {
    carbs: get('carbohydrates', 'carbohydrates_100g'),
    sugars: get('sugars', 'sugars_100g')?.v ?? null,
    fat: get('fat', 'fat_100g')?.v ?? null,
    protein: get('proteins', 'proteins_100g')?.v ?? null,
    kcal: get('energy-kcal', 'energy-kcal_100g', 'kcal')?.v ?? null,
  };
}

// ------------------------------------------------------------ stream
const counts = {};
const samples = {};
const reject = (rule, line) => {
  counts[rule] = (counts[rule] || 0) + 1;
  (samples[rule] ||= []).length < 10 && samples[rule].push(line);
};
const byName = new Map(); // dedupe key -> candidate
let lines = 0;
let latest = 0;
const started = Date.now();

const rl = createInterface({ input: createReadStream(input).pipe(createGunzip()), crlfDelay: Infinity });
for await (const line of rl) {
  if (++lines % 500000 === 0) console.log(`${lines} products read …`);
  if (!line.includes('en:switzerland')) continue; // cheap pre-filter
  let p;
  try {
    p = JSON.parse(line);
  } catch {
    continue;
  }
  if (!(p.countries_tags || []).includes('en:switzerland')) continue;
  const n = nutrients(p);
  if (!n.carbs) continue;
  counts['0 Schweiz, mit KH-Angabe'] = (counts['0 Schweiz, mit KH-Angabe'] || 0) + 1;

  const rawName = p.product_name_de || (p.lang === 'de' ? p.product_name : '') || '';
  const name = cleanName(rawName);
  const brand = cleanName(String(p.brands || '').split(',')[0] || '');
  const { sugars, fat, protein, kcal } = n;
  const carbs = n.carbs.v;
  const info = `${p.code} | ${name || p.product_name || ''} | KH ${carbs} Z ${sugars} F ${fat} E ${protein} kcal ${kcal}`;

  if (p.obsolete) { reject('nicht mehr erhältlich', info); continue; }
  if (name.length < 3) { reject('kein deutscher Name', info); continue; }
  if (!looksGerman(name)) { reject('Name wirkt nicht deutsch', info); continue; }
  if (n.carbs.src === 'estimate') { reject('KH nur geschätzt', info); continue; }
  if (carbs < 0 || carbs > 100) { reject('KH ausserhalb 0–100 g', info); continue; }
  if (sugars !== null && (sugars < 0 || sugars > carbs + 0.5)) { reject('Zucker > KH', info); continue; }
  if (fat === null || protein === null || kcal === null) { reject('Fett/Eiweiss/Energie fehlen (nicht prüfbar)', info); continue; }
  if (fat < 0 || fat > 100 || protein < 0 || carbs + fat + protein > 105) { reject('Nährwerte > 100 g', info); continue; }
  const calc = 4 * carbs + 9 * fat + 4 * protein;
  if (Math.abs(calc - kcal) > Math.max(30, 0.25 * kcal)) { reject('Energie passt nicht zu den Nährwerten', info); continue; }
  if ((p.data_quality_errors_tags || []).length) { reject('Qualitätsfehler laut Open Food Facts', info); continue; }
  if (carbs === 0) { reject('0 g KH (im KH-Rechner ausgeblendet)', info); continue; }

  const withBrand = (n) => (brand && !nameKey(n).includes(nameKey(brand)) ? `${n} (${brand})` : n);
  const display = withBrand(name);
  if (existing.has(nameKey(name)) || existing.has(nameKey(display))) { reject('schon vorhanden (gleicher Name)', info); continue; }
  // The brand may only be in the brand field ("Das Original", brand Rivella).
  if (BRAND_DRINK.test(`${name} ${brand}`) && DRINK_WORD.test(`${name} ${brand}`)) { reject('Markengetränk schon kuratiert', info); continue; }

  // Serving from the package, unless missing, absurd or just "100 g".
  const sq = num(p.serving_quantity);
  const unit = p.serving_quantity_unit === 'ml' ? 'ml' : 'g';
  const portion = sq && sq >= 1 && sq <= 1000 && sq !== 100 ? [round1(sq), unit] : null;

  const candidate = {
    id: `off-${p.code}`,
    name,
    branded: !!brand,
    display,
    // Same product name in the other app languages, if different.
    names: Object.fromEntries(
      ['en', 'fr', 'it']
        .map((lang) => [lang, cleanName(p[`product_name_${lang}`] || '')])
        .filter(([, n]) => n.length >= 3 && nameKey(n) !== nameKey(name))
        .map(([lang, n]) => [lang, withBrand(n)])
    ),
    group: brand || 'Open Food Facts',
    category: categoryOf(p.categories_tags || []),
    carbs: round1(carbs),
    sugars: round1(sugars ?? 0),
    fat: round1(fat),
    portion,
    scans: num(p.unique_scans_n) || 0,
    modified: num(p.last_modified_t) || 0,
  };
  latest = Math.max(latest, candidate.modified);
  const key = nameKey(display);
  const cur = byName.get(key);
  if (!cur) byName.set(key, candidate);
  else {
    reject('Duplikat innerhalb Open Food Facts', info);
    if (candidate.scans > cur.scans || (candidate.scans === cur.scans && candidate.modified > cur.modified)) {
      byName.set(key, candidate);
    }
  }
}

// Same product with and without brand ("Nutella" / "Nutella (Ferrero)"):
// the branded entry wins. Different brands with the same name stay — they
// are different products ("Cashewkerne (Alesto)" / "Cashewkerne (Migros)").
const brandedNames = new Set(
  [...byName.values()].filter((f) => f.branded).map((f) => nameKey(f.name))
);
for (const [key, f] of byName) {
  if (!f.branded && brandedNames.has(nameKey(f.name))) {
    reject('Duplikat innerhalb Open Food Facts (ohne Marke)', `${f.id} | ${f.display}`);
    byName.delete(key);
  }
}

// ------------------------------------------------------------ write
const kept = [...byName.values()].sort((a, b) => a.display.localeCompare(b.display, 'de'));
const version = `Open Food Facts (Stand ${new Date(latest * 1000).toISOString().slice(0, 10)})`;
const portions = kept.filter((f) => f.portion).map((f) => [f.id, ...f.portion]);
const out = {
  source: 'Open Food Facts – https://world.openfoodfacts.org – Open Database License (ODbL) 1.0',
  version,
  fields: ['id', 'name', 'group', 'categories', 'carbs_per_100g', 'sugar_per_100g', 'fat_per_100g'],
  categoryNames,
  foods: kept.map((f) => [
    f.id,
    f.display,
    f.group,
    f.category ? [categoryNames.indexOf(f.category)] : [],
    f.carbs,
    f.sugars,
    f.fat,
  ]),
  // [id, amount, "g" | "ml"]: serving as declared on the package.
  portions,
  // [id, en, fr, it] ("" = none): names in the other app languages.
  translations: kept
    .filter((f) => Object.keys(f.names).length > 0)
    .map((f) => [f.id, f.names.en || '', f.names.fr || '', f.names.it || '']),
};
writeFileSync(outPath, JSON.stringify(out));

const perCategory = {};
for (const f of kept) perCategory[f.category || '(ohne Kategorie)'] = (perCategory[f.category || '(ohne Kategorie)'] || 0) + 1;
const report = [
  `${version} — ${lines} Produkte gelesen in ${((Date.now() - started) / 60000).toFixed(1)} min`,
  '',
  'Regeln (Anzahl):',
  ...Object.entries(counts).sort().map(([k, v]) => `  ${k}: ${v}`),
  `  = importiert: ${kept.length} (davon mit Portion laut Packung: ${portions.length})`,
  '',
  'Kategorien:',
  ...Object.entries(perCategory).sort((a, b) => b[1] - a[1]).map(([k, v]) => `  ${v}  ${k}`),
  '',
  'Beispiele pro Regel:',
  ...Object.entries(samples).sort().flatMap(([k, v]) => [`  [${k}]`, ...v.map((s) => `    ${s}`)]),
].join('\n');
writeFileSync(reportPath, report + '\n');
console.log(report.split('\nBeispiele')[0]);
console.log(`\n✔ ${kept.length} foods -> ${outPath}`);
