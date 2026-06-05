/** Swiss-German domain formatting helpers. Always "ss", never "ß". */

const MONTHS_DE = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

const WEEKDAYS_DE = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
];

/** 1 BE (Broteinheit) = 10 g Kohlenhydrate. */
export const GRAMS_PER_BE = 10;

export const carbsToBe = (carbsG: number): number => carbsG / GRAMS_PER_BE;

/** "18 g · 1.8 BE" */
export const formatCarbsWithBe = (carbsG: number): string => {
  const g = Math.round(carbsG);
  const be = carbsToBe(carbsG);
  return `${g} g · ${be.toFixed(1)} BE`;
};

/** Blood glucose: mmol/l, one decimal. */
export const formatMmol = (value: number): string => `${value.toFixed(1)} mmol/l`;

/** "16. Mai 2026" */
export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getDate()}. ${MONTHS_DE[d.getMonth()]} ${d.getFullYear()}`;
};

/** "FREITAG, 16. MAI 2026" (used for diary day headers) */
export const formatDayHeader = (iso: string): string => {
  const d = new Date(iso);
  const wd = WEEKDAYS_DE[d.getDay()]!;
  return `${wd}, ${d.getDate()}. ${MONTHS_DE[d.getMonth()]} ${d.getFullYear()}`.toUpperCase();
};

/** "07:45" */
export const formatTime = (iso: string): string => {
  const d = new Date(iso);
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
};

/** YYYY-MM-DD key for grouping diary entries by local day. */
export const dayKey = (iso: string): string => {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
};
