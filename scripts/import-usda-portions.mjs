#!/usr/bin/env node
/**
 * Adds piece portions ("1 Stück, mittel" = 182 g for an apple) to BLV and
 * BLS foods that are eaten by the piece - fruit, vegetables, eggs, Gipfeli -
 * from USDA FoodData Central (SR Legacy, public domain / CC0) and writes
 * src/data/usdaPortions.json.
 *
 *   1. Download "SR Legacy" (CSV) from
 *      https://fdc.nal.usda.gov/download-datasets and unzip it
 *   2. npm run import:usda -- path/to/FoodData_Central_sr_legacy_food_csv_2018-04
 *
 * The names don't match one to one ("Apfel, roh" - "Apples, raw, with
 * skin"), so a fixed table (PIECES) maps a German head word to one USDA food.
 * A BLV/BLS food gets its pieces only if its name starts with that word and
 * describes the whole food: raw, or cooked whole (potatoes, eggs) - never
 * juice, purée, jam, salad, dried, canned … (NOT_WHOLE). Bread and rolls are
 * left out: US slices and rolls are much smaller than Swiss ones.
 *
 * From the USDA measures only pieces are used: small / medium / large become
 * "1 Stück, klein / mittel / gross", a single "1 fruit" becomes "1 Stück"
 * (or "1 Stück, mittel" next to small and large). Cups, slices, wedges,
 * "extra small/large" and pieces under 10 g are skipped.
 * Matches go to data-sources/usda-portions-report.txt for review.
 *
 * Source attribution (USDA FoodData Central) is shown in the app.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'src', 'data', 'usdaPortions.json');
const reportPath = join(root, 'data-sources', 'usda-portions-report.txt');

const dir = process.argv[2];
if (!dir || !existsSync(join(dir, 'food.csv')) || !existsSync(join(dir, 'food_portion.csv'))) {
  console.error(
    (dir ? `✖ No food.csv / food_portion.csv in ${dir}\n\n` : '') +
      'Usage: npm run import:usda -- path/to/FoodData_Central_sr_legacy_food_csv_<date>\n\n' +
      'Download "SR Legacy" (CSV) from https://fdc.nal.usda.gov/download-datasets and unzip it, e.g.\n' +
      '  curl -L -o usda.zip https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip\n' +
      '  mkdir usda && tar -xf usda.zip -C usda'
  );
  process.exit(1);
}

// Same labels as USDA_PORTION_LABELS in src/data/foodCategories.ts.
export const LABELS = {
  piece: '1 Stück',
  small: '1 Stück, klein',
  medium: '1 Stück, mittel',
  large: '1 Stück, gross',
};
const MIN_GRAMS = 10;

/**
 * [German head word (name start), USDA fdc_id, states that count as whole].
 * The head must be followed by ",", " " or "/" (so "Apfelsaft" or
 * "Eier-Frischteigwaren" don't match). RAW = raw only; COOKED also allows
 * the food cooked whole.
 */
const RAW = /\broh\b/i;
const COOKED = /\b(roh|gekocht|gedämpft|gebacken|gegart|pochiert|hart gekocht|weich gekocht|Pellkartoffeln?)\b/i;
const PIECES = [
  [/^(Apfel|Äpfel)/, '171688', RAW],
  [/^Birnen?/, '169118', RAW],
  [/^Bananen?/, '173944', RAW],
  [/^Orangen?/, '169097', RAW],
  [/^Mandarinen?/, '169105', RAW],
  [/^(Clementinen?|Klementinen?)/, '168195', RAW],
  [/^Pfirsich(e)?/, '169928', RAW],
  [/^Nektarinen?/, '169914', RAW],
  [/^Aprikosen?/, '171697', RAW],
  [/^(Pflaumen?|Zwetschgen?)/, '169949', RAW],
  [/^Kiwis?/, '168153', RAW],
  [/^Mangos?/, '169910', RAW],
  [/^Avocados?/, '171705', RAW],
  [/^Feigen?/, '173021', RAW],
  [/^Zitronen?/, '167746', RAW],
  [/^Limetten?/, '168155', RAW],
  [/^Granatäpfel|^Granatapfel/, '169134', RAW],
  [/^(Kaki|Persimone)/, '169941', RAW],
  [/^(Passionsfrucht|Maracuja)/, '169108', RAW],
  [/^Guaven?/, '173044', RAW],
  [/^Quitten?/, '168163', RAW],
  [/^Datteln?/, '168191', /\b(roh|getrocknet|gedörrt)\b/i],
  [/^Kartoffeln?/, '170026', COOKED],
  [/^(Süsskartoffeln?|Süßkartoffeln?|Batate)/, '168482', COOKED],
  [/^(Karotten?|Möhren?|Rüebli)/, '170393', RAW],
  [/^Tomaten?/, '170457', RAW],
  [/^(Peperoni|Paprika), (rot|gelb|grün)/, '170108', RAW],
  [/^Paprikaschoten?/, '170108', RAW],
  [/^Zwiebeln?/, '170000', RAW],
  [/^(Zucchetti|Zucchini)/, '169291', RAW],
  [/^(Gurken?|Salatgurken?)/, '168409', RAW],
  [/^(Hühnerei|Ei|Eier)/, '171287', COOKED],
  [/^(Gipfeli|Buttergipfeli|Croissants?)/, '174987', /./],
];
// Not the whole food - or not eaten by the piece. "mit …" is a dish
// ("Kartoffeln gekocht, mit Kräuterquark"), "gebraten" potatoes are sliced.
const NOT_WHOLE = /\bmit\b|gebraten|saft|mus\b|kompott|konserve|getrocknet|gedörrt|püree|stock|chips|pommes|frites|salat|gratin|suppe|kuchen|torte|wähe|konfitüre|marmelade|gelee|sirup|nektar|kroketten|rösti|puffer|brei|creme|crème|glace|eis\b|gezuckert|kandiert|gesäuert|eingelegt|würfel|scheiben|streifen|pulver|mehl|flocken|stärke|paste|sauce|soße|dörr|frittiert|tiefgefroren|gefüllt|rührei|spiegelei|omelett|eiweiss|eiweiß|eigelb|eiklar|dotter|getrocknetes|aufstrich|schnitz|spalten|stücke|ohne schale.*getrocknet/i;

