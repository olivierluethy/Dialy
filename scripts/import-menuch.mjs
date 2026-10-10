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
 * dry ingredient. Run `npm run import:blv` (and `import:bls`) first.
 *
 * The same applies to the German BLS foods (src/data/blsFoods.json) with a
 * second rule set (BLS_RULES), guarded by the BLS food group (first letter
 * of the BLS code). "tiefgefroren" alone means raw/frozen, so it never
 * matches without a cooking step.
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
const blsPath = join(root, 'src', 'data', 'blsFoods.json');
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

// Cooking steps that make a BLS food "as eaten".
const COOKED = '(gekocht|gegart|gedünstet|gedämpft|druckgedämpft|gebraten|gebacken|gegrillt|geschmort|frittiert|pochiert|gargezogen|gebrüht|überbacken)';
const cooked = (re) => new RegExp(`${re}.*${COOKED}`, 'i');
const HERBS = /^(Basilikum|Petersilie|Schnittlauch|Dill|Koriander|Kresse|Gartenkresse|Knoblauch|Zwiebel|Schalotte|Ingwer|Meerrettich|Chili|Peperoni|Thymian|Rosmarin|Salbei|Minze|Pfefferminze|Oregano|Majoran|Liebstöckel|Estragon|Kerbel|Bärlauch|Suppengrün|Lorbeer|Zitronengras|Wasabi)/;

/**
 * BLS rules: [menuCH category, BLS name pattern, BLS food groups (letters)].
 * First match wins. Only eaten-state foods; dishes only where menuCH has a
 * category (soups, broth, potato salad, mashed potatoes).
 */
