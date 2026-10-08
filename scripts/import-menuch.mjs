#!/usr/bin/env node
/**
 * Derives a "usual portion" for BLV foods from the Swiss National Nutrition
 * Survey menuCH 2014-15 (BLV) and writes src/data/menuchPortions.json.
 *
 *   1. Download "Portionsgrössen pro Mahlzeit" from
 *      https://ckan.opendata.swiss/dataset/groups/menuch-portionsgrossen
 *   2. npm run import:menuch -- data-sources/menuCH_portion_sizes_2014_2015_per_meal.xlsx
 *
 * menuCH reports median portions (g, as eaten) per food *category* and meal.
 * Per category the meal with the most observations is used; categories with
 * fewer than MIN_N observations are skipped. The rules below map BLV foods to
 * categories. They only cover foods in their eaten state (e.g. "Teigwaren …
 * gekocht", never "… trocken"), so a portion never gets attached to a raw or
 * dry ingredient. Run `npm run import:blv` first.
 *
 * Source attribution (BLV, menuCH 2014-15) is shown in the app.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import ExcelJS from 'exceljs';

const SHEET = 'pro Mahlzeit';
const MIN_N = 15;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const blvPath = join(root, 'src', 'data', 'blvFoods.json');
const outPath = join(root, 'src', 'data', 'menuchPortions.json');

/**
 * [menuCH category, BLV name pattern, optional BLV top-level category guard].
 * First match wins, so specific rules come before general ones.
 */