// ------------------------------------------------------------ USDA CSV
function readCsv(file) {
  const rows = [];
  const text = readFileSync(join(dir, file), 'utf8');
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}

const usdaNames = new Map(readCsv('food.csv').map((r) => [r.fdc_id, r.description]));
const usdaPortions = new Map();
for (const p of readCsv('food_portion.csv')) {
  if (!usdaPortions.has(p.fdc_id)) usdaPortions.set(p.fdc_id, []);
  usdaPortions.get(p.fdc_id).push(p);
}

/** USDA measures of one food -> [[label, grams], ...] (pieces only). */
function pieces(fdcId) {
  const sizes = {};
  let single = null;
  for (const p of usdaPortions.get(fdcId) ?? []) {
    if (Number(p.amount) !== 1) continue;
    const m = p.modifier.toLowerCase();
    const g = Math.round(Number(p.gram_weight));
    if (!(g >= MIN_GRAMS)) continue;
    if (/extra|mini|slice|strip|wedge|cup|italian|plum tomato|cherry/.test(m)) continue;
    const size = /\bsmall\b/.test(m) ? 'small' : /\bmedium\b/.test(m) ? 'medium' : /\blarge\b/.test(m) ? 'large' : null;
    if (size) sizes[size] ??= g;
    else single ??= g; // "fruit", "apricot", "avocado", "date, pitted" …
  }
  if (single !== null && !sizes.medium && (sizes.small || sizes.large)) sizes.medium = single;
  const out = ['small', 'medium', 'large'].filter((s) => sizes[s]).map((s) => [LABELS[s], sizes[s]]);
  return out.length ? out : single !== null ? [[LABELS.piece, single]] : [];
}

// ------------------------------------------------------------ BLV / BLS
const out = {};
const report = [];
for (const file of ['blvFoods.json', 'blsFoods.json']) {
  const { foods } = JSON.parse(readFileSync(join(root, 'src', 'data', file), 'utf8'));
  for (const [id, name] of foods) {
    for (const [head, fdcId, state] of PIECES) {
      const m = name.match(head);
      if (!m) continue;
      const next = name[m[0].length];
      if (next !== undefined && next !== ',' && next !== ' ' && next !== '/') continue;
      if (!state.test(name) || NOT_WHOLE.test(name)) break;
      const p = pieces(fdcId);
      if (p.length) {
        out[id] = p;
        report.push(`${id}\t${name}\t<- ${usdaNames.get(fdcId)} (fdc ${fdcId})\t${p.map(([l, g]) => `${l} ${g} g`).join(', ')}`);
      }
      break;
    }
  }
}

writeFileSync(
  outPath,
  JSON.stringify(
    {
      source: 'U.S. Department of Agriculture, Agricultural Research Service. FoodData Central (SR Legacy), fdc.nal.usda.gov - public domain (CC0 1.0)',
      portions: out,
    },
    null,
    0
  ).replace(/\],"/g, '],\n"') + '\n'
);
writeFileSync(
  reportPath,
  `USDA FoodData Central piece portions - ${report.length} BLV/BLS foods\n\n${report.sort().join('\n')}\n`
);
console.log(`✔ ${report.length} BLV/BLS foods got piece portions (src/data/usdaPortions.json).`);
console.log(`  Review: data-sources/usda-portions-report.txt`);
