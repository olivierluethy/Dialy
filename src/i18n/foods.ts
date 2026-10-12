import type { Dict, Language } from '@/i18n';
import { USUAL_PORTION_LABEL, PACKAGE_PORTION_LABEL } from '@/data/foodCategories';
import type { FoodNames } from '@/types/models';

/**
 * Food data in the UI language. The foods table is German (names,
 * categories, portion labels — also what the Dialy-Editor edits); this
 * translates for display:
 *   - names: from the food's `names` (Supabase, with the food). Foods
 *     without a translation (Open Food Facts products, foods added in the
 *     Dialy-Editor) keep their German name.
 *   - categories and portion labels: from the UI dictionary.
 */

/** Name in `lang`; `germanName` (as stored) if there's no translation. */
export function localizedFoodName(germanName: string, names: FoodNames, lang: Language): string {
  if (lang === 'de') return germanName;
  return names[lang] || germanName;
}

/** Stored names (JSON text from the foods table); {} if missing or broken. */
export function parseFoodNames(json: string | null | undefined): FoodNames {
  if (!json) return {};
  try {
    const value: unknown = JSON.parse(json);
    return value && typeof value === 'object' ? (value as FoodNames) : {};
  } catch {
    return {};
  }
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
