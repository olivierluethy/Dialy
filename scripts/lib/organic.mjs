/**
 * Food names without "Bio" / "Organic": the KH-Rechner does not tell organic
 * and conventional foods apart, they have the same carbs. Removes the word
 * in all languages ("Bio", "Bio-", "(Bio)", "BIO", "Organic", "biologique",
 * "biologico", "Biologischer Landbau"): "Bio Joghurt" -> "Joghurt",
 * "Gemüsereis mit Bio-Poulet" -> "Gemüsereis mit Poulet".
 *
 * Brand names that contain the word stay as they are (Biotta, Bionella,
 * EnerBio, Jardin Bio, Bio Primo, Biomilk …): only the whole word is removed,
 * and a few brands are listed. A name that would become empty is kept.
 *
 * Used when foods are written to the database (scripts/article-editor.mjs);
 * supabase/migrations/0042_strip_organic_from_food_names.sql applies the same
 * rule to the foods already there.
 */

const BRAND = /jardin bio|bio primo|ener ?bio|biomilk|biofrench|bio-mate/i;
const SEP = '\\s,;:/(&+-';
const WORD = new RegExp(
  `(^|[${SEP}])(organic-bio|bio knospe|biologische[rsnm]? (?:landwirtschaft|landbau)|biologische[rsnm]?|biologique|biologic[oa]|organic|bio)(?=$|[\\s,;:/)&+.!-])-?`,
  'gi'
);

export function stripOrganic(name) {
  if (!name || BRAND.test(name)) return name;
  let t = name
    .replace(/\(\s*(?:bio|organic)\s*\)/gi, ' ')
    .replace(WORD, '$1')
    .replace(/(^|[\s(])Bio(?=(?:Cereal|Tofu)\b)/g, '$1');
  if (t === name) return name;
  t = t
    .replace(/\(\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+,/g, ',')
    .replace(/^\s*[-,:;&+/]\s*/, '')
    .replace(/\s*[-,:;&+/]\s*$/, '')
    .trim();
  if (!t) return name;
  if (name[0] === name[0].toUpperCase() && t[0] !== t[0].toUpperCase()) t = t[0].toUpperCase() + t.slice(1);
  return t;
}
