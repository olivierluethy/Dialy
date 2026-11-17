/**
 * Swiss and German Standard German: the same language with different words
 * for some foods (Rahm / Sahne, Poulet / Hähnchen, Glace / Eis) and "ss"
 * instead of "ß" in Switzerland.
 *
 * Used when foods are written to the database: `name` holds the Swiss name
 * (toSwissGerman), `names['de-DE']` the German one (toGermanGerman) where it
 * differs. See scripts/article-editor.mjs and
 * supabase/migrations/0032_german_food_name_variants.sql. The source data is
 * mixed (BLV is Swiss, the BLS and many Open Food Facts products German), so
 * both directions are needed.
 *
 * Rules work on whole words (compounds included: "Schlagrahm" ->
 * "Schlagsahne") and keep the case of the original word. They only cover
 * unambiguous terms: "Peperoni" (Swiss bell pepper, German hot pepper, and
 * a pizza topping) or "Eis" in "Eistee" are left alone.
 */

const LETTERS = 'A-Za-zÀ-ÖØ-öø-ÿ';
const WORD = new RegExp(`[${LETTERS}]+`, 'g');

/** "RAHM" -> "SAHNE", "Rahm" -> "Sahne", "rahm" -> "sahne". */
function recase(original, replacement) {
  if (original.length > 1 && original === original.toUpperCase() && original !== original.toLowerCase()) {
    return replacement.toUpperCase();
  }
  const first = original[0];
  if (first !== first.toLowerCase()) return replacement[0].toUpperCase() + replacement.slice(1);
  return replacement;
}

function applyRules(word, rules) {
  let lower = word.toLowerCase();
  const before = lower;
  for (const rule of rules) {
    if ('word' in rule) {
      if (lower === rule.word) lower = rule.to;
    } else if ('start' in rule) {
      if (
        lower.length > rule.start.length &&
        lower.startsWith(rule.start) &&
        !rule.except?.some((e) => lower.startsWith(e))
      ) {
        lower = rule.to + lower.slice(rule.start.length);
      }
    } else if ('end' in rule) {
      if (lower.endsWith(rule.end)) lower = lower.slice(0, lower.length - rule.end.length) + rule.to;
    } else if (lower.includes(rule.any) && !rule.except?.some((e) => lower.includes(e))) {
      lower = lower.split(rule.any).join(rule.to);
    }
  }
  return lower === before ? word : recase(word, lower);
}

function compile(phrases) {
  return phrases.map(([from, to]) => [
    new RegExp(`(^|[^${LETTERS}])(${from})(?=$|[^${LETTERS}])`, 'gi'),
    to,
  ]);
}

// Converted words per rule set. Food names repeat their words a lot, so this
// keeps converting all ~28k foods fast.
const wordCache = new Map();

function convert(text, phrases, rules) {
  const cache = wordCache.get(rules) ?? new Map();
  wordCache.set(rules, cache);
  let out = text;
  for (const [re, to] of phrases) out = out.replace(re, (_m, pre, hit) => pre + recase(hit, to));
  return out.replace(WORD, (word) => {
    let converted = cache.get(word);
    if (converted === undefined) cache.set(word, (converted = applyRules(word, rules)));
    return converted;
  });
}

// Ice cream flavours: "Vanilleeis" <-> "Vanilleglace". Only these, because
// "…eis" also ends Reis, Mais, Preis and Kreis.
const ICE_FLAVOURS = [
  'vanille', 'schokoladen', 'schokolade', 'schoko', 'erdbeer', 'zitronen', 'himbeer', 'mango',
  'wasser', 'milch', 'frucht', 'joghurt', 'jogurt', 'nuss', 'haselnuss', 'pistazien',
  'stracciatella', 'karamell', 'caramel', 'kaffee', 'mokka', 'rahm', 'sahne', 'soft',
];

// Swiss "Plätzli" is a schnitzel only for meat; "Hackplätzli", "Spinatplätzli"
// or "Käseplätzli" are patties and stay.
const MEAT_PLAETZLI = [
  'rinds', 'rind', 'schweins', 'kalbs', 'truten', 'poulet', 'beef', 'minuten', 'saft',
  'nierstück', 'stotzen', 'rindsleber',
];

// ------------------------------------------------------------ to Swiss

const TO_SWISS_PHRASES = compile([
  ['saure[- ]sahne', 'Sauerrahm'],
  ['rote[- ]bee?te', 'Randen'],
  ['wiener würstchen', 'Wienerli'],
  ['eis am stiel', 'Glace am Stiel'],
]);

const TO_SWISS_RULES = [
  { any: 'soße', to: 'sauce' },
  { any: 'sahne', to: 'rahm' },
  { any: 'hähnchen', to: 'poulet' },
  { any: 'hühnchen', to: 'poulet' },
  { word: 'pute', to: 'trute' },
  { start: 'puten', to: 'truten' },
  // BLS names list synonyms back to back ("KarotteMöhre").
  { any: 'karottemöhre', to: 'karotte' },
  { any: 'karottenmöhren', to: 'karotten' },
  { any: 'möhrchen', to: 'karotten' },
  { any: 'möhren', to: 'karotten' },
  { any: 'möhre', to: 'karotte' },
  { any: 'feldsalat', to: 'nüsslisalat' },
  { any: 'kartoffelpüree', to: 'kartoffelstock' },
  { any: 'weißkohl', to: 'weisskabis' },
  { any: 'weisskohl', to: 'weisskabis' },
  { any: 'rotkohl', to: 'rotkabis' },
  { any: 'spitzkohl', to: 'spitzkabis' },
  { any: 'grünkohl', to: 'federkohl' },
  { any: 'wirsing', to: 'wirz' },
  { any: 'brötchen', to: 'brötli' },
  { any: 'zucchini', to: 'zucchetti' },
  { any: 'marmelade', to: 'konfitüre' },
  { any: 'würstchen', to: 'würstli' },
  { end: 'spätzle', to: 'spätzli' },
  { any: 'walnüsse', to: 'baumnüsse' },
  { any: 'walnuss', to: 'baumnuss' },
  { start: 'rinder', to: 'rinds' },
  { any: 'speiseeis', to: 'glace' },
  { any: 'eiscreme', to: 'glace' },
  ...ICE_FLAVOURS.map((f) => ({ end: `${f}eis`, to: `${f}glace` })),
  { word: 'eis', to: 'glace' },
  { any: 'ß', to: 'ss' },
];

