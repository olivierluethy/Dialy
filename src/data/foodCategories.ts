/**
 * Label prefixes of generated portions, as stored (German; translated for
 * display by i18n/foods.ts): usual portion from menuCH (see
 * scripts/import-menuch.mjs) and serving from an Open Food Facts package.
 */
export const USUAL_PORTION_LABEL = 'Übliche Portion';
export const PACKAGE_PORTION_LABEL = 'Portion laut Packung';

/**
 * Top-level food categories (those of the Swiss Food Composition Database,
 * stored in German), in the order shown by the KH-Rechner filter:
 * carbohydrate-rich groups first. The short chip labels are in the UI
 * dictionaries (`foodCategories`).
 */
export const FOOD_CATEGORIES: string[] = [
  'Brote, Flocken und Frühstückscerealien',
  'Getreideprodukte, Hülsenfrüchte und Kartoffeln',
  'Früchte',
  'Gemüse',
  'Milch und Milchprodukte',
  'Süssigkeiten',
  'Gerichte',
  'Alkoholfreie Getränke',
  'Salzige Snacks',
  'Nüsse, Samen und Ölfrüchte',
  'Pflanzliche Proteinlieferanten und Alternativen zu tierischen Produkten',
  'Fleisch und Innereien',
  'Fleisch- und Wurstwaren',
  'Fisch',
  'Eier',
  'Fette und Öle',
  'Alkoholhaltige Getränke',
  'Speziallebensmittel',
  'Verschiedenes',
];
