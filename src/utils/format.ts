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

/**
 * 1 BE (Broteinheit) = 10 g Kohlenhydrate. Only stored (meal_entries.be);
 * the UI shows carbohydrates in grams, never BE.
 */
export const GRAMS_PER_BE = 10;

export const carbsToBe = (carbsG: number): number => carbsG / GRAMS_PER_BE;

/** "18 g KH" */
export const formatCarbs = (carbsG: number): string => `${Math.round(carbsG)} g KH`;

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

const pad2 = (n: number): string => n.toString().padStart(2, '0');

/** "16.05.2026" (local date), for editable date fields. */
export const formatDateInput = (iso: string): string => {
  const d = new Date(iso);
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
};

/**
 * "16.05.2026" + "07:45" (local time) -> ISO timestamp, or null if either
 * part is malformed or not a real date/time (e.g. 31.02. or 25:00).
 */
export function parseLocalDateTime(date: string, time: string): string | null {
  const dm = date.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  const tm = time.trim().match(/^(\d{1,2})[:.](\d{2})$/);
  if (!dm || !tm) return null;
  const [d, m, y] = [Number(dm[1]), Number(dm[2]), Number(dm[3])];
  const [hh, mm] = [Number(tm[1]), Number(tm[2])];
  if (hh > 23 || mm > 59) return null;
  const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt.toISOString();
}
