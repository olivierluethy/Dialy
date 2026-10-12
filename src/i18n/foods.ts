import type { Dict, Language } from '@/i18n';
import { SEED_FOODS } from '@/data/seedFoods';
import { BRAND_DRINKS } from '@/data/brandDrinks';
import { USUAL_PORTION_LABEL, PACKAGE_PORTION_LABEL } from '@/data/foodCategories';

/**
 * Food data in the UI language. The foods table stays German (names,
 * categories, portion labels — also what the Dialy-Editor edits); this
 * translates for display:
 *   - names: curated foods and brand drinks carry their own translations,
 *     BLV/BLS foods come from src/data/foodNames/<lang>.json
 *     (`npm run import:names`). Foods without a translation (Open Food Facts
 *     products, foods added in the Dialy-Editor) keep their German name.
 *   - categories and portion labels: from the UI dictionary.
 */

type NameMap = Record<string, string>;

const nameMaps: Partial<Record<Exclude<Language, 'de'>, NameMap>> = {};

// Static requires so the bundler includes all three; parsed on first use.
function loadImported(lang: Exclude<Language, 'de'>): NameMap {
  switch (lang) {
    case 'en':
      return require('../data/foodNames/en.json') as NameMap;
    case 'fr':
      return require('../data/foodNames/fr.json') as NameMap;
    case 'it':
      return require('../data/foodNames/it.json') as NameMap;
  }
}

function nameMap(lang: Exclude<Language, 'de'>): NameMap {
  let map = nameMaps[lang];
  if (!map) {
    map = { ...loadImported(lang) };
    for (const f of [...SEED_FOODS, ...BRAND_DRINKS]) map[f.id] = f.names[lang];
    nameMaps[lang] = map;
  }
  return map;
}

/** Name of food `id` in `lang`; `germanName` (as stored) if there's no translation. */
export function localizedFoodName(id: string, germanName: string, lang: Language): string {
  if (lang === 'de') return germanName;
  return nameMap(lang)[id] ?? germanName;
}

const USUAL = new RegExp(`^${USUAL_PORTION_LABEL} \\((.+)\\)$`);
const PACKAGE = new RegExp(`^${PACKAGE_PORTION_LABEL} \\((.+)\\)$`);

/** Stored (German) portion label -> UI language. Unknown labels stay as they are. */
export function localizedPortionLabel(label: string, t: Dict): string {
  const usual = label.match(USUAL);
  if (usual) return t.portions.usual(usual[1]!);
  const pack = label.match(PACKAGE);
  if (pack) return t.portions.package(pack[1]!);
  return t.portions.labels[label] ?? label;
}

/** Short label of a stored top-level category. */
export function foodCategoryLabel(name: string, t: Dict): string {
  return (t.foodCategories as Record<string, string>)[name] ?? name;
}