const BLS_RULES = [
  // Obst (F)
  ['Apfel', /^Apfel (geschält, )?roh$/, 'F'],
  ['Birne', /^Birne (geschält, )?roh$/, 'F'],
  ['Orange', /^Orange roh$/, 'F'],
  ['Mandarine und Klementine', /^(Clementine|Mandarine|Tangerine) roh$/, 'F'],
  ['Traube', /^Weintraube.*roh$/, 'F'],
  ['Beeren', /beere.*roh$/i, 'F'],
  ['Getrocknete Früchte', /getrocknet/, 'F'],
  ['Gekochte Früchte in Dosen, total', /Konserve/, 'F'],
  ['Gekochte Früchte (nicht aus der Dose), total', /(gedünstet|gekocht|Kompott)/, 'F'],
  ['Fruchtsaft', /^(?!Zitron|Limett).*(saft|nektar)$/i, 'F'],
  ['Frischobst, total', /^(?!Zitron|Limett|Rhabarber|Hagebutte|Eberesche|Holunder|Quitte).* roh$/, 'F'],

  // Brot (B), Getreide (C), Teigwaren & Eier (E)
  ['Knäckebrot und Crackers', /(knäckebrot|zwieback|knusperbrot|reiswaffel|cracker)/i, 'B'],
  ['Brot', /^(?!Paniermehl)/, 'B'],
  ['Reis', cooked('^Reis'), 'C'],
  ['Couscous', cooked('^(Couscous|Bulgur)'), 'C'],
  ['Maisgriess, Polenta', cooked('^(Mais Grieß|Polenta)'), 'C'],
  ['Essfertiges Müesli', /^[A-Za-zä]+ Flocken, gekocht$/, 'C'],
  ['Gesüsste Frühstücksflocken', /(müsli|flakes|crisp|pops|gepufft|cornflakes).*gesüßt|gesüßt.*(müsli|flakes)/i, 'C'],
  ['Ungesüsste Getreide- und Müesliflocken (inkl. Frühstücksflocken)', /(Flocken$|ungesüßt.*(müsli|flocken)|Müsli.*ungesüßt)/i, 'C'],
  ['Gefüllte Teigwaren', /(Ravioli|Tortellini|Tortelloni).*gekocht$/, 'E'],
  ['Spätzli', cooked('Spätzle'), 'EX'],
  ['Teigwaren, total', /teigwaren.*gekocht$/i, 'E'],
  ['Vollei', /^Hühnerei (roh|gekocht|weich gekocht|gebraten|gebacken|pochiert)/, 'E'],

  // Kartoffeln (K)
  ['Pommes frites', /^Pommes frites.*(frittiert|gebacken)/, 'K'],
  ['Rösti', /rösti.*(frittiert|gebacken|gebraten)/i, 'K'],
  ['Chips', /chips/i, 'K'],
  ['Kartoffeln', /^Kartoffel (geschält|ungeschält), (gekocht|druckgedämpft|gebacken|gebraten ohne Fett \(Pfanne\)|geschmort ohne Fett)$/, 'K'],

  // Milch (M)
  ['Milchmischgetränke', /(drink|getränk|kakao|shake).*(gesüßt|frucht|schoko)/i, 'M'],
  ['Milch', /^(H-)?(Voll)?[Mm]ilch .*(Fett|entrahmt)/, 'M'],
  ['Joghurt, nature', /^(?!.*(Frucht|gesüßt|Vanille|Schoko|Zucker)).*[Jj]oghurt.*Fett/, 'M'],
  ['Gesüsster oder aromatisierter Joghurt', /[Jj]oghurt/, 'M'],
  ['Quark, nature', /^(Speise)?[Qq]uark(?!.*(Frucht|gesüßt|Vanille)).*Fett/, 'M'],
  ['Gesüsster oder aromatisierter Quark', /quark.*(Frucht|gesüßt|Vanille)/i, 'M'],
  ['Mozzarella', /^Mozzarella/, 'M'],
  ['Feta', /^(Feta|Schafskäse|Hirtenkäse)/, 'M'],
  ['Streich- oder Frischkäse', /(Frischkäse|Schmelzkäse|Streichkäse)/, 'M'],
  ['Weichkäse', /^(Camembert|Brie|Weichkäse|Romadur|Limburger|Münster)/, 'M'],
  ['Halbhart- oder Hartkäse (ohne Fondue und Raclette)', /^(Hartkäse|Schnittkäse|Halbfester Schnittkäse|Bergkäse|Emmentaler|Gouda|Edamer|Tilsiter|Butterkäse|Appenzeller|Parmesan|Edelpilzkäse|Gorgonzola|Leerdammer)/, 'M'],

  // Getränke (N, P)
  ['Künstlich gesüsste Getränke', /Süßungsmittel/, 'N'],
  ['Zuckerhaltige Getränke', /(Cola|Limonade|Brause|Eistee|Energy|Ginger Ale|Erfrischungsgetränk|Fruchtsaftgetränk|Schorle)/, 'N'],
  ['Kaffee mit Milch', /(Cappuccino|Latte|Milchkaffee).*Getränk|Kaffee \(Getränk\) mit Milch/, 'N'],
  ['Kaffee, schwarz', /^(Kaffee|Espresso) \(Getränk\)/, 'N'],
  ['Tee', /tee \(Getränk\)/i, 'N'],
  ['Wasser', /wasser/i, 'N'],
  ['Bier', /(bier|pils|weizen|radler)/i, 'P'],
  ['Wein', /^(?!.*(brand|Branntwein)).*wein/i, 'P'],

  // Fisch, Fleisch, Wurst (T, U, V, W) — only cooked / ready to eat
  ['Fischprodukte', /(Fischstäbchen|Surimi|Rollmops|Bismarckhering|Matjes)/, 'T'],
  ['Meeresfrüchte', cooked('^(Garnele|Krabbe|Shrimp|Muschel|Miesmuschel|Tintenfisch|Kalmar|Hummer|Languste|Scampi)'), 'T'],
  ['Fisch', new RegExp(`(${COOKED.slice(1, -1)}|geräuchert|Konserve)`), 'T'],
  ['Hühnerfleisch', cooked('^(Hähnchen|Huhn|Hühner|Pute|Baby-Pute|Truthahn)'), 'V'],
  ['Fleisch', cooked(''), 'UV'],
  ['Salami', /(Salami|Cervelatwurst|Landjäger|Mettwurst)/, 'W'],
  ['Schinken (gekocht)', /(Kochschinken|Schinken gekocht|Bierschinken|Vorderschinken|Hinterschinken)/, 'W'],
  ['Wurst (gekocht)', /(Würstchen|Wurst|Knacker|Bockwurst|Lyoner|Fleischwurst|Mortadella)/, 'W'],
  ['Wurstwaren', /./, 'W'],

  // Fette, Nüsse, Süsses (Q, H, S, D)
  ['Butter', /butter$/i, 'Q'],
  ['Margarine', /margarine/i, 'Q'],
  ['Pflanzliche Öle', /öl$/i, 'Q'],
  ['Rahm', /(sahne|rahm)/i, 'QM'],
  ['Nüsse', /^(?!.*(mus|öl|mehl|butter|creme)).*(nuss|nüsse|mandel|pistazie|cashew|macadamia|pekan)/i, 'H'],
  ['Samen', /^(?!.*(mus|öl|mehl)).*(kern|samen|leinsaat|chia|sesam)/i, 'H'],
  ['Eiscreme und Sorbet', /(speiseeis|sorbet|eiscreme)/i, 'S'],
  ['Konfitüre', /(konfitüre|marmelade|fruchtaufstrich|gelee)/i, 'S'],
  ['Honig', /^Honig/, 'S'],
  ['Süsswaren mit Schokolade', /(riegel|pralin|schokolinsen|überzogen mit Schokolade)/i, 'S'],
  ['Schokolade', /schokolade/i, 'S'],
  ['Kekse', /^(?!.*(torte|kuchen|schnitte)).*(keks|plätzchen|cookie|löffelbiskuit|spekulatius|makrone|lebkuchen)/i, 'D'],
  ['Apérogebäck', /(salzstange|salzbrezel|knabbergebäck|cracker|popcorn|erdnussflips)/i, 'DSH'],

  // Gemüse (G) — herbs, spices and aromatics excluded
  ['Gurke', /^(Salat)?[Gg]urke.*roh$/, 'G'],
  ['Karotte', /^(Karotte|Möhre|Möhre\/Karotte)/, 'G'],
  ['Tomate', /^Tomate.*(roh|gedünstet)$/, 'G'],
  ['Zucchini', /^Zucchini/, 'G'],
  ['Salat (Blattgemüse)', /(salat|Rucola|Feldsalat|Chicorée|Endivie|Radicchio|Lollo|Eisberg).*roh$/i, 'G'],
  ['Eingelegtes Gemüse', /(eingelegt|sauer eingelegt|Essig)/i, 'G'],
  ['Gekochtes Dosengemüse, total', /Konserve/, 'G'],
  ['Gekochtes Gemüse (nicht aus der Dose), total', new RegExp(COOKED, 'i'), 'G'],
  ['Frischgemüse, total', / roh$/, 'G'],

  // Gerichte (X, Y) — only categories menuCH has
  ['Bouillon', /^(Bouillon|Fleischbrühe|Hühnerbrühe|Gemüsebrühe|Rinderkraftbrühe|Geflügelkraftbrühe|Fischbrühe|Kalbsbrühe|Wildbrühe)/, 'XY'],
  ['Suppe', /(suppe|eintopf)/i, 'XY'],
  ['Kartoffelsalat', /^Kartoffelsalat/, 'XY'],
  ['Kartoffelstock', /^(Kartoffelpüree|Kartoffelbrei)/, 'XY'],
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

const blvCount = Object.keys(out).length;

// German BLS foods (optional: only if imported).
let blsCount = 0;
let blsTotal = 0;
try {
  const bls = JSON.parse(readFileSync(blsPath, 'utf8'));
  blsTotal = bls.foods.length;
  for (const [id, name] of bls.foods) {
    const group = id.slice('bls-'.length, 'bls-'.length + 1);
    if (HERBS.test(name)) continue;
    // Powders aren't eaten as such (unless prepared: "Getränk", "zubereitet").
    if (/pulver/i.test(name) && !/(zubereitet|Getränk|zusatz)/i.test(name)) continue;
    // Raw sausages and doughs in the sausage group are cooked first.
    if (group === 'W' && /(\broh\b|teig, roh)/i.test(name)) continue;
    for (const [category, pattern, groups] of BLS_RULES) {
      if (!groups.includes(group) || !pattern.test(name)) continue;
      // "tiefgefroren" alone is raw/frozen — never "as eaten".
      if (/tiefgefroren/.test(name) && !new RegExp(COOKED).test(name)) break;
      const grams = portions.get(category);
      if (grams !== undefined) {
        out[id] = grams;
        blsCount += 1;
      }
      break;
    }
  }
} catch {
  // No BLS import yet — BLV only.
}

writeFileSync(
  outPath,
  JSON.stringify({
    source: 'BLV, Nationale Ernährungserhebung menuCH 2014-15',
    // Food id (blv-… / bls-…) -> usual portion in grams (as eaten).
    portions: out,
  }) + '\n'
);
console.log(`✔ ${blvCount} of ${blv.foods.length} BLV foods got a usual portion.`);
if (blsTotal) console.log(`✔ ${blsCount} of ${blsTotal} BLS foods got a usual portion.`);
if (missingCategories.length) {
  console.log(`  Skipped (too few observations or not in file): ${[...new Set(missingCategories)].join(', ')}`);
}