// ------------------------------------------------------------ to German

const TO_GERMAN_PHRASES = compile([['saurer rahm', 'saure Sahne']]);

const TO_GERMAN_RULES = [
  // Before "Schweins…"/"Rinds…" are changed.
  ...MEAT_PLAETZLI.map((m) => ({ end: `${m}plätzli`, to: `${m}schnitzel` })),
  { any: 'rahmglace', to: 'sahneeis' },
  { any: 'glaces', to: 'eis' },
  { any: 'glace', to: 'eis' },
  { any: 'schlagrahm', to: 'schlagsahne' },
  { any: 'kaffeerahm', to: 'kaffeesahne' },
  { any: 'vollrahm', to: 'sahne' },
  { any: 'rahmjoghurt', to: 'sahnejoghurt' },
  { any: 'rahmjogurt', to: 'sahnejoghurt' },
  { any: 'rahmquark', to: 'sahnequark' },
  { any: 'rahmeis', to: 'sahneeis' },
  { any: 'rahmtorte', to: 'sahnetorte' },
  // "Rahmspinat", "Rahmsauce", "Sauerrahm" are German too.
  { word: 'rahm', to: 'sahne' },
  { any: 'poulet', to: 'hähnchen' },
  { word: 'trute', to: 'pute' },
  { start: 'truten', to: 'puten' },
  { any: 'rüebli', to: 'karotten' },
  { any: 'zucchetti', to: 'zucchini' },
  { any: 'zucchetto', to: 'zucchini' },
  { any: 'nüsslisalat', to: 'feldsalat' },
  { any: 'randensaft', to: 'rote-Bete-Saft' },
  { any: 'randensalat', to: 'rote-Bete-Salat' },
  { word: 'randen', to: 'rote Bete' },
  { any: 'kartoffelstock', to: 'kartoffelpüree' },
  { any: 'weisskabis', to: 'weißkohl' },
  { any: 'rotkabis', to: 'rotkohl' },
  { any: 'spitzkabis', to: 'spitzkohl' },
  { any: 'federkohl', to: 'grünkohl' },
  { end: 'kabis', to: 'kohl' },
  { word: 'wirz', to: 'wirsing' },
  { any: 'brötli', to: 'brötchen' },
  { word: 'weggli', to: 'milchbrötchen' },
  { any: 'gipfeli', to: 'croissant' },
  { any: 'guetzli', to: 'kekse' },
  { any: 'schoggi', to: 'schokolade' },
  { word: 'wienerli', to: 'wiener Würstchen' },
  { any: 'würstli', to: 'würstchen' },
  { start: 'schweins', to: 'schweine', except: ['schweinshaxe'] },
  { start: 'rinds', to: 'rinder' },
  { any: 'baumnüsse', to: 'walnüsse' },
  { any: 'baumnuss', to: 'walnuss' },
  { any: 'weinbeeren', to: 'rosinen' },
  { any: 'spätzli', to: 'spätzle' },
  { any: 'hörnli', to: 'hörnchen' },
  // "ss" -> "ß" after a long vowel or diphthong. Only known stems: "Nuss",
  // "Genuss", "Wasser" or "Reissalat" (Reis + Salat) keep their "ss".
  { any: 'süss', to: 'süß' },
  { any: 'weiss', to: 'weiß' },
  { any: 'griess', to: 'grieß', except: ['griesson'] },
  { any: 'spiess', to: 'spieß' },
  { any: 'klösse', to: 'klöße' },
  { any: 'kloss', to: 'kloß' },
  { any: 'grösse', to: 'größe' },
  { any: 'grösser', to: 'größer' },
  { any: 'grösst', to: 'größt' },
  { any: 'gross', to: 'groß', except: ['migros'] },
  { any: 'strasse', to: 'straße' },
  { any: 'schliess', to: 'schließ' },
  { any: 'gemäss', to: 'gemäß' },
  { any: 'mässig', to: 'mäßig' },
  { any: 'massstab', to: 'maßstab' },
  { any: 'massgeb', to: 'maßgeb' },
  { any: 'heiss', to: 'heiß' },
  { any: 'bloss', to: 'bloß' },
  { any: 'äusser', to: 'äußer' },
  { any: 'ausser', to: 'außer' },
  { any: 'giess', to: 'gieß' },
  { any: 'grüss', to: 'grüß' },
  { any: 'spass', to: 'spaß' },
];

/** Swiss Standard German: "Schlagsahne" -> "Schlagrahm", "ß" -> "ss". */
export const toSwissGerman = (text) =>
  convert(text, TO_SWISS_PHRASES, TO_SWISS_RULES);

/** German Standard German: "Schlagrahm" -> "Schlagsahne", "Süssmost" -> "Süßmost". */
export const toGermanGerman = (text) =>
  convert(text, TO_GERMAN_PHRASES, TO_GERMAN_RULES);

