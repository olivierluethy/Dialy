/**
 * Top-level food categories (those of the Swiss Food Composition Database),
 * in the order shown by the KH-Rechner filter: carbohydrate-rich groups
 * first. `label` is the short chip text; `name` is the stored value.
 */
export const FOOD_CATEGORIES: Array<{ name: string; label: string }> = [
  { name: 'Brote, Flocken und Frühstückscerealien', label: 'Brot & Cerealien' },
  { name: 'Getreideprodukte, Hülsenfrüchte und Kartoffeln', label: 'Getreide & Kartoffeln' },
  { name: 'Früchte', label: 'Früchte' },
  { name: 'Gemüse', label: 'Gemüse' },
  { name: 'Milch und Milchprodukte', label: 'Milchprodukte' },
  { name: 'Süssigkeiten', label: 'Süssigkeiten' },
  { name: 'Gerichte', label: 'Gerichte' },
  { name: 'Alkoholfreie Getränke', label: 'Getränke' },
  { name: 'Salzige Snacks', label: 'Snacks' },
  { name: 'Nüsse, Samen und Ölfrüchte', label: 'Nüsse & Samen' },
  {
    name: 'Pflanzliche Proteinlieferanten und Alternativen zu tierischen Produkten',
    label: 'Pflanzliche Alternativen',
  },
  { name: 'Fleisch und Innereien', label: 'Fleisch' },
  { name: 'Fleisch- und Wurstwaren', label: 'Wurstwaren' },
  { name: 'Fisch', label: 'Fisch' },
  { name: 'Eier', label: 'Eier' },
  { name: 'Fette und Öle', label: 'Fette & Öle' },
  { name: 'Alkoholhaltige Getränke', label: 'Alkohol' },
  { name: 'Speziallebensmittel', label: 'Speziallebensmittel' },
  { name: 'Verschiedenes', label: 'Verschiedenes' },
];