const FRUIT = 'Früchte';
const VEG = 'Gemüse';
const RULES = [
  // Früchte
  ['Apfel', /^Apfel, roh$/],
  ['Birne', /^Birne, roh$/],
  ['Mandarine und Klementine', /^Mandarine, roh$/],
  ['Orange', /^Orange, roh$/],
  ['Traube', /^Traube, weiss, roh$/],
  ['Beeren', /^(Beeren \(Durchschnitt\)|Brombeere|Erdbeere|Heidelbeere|Himbeere|Johannisbeere, (rot|schwarz)|Stachelbeere|Preiselbeere), roh$/],
  ['Getrocknete Früchte', /^(Apfel, geschält|Aprikose|Banane|Birne|Dattel|Feige|Früchte \(Durchschnitt\)|Mango|Pflaume|Rosine), (getrocknet|gedörrt)$/],
  ['Gekochte Früchte in Dosen, total', /Konserve/, FRUIT],
  ['Gekochte Früchte (nicht aus der Dose), total', /^(Apfel|Aprikose|Birne|Kirsche|Mirabelle|Pflaume|Quitte|Zwetschge|Beeren \(Durchschnitt\)|Früchte \(Durchschnitt\)), (gedünstet|gekocht)/],
  ['Fruchtsaft', /^(Apfelsaft|Ananassaft|Birnensaft|Orangensaft|Traubensaft|Fruchtsaft \(Durchschnitt\), ungezuckert)$/],
  ['Frischobst, total', /^(Ananas|Aprikose|Banane|Feige|Granatapfel|Grapefruit \(weiss oder rot\)|Kaki|Kirsche|Kiwi|Litschi|Mango|Mirabelle|Nektarine|Papaya, reif|Passionsfrucht|Pfirsich, gelb|Pflaume|Wassermelone|Zuckermelone \(Honigmelone\)|Zwetschge|Früchte \(Durchschnitt\)|Zitrusfrüchte \(Durchschnitt\)), roh$/],

  // Brot, Flocken
  ['Brot', /^(Bauernbrot|Baumnussbrot|Brot \(Durchschnitt\)|Bürli|St\. Galler Bürli|Butterweggli|Butterzopf|Halbweissbrot|Laugenbrötli|Mütschli|Pariserbrot|Roggenbrot|Roggenschrotbrot|Ruchbrot|Semmeli|Tessinerbrot|Toastbrot|Walliser Roggenbrot|Weissbrot|Weizenvollkornbrot)/],
  ['Knäckebrot und Crackers', /^(Knäckebrot|Zwieback|Vollkornreiswaffel|Maiswaffel|Cracker, Salzgebäck)/],
  ['Ungesüsste Getreide- und Müesliflocken (inkl. Frühstücksflocken)', /^(Haferflocken|Gerstenflocken|Hirseflocken, Vollkorn|Weizenflocken, Vollkorn|Getreideflocken \(Durchschnitt\)|Cornflakes$|Getreide-Flakes aus Vollkornweizen und Reis, nature|Müeslimischung, .*ungesüsst)/],
  ['Gesüsste Frühstücksflocken', /^(Cornflakes mit Zucker|Gepuffte|Getreide-Flakes aus Vollkornweizen und Reis mit|Getreide-Kissen|Knuspermüesli|Mais-Bällchen|Puffreis|Müeslimischung, .*gezuckert)/],
  ['Essfertiges Müesli', /^(Birchermüesli, zubereitet|Haferbrei, zubereitet)/],

  // Getreide, Kartoffeln, Hülsenfrüchte (only cooked / prepared)
  ['Reis', /^Reis (parboiled|poliert|unpoliert), gekocht/],
  ['Maisgriess, Polenta', /^(Maisgriess, gekocht|Polenta nera .*gekocht)/],
  ['Gefüllte Teigwaren', /^Teigwaren, frisch, gefüllt .*gekocht/],
  ['Teigwaren, total', /^Teigwaren (mit|ohne) Ei.*gekocht/],
  ['Spätzli', /^Spätzli/],
  ['Couscous', /^Couscous-Körner .*gekocht/],
  ['Pommes frites', /^(Pommes Frites|Ofen-Frites)/],
  ['Kartoffelstock', /^(Instant-)?Kartoffelstock, zubereitet/],
  ['Rösti', /^Rösti/],
  ['Kartoffel-Gnocchi', /^Kartoffelgnocchi, gekocht/],
  ['Kartoffelsalat', /^Kartoffelsalat/],
  ['Süsskartoffel', /^Süsskartoffel, (gedämpft|im Ofen)/],
  ['Kartoffeln', /^Kartoffel, .*(gekocht|gedämpft|gebacken)/],
  ['Bohnen', /^(Bohne \(alle Arten\)|Sojabohne), gekocht/],
  ['Kircherbsen', /^Kichererbse, gekocht/],
  ['Linsen', /^Linse, .*gekocht/],

  // Milchprodukte
  ['Milchmischgetränke', /^(Kakaogetränk, gezuckert, zubereitet|Malzgetränk .*zubereitet)/],
  ['Kaffee mit Milch', /^(Cappuccino|Latte macchiato|Milchkaffee)/],
  ['Milch', /^(Vollmilch,|Teilentrahmte Milch|Halbentrahmte Milch|Magermilch, UHT|Milch \(Durchschnitt\)|Buttermilch|Schafmilch|Ziegenmilch)/],
  ['Joghurt, nature', /^Joghurt(, nature| Bifidus, nature| mit Rahm, nature)/],
  ['Gesüsster oder aromatisierter Joghurt', /^Joghurt/],
  ['Quark, nature', /^(Quark, nature|Blanc battu, nature)/],
  ['Gesüsster oder aromatisierter Quark', /^Quark, mit Früchten/],
  ['Mozzarella', /^Mozzarella$/],
  ['Feta', /^Käse in Salzlake/],
  ['Raclette', /^Raclettekäse$/],
  ['Streich- oder Frischkäse', /^(Frischkäse|Schmelzkäse, streichfähig|Ziegenfrischkäse)/],
  ['Weichkäse', /^(Weichkäse|Camembert|Brie|Tomme$|Reblochon|Vacherin Mont d'Or|Limburger|Hüttenkäse|Ziger weiss)/],
  ['Halbhart- oder Hartkäse (ohne Fondue und Raclette)', /^(Appenzeller|Emmentaler|Greyerzer|Hart- und Halbhartkäse|Parmesan|Sbrinz|Tilsiter|Tête de Moine|St\. Paulin|Gorgonzola|Blauschimmelkäse|Roquefort|Freiburger Vacherin|Reibkäse|Schmelzkäse, Scheibe)/],
  ['Fondue', /^Fondue/],

  // Eier, pflanzliche Proteine, Fleisch, Fisch (only cooked / ready to eat)
  ['Vollei', /^Hühnerei, ganz/],
  ['Tofu', /^Tofu/],
  ['Pflanzliche Proteinquellen', /^(Burger, vegan|Gehacktes, vegan|Gehacktes\/Geschnetzeltes\/Pätzli, vegetarisch|Geschnetzeltes, vegan|Nugget, vegan|Seitan|Tempeh|Wurst, vegan)/],
  ['Hühnerfleisch', /^(Poulet|Truthahn|Cordon bleu aus Poulet).*(gebraten|gekocht)/],
  ['Fleisch', /^(Kalb|Rind|Schwein|Lamm|Pferd|Kaninchen|Kotelett|Plätzli|Geschnetzeltes|Gehacktes|Hackplätzli|Kalbsplätzli|Cordon bleu|Saltimbocca|Leber).*(gebraten|gekocht|geschmort)/],
  ['Wurst (gekocht)', /^(Cervelat|Wienerli|Lyoner|Geflügellyoner|Mortadella|Blutwurst|Kalbsbratwurst|Schweinsbratwurst|Bauernschüblig|St\. Galler Schüblig|Schützenwurst|Weisswurst|Bierwurst|Fleischkäse|Saucisson|Luganighe|Saucisse aux choux|Schweinswurst|Kochwürste|Brühwürste|Berner Zungenwurst|Leberwurst|Minipic|Cotechino)/],
  ['Schinken (gekocht)', /^(Hinterschinken|Vorderschinken|Rollschinken|Cotto|Kochpökelware|Trutenbrust)/],
  ['Salami', /^(Salami|Salametti|Salsiz|Landjäger|Rohwürste)/],
  ['Wurstwaren', /^(Aufschnitt|Bresaola|Coppa|Mostbröckli|Rohschinken|Rohpökelwaren|Trockenfleisch|Kochspeck|Rohessspeck|Pantli|Terrine de Campagne)/],
  ['Fischprodukte', /^(Fischstäbchen|Surimi|Rollmops)/],
  ['Meeresfrüchte', /^(Garnele|Kalmar|Krustentiere|Miesmuschel|Scampi)/],
  ['Fisch', /^(Dorsch|Fisch \(Durchschnitt\)|Flunder|Forelle|Lachs|Thon|Sardine|Sardelle).*(gedämpft|gekocht|geräuchert|abgetropft|Konserve)/],

  // Fette, Nüsse
  ['Butter', /^(Butter, gesalzen|Vorzugsbutter|Käsereibutter|Kochbutter|Halbfettbutter|Joghurt-Butter)$/],
  ['Bratfett', /^(Bratbutter|Schweineschmalz|Kokosfett|Palmöl)/],
  ['Margarine', /^Margarine/],
  ['Rahm', /^(Rahm \(Durchschnitt\)|Vollrahm|Halbrahm|Doppelrahm|Kaffeerahm|Sauerrahm|Saurer Halbrahm)/],
  ['Pflanzliche Öle', /^(Baumnussöl|Distelöl|Erdnussöl|Hanföl|Haselnussöl|Kürbiskernöl|Leinöl|Maiskeimöl|Olivenöl|Rapsöl|Sesamöl|Sojaöl|Sonnenblumenöl|Traubenkernöl|Weizenkeimöl)/],
  ['Nüsse', /^(Baumnuss|Cashewnuss|Haselnuss|Mandel|Paranuss|Pistazie|Pinienkerne|Erdnuss)(,|$)|^Samen, Kerne, Nüsse/],
  ['Samen', /^(Chia-Samen|Leinsamen|Kürbiskerne|Sesamsamen|Sonnenblumenkerne)/],
  ['Olive', /^Olive,/],

  // Süsses, Snacks
  ['Süsswaren mit Schokolade', /^(Branchli|Erdnuss mit Schokoladeüberzug|Getreideriegel mit Schokoladeüberzug|Schoggibrötli|Waffelguetzli, gefüllt, mit Schokoladenüberzug|Petit Beurre mit Schokolade|Schümliguetzli mit Schokolade|Donut mit Schokoladen-Glasur)/],
  ['Schokolade', /^(Milchschokolade|Schokolade, (dunkel|weiss))/],
  ['Kekse', /^(Amaretti|Basler Leckerli|Brunsli|Chräbeli|Cookie|Florentiner|Haselnusskeks|Haselnussmakrone|Haselnussstängeli|Kokosmakrone|Löffelbiscuit|Mailänderli|Madeleine|Meringue|Nuss-Stängeli|Petit Beurre|Prussien|Sablé|Schümliguetzli|Spitzbube|Willisauer Ringli|Zimtstern)/],
  ['Eiscreme und Sorbet', /^(Rahmglace|Sorbet|Wassereis|Cornet Glace|Glaceriegel)/],
  ['Konfitüre', /^Konfitüre/],
  ['Honig', /^Honig/],
  ['Chips', /^(Pommes Chips|Mais-Chips)/],
  ['Apérogebäck', /^(Blätterteigstängel|Erdnuss-Flips|Grissini|Laugengebäck trocken|Popcorn)/],

  // Suppen
  ['Bouillon', /^Bouillon/],
  ['Suppe', /^(Bündner Gerstensuppe|Gazpacho|Gulaschsuppe|Minestrone|Pilzsuppe|Tomatensuppe)$/],

  // Getränke
  ['Künstlich gesüsste Getränke', /^(Colagetränk, mit Süssstoffen|Energy Drink .*mit Süssstoffen)$/],
  ['Zuckerhaltige Getränke', /^(Colagetränk, gezuckert|Eistee, gezuckert|Energy Drink .*gezuckert|Limonade|Sirup zubereitet|Orangennektar|Fruchtsaft-Schorle)/],
  ['Gemüsesaft', /^(Karottensaft|Tomatensaft)$/],
  ['Tee', /^Tee, ungezuckert$/],
  ['Kaffee, schwarz', /^Kaffee, schwarz, ungezuckert$/],
  ['Wasser', /^Trinkwasser/],
  ['Wein', /^(Wein (rot|weiss)|Schaumwein|Calimocho)/],
  ['Bier', /^(Bier|Fünfkornbier)/],

  // Gemüse (herbs, spices and aromatics deliberately excluded)
  ['Gurke', /^Gurke, roh$/],
  ['Karotte', /^Karotte, (roh|gedämpft)/],
  ['Tomate', /^Tomate, (roh|gedünstet)/],
  ['Zucchini', /^Zucchetti, (roh|gedämpft|gedünstet)/],
  ['Salat (Blattgemüse)', /^(Blattsalat \(Durchschnitt\)|Kopfsalat|Eisbergsalat|Nüsslisalat|Rucola|Lattich|Endivie|Zuckerhutsalat|Cicorino rot|Brunnenkresse), roh$/],
  ['Eingelegtes Gemüse', /in Essig eingelegt$/, VEG],
  ['Gekochtes Dosengemüse, total', /\(Konserve\)/, VEG],
  ['Gekochtes Gemüse (nicht aus der Dose), total', /, (gedämpft|gedünstet|gekocht)/, VEG],
  ['Frischgemüse, total', /^(?!Basilikum|Petersilie|Schnittlauch|Thymian|Salbei|Pfefferminze|Rosmarin|Knoblauch|Schalotte|Zwiebel|Ingwer).*, roh$/, VEG],
];

const input = process.argv[2];
if (!input) {
  console.error('Usage: npm run import:menuch -- path/to/menuCH_portion_sizes_2014_2015_per_meal.xlsx');
  process.exit(1);
}

const cellValue = (v) => (v && typeof v === 'object' ? (v.result ?? v.text ?? '') : (v ?? ''));

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(input);
const ws = wb.getWorksheet(SHEET);
if (!ws) {
  console.error(`Sheet "${SHEET}" not found.`);
  process.exit(1);
}

const rows = [];
ws.eachRow({ includeEmpty: false }, (row) => rows.push(Array.from(row.values, cellValue)));

// Columns from the header row: one "Median" column per meal (Frühstück …
// Spätsnack), followed by its sample size; category names sit in the column
// after "Lebensmittelkategorien".
const header = rows.find((r) => r.some((v) => String(v).trim() === 'Median'));
const MEALS = header.flatMap((v, i) => (String(v).trim() === 'Median' ? [i] : []));
const nameCol = header.findIndex((v) => String(v).trim().startsWith('Lebensmittelkategorien')) + 1;
if (MEALS.length === 0 || nameCol === 0) {
  console.error('Unexpected sheet layout (no "Median" / "Lebensmittelkategorien" header).');
  process.exit(1);
}

// menuCH category -> usual portion (median of the best-sampled meal).
const portions = new Map();
for (const r of rows) {
  const name = String(r[nameCol] ?? '').trim();
  if (!name) continue;
  let best = null;
  for (const col of MEALS) {
    const median = Number(r[col]);
    const n = Number(r[col + 1]);
    if (Number.isFinite(median) && Number.isFinite(n) && n > (best?.n ?? 0)) best = { median, n };
  }
  if (best && best.n >= MIN_N && best.median > 0) portions.set(name, Math.round(best.median));
}

const missingCategories = RULES.map(([c]) => c).filter((c) => !portions.has(c));

const blv = JSON.parse(readFileSync(blvPath, 'utf8'));
const out = {};
const usedBy = {};
for (const [id, name, , categoryIdx] of blv.foods) {
  const categories = categoryIdx.map((i) => blv.categoryNames[i]);
  for (const [category, pattern, guard] of RULES) {
    if (guard && !categories.includes(guard)) continue;
    if (!pattern.test(name)) continue;
    const grams = portions.get(category);
    if (grams !== undefined) {
      out[id] = grams;
      usedBy[category] = (usedBy[category] ?? 0) + 1;
    }
    break; // first matching rule decides, even if its category was skipped
  }
}

writeFileSync(
  outPath,
  JSON.stringify({
    source: 'BLV, Nationale Ernährungserhebung menuCH 2014-15',
    // BLV food id -> usual portion in grams (as eaten).
    portions: out,
  }) + '\n'
);
console.log(`✔ ${Object.keys(out).length} of ${blv.foods.length} BLV foods got a usual portion.`);
if (missingCategories.length) {
  console.log(`  Skipped (too few observations or not in file): ${[...new Set(missingCategories)].join(', ')}`);
}
