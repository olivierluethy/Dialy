/**
 * Glucose import helpers (issue #21 §3 MVP: LibreView CSV, plus a demo
 * generator for trying the view without a sensor).
 *
 * Produces provider-neutral `ImportedReading`s in mg/dL. The repository
 * (db/repositories/glucose) deduplicates by (source, source_record_id), so
 * re-importing the same export adds nothing new.
 */
import { mmolToMgdl } from '@/utils/glucose';
import type { GlucoseReading, GlucoseSource, MealEntry } from '@/types/models';

/** One reading ready to be stored; the repo fills in ids/user/sync columns. */
export type ImportedReading = Pick<
  GlucoseReading,
  'source' | 'source_record_id' | 'timestamp_utc' | 'display_time_local' | 'value_mgdl' | 'trend' | 'status'
>;

export interface ParseResult {
  readings: ImportedReading[];
  /** Rows that looked like data but couldn't be parsed. */
  skipped: number;
}

export class CsvFormatError extends Error {}

/** Splits a CSV line, honouring simple double-quoted fields. */
function splitLine(line: string, delimiter: string): string[] {
  const out: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        field += '"';
        i += 1;
      } else inQuotes = !inQuotes;
    } else if (c === delimiter && !inQuotes) {
      out.push(field);
      field = '';
    } else field += c;
  }
  out.push(field);
  return out.map((f) => f.trim());
}

/** Guesses the delimiter from the header line (comma, semicolon or tab). */
function detectDelimiter(headerLine: string): string {
  const counts: Array<[string, number]> = [
    [',', (headerLine.match(/,/g) ?? []).length],
    [';', (headerLine.match(/;/g) ?? []).length],
    ['\t', (headerLine.match(/\t/g) ?? []).length],
  ];
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0]![1] > 0 ? counts[0]![0] : ',';
}

const norm = (s: string): string => s.toLowerCase().replace(/\s+/g, ' ').trim();

/** Finds the first column whose header contains any of the needles. */
function findColumn(headers: string[], needles: string[]): number {
  const lower = headers.map(norm);
  for (let i = 0; i < lower.length; i += 1) {
    if (needles.some((n) => lower[i]!.includes(n))) return i;
  }
  return -1;
}

/**
 * Parses a LibreView device-timestamp string into a local Date.
 * Handles "DD-MM-YYYY HH:MM", "DD.MM.YYYY HH:MM", "YYYY-MM-DD HH:MM" and the
 * US "MM/DD/YYYY hh:MM AM/PM" variants (all local wall-clock time).
 */
export function parseLibreTimestamp(raw: string): Date | null {
  const s = raw.trim();
  if (!s) return null;

  // 12-hour US format: MM/DD/YYYY hh:mm[:ss] AM/PM
  const us = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AP]M)?$/i);
  if (us) {
    let hh = Number(us[4]);
    const ampm = us[7]?.toUpperCase();
    if (ampm === 'PM' && hh < 12) hh += 12;
    if (ampm === 'AM' && hh === 12) hh = 0;
    return build(Number(us[3]), Number(us[1]), Number(us[2]), hh, Number(us[5]), Number(us[6] ?? 0));
  }

  // DD-MM-YYYY or DD.MM.YYYY with time
  const eu = s.match(/^(\d{1,2})[-.](\d{1,2})[-.](\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (eu) {
    return build(Number(eu[3]), Number(eu[2]), Number(eu[1]), Number(eu[4]), Number(eu[5]), Number(eu[6] ?? 0));
  }

  // ISO-ish YYYY-MM-DD HH:MM
  const iso = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (iso) {
    return build(Number(iso[1]), Number(iso[2]), Number(iso[3]), Number(iso[4]), Number(iso[5]), Number(iso[6] ?? 0));
  }
  return null;
}

function build(y: number, mo: number, d: number, h: number, mi: number, s: number): Date | null {
  const dt = new Date(y, mo - 1, d, h, mi, s, 0);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  if (h > 23 || mi > 59) return null;
  return dt;
}

/**
 * Parses a LibreView CSV export into readings. Throws `CsvFormatError` with a
 * message key when the file doesn't look like a LibreView export at all.
 */
export function parseLibreViewCsv(text: string): ParseResult {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) throw new CsvFormatError('empty');

  // The header is the first line that names a timestamp column. LibreView puts
  // a patient/title line above it.
  let headerIdx = -1;
  let delimiter = ',';
  let headers: string[] = [];
  let tsCol = -1;
  for (let i = 0; i < Math.min(lines.length, 5); i += 1) {
    const delim = detectDelimiter(lines[i]!);
    const cols = splitLine(lines[i]!, delim);
    const ts = findColumn(cols, ['zeitstempel', 'timestamp', 'gerätezeit', 'device timestamp']);
    if (ts >= 0) {
      headerIdx = i;
      delimiter = delim;
      headers = cols;
      tsCol = ts;
      break;
    }
  }
  if (headerIdx < 0) throw new CsvFormatError('noHeader');

  const typeCol = findColumn(headers, ['aufzeichnungstyp', 'record type']);
  const histMgdl = findColumn(headers, ['historische glukose mg/dl', 'historic glucose mg/dl', 'glukosewert-verlauf mg/dl']);
  const scanMgdl = findColumn(headers, ['scan-glukose mg/dl', 'scan glucose mg/dl']);
  const histMmol = findColumn(headers, ['historische glukose mmol/l', 'historic glucose mmol/l', 'glukosewert-verlauf mmol/l']);
  const scanMmol = findColumn(headers, ['scan-glukose mmol/l', 'scan glucose mmol/l']);

  if (histMgdl < 0 && scanMgdl < 0 && histMmol < 0 && scanMmol < 0) {
    throw new CsvFormatError('noGlucoseColumn');
  }

  const readings: ImportedReading[] = [];
  const seen = new Set<string>();
  let skipped = 0;

  for (let i = headerIdx + 1; i < lines.length; i += 1) {
    const cols = splitLine(lines[i]!, delimiter);
    const tsRaw = cols[tsCol] ?? '';
    const dt = parseLibreTimestamp(tsRaw);
    if (!dt) {
      skipped += 1;
      continue;
    }
    // Record type: 0 = historic, 1 = scan; other types (notes, insulin) skip.
    const type = typeCol >= 0 ? (cols[typeCol] ?? '').trim() : '';
    if (typeCol >= 0 && type !== '0' && type !== '1') continue;

    const raw =
      pick(cols, histMgdl) ?? pick(cols, scanMgdl) ?? pick(cols, histMmol) ?? pick(cols, scanMmol);
    if (raw === null) continue;
    const isMmol = (pick(cols, histMgdl) ?? pick(cols, scanMgdl)) === null;
    const value = Number(raw.replace(',', '.'));
    if (!Number.isFinite(value) || value <= 0) {
      skipped += 1;
      continue;
    }
    const mgdl = Math.round(isMmol ? mmolToMgdl(value) : value);

    const timestampUtc = dt.toISOString();
    const id = `libre-${dt.getTime()}`;
    if (seen.has(id)) continue; // same minute twice in the file
    seen.add(id);
    readings.push({
      source: 'libre',
      source_record_id: id,
      timestamp_utc: timestampUtc,
      display_time_local: localIso(dt),
      value_mgdl: mgdl,
      trend: null,
      status: null,
    });
  }

  if (readings.length === 0) throw new CsvFormatError('noReadings');
  return { readings, skipped };
}

function pick(cols: string[], col: number): string | null {
  if (col < 0) return null;
  const v = (cols[col] ?? '').trim();
  return v.length > 0 ? v : null;
}

/** Local wall-clock time as an ISO-like string without a timezone suffix. */
function localIso(dt: Date): string {
  const p = (n: number) => n.toString().padStart(2, '0');
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}T${p(dt.getHours())}:${p(
    dt.getMinutes()
  )}:00`;
}

const DEMO_SOURCE: GlucoseSource = 'manual';
const DEMO_STEP_MIN = 5;

/**
 * Builds a realistic demo day of 5-minute readings (mg/dL) so the day view can
 * be tried without a sensor. The curve sits around a calm baseline and rises
 * after each of that day's meals, scaled by the meal's carbs, then decays.
 * `dayDate` is any Date within the wanted local day.
 */
export function generateDemoDay(dayDate: Date, meals: MealEntry[]): ImportedReading[] {
  const dayStart = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 0, 0, 0, 0);
  const baseline = 92; // ≈ 5.1 mmol/L
  const bumps = meals.map((m) => {
    const t = new Date(m.logged_at);
    const startMin = t.getHours() * 60 + t.getMinutes();
    // Peak height scales with carbs: ~1 mg/dL per gram, capped.
    const peak = Math.min(120, 35 + m.carbs_g * 0.9);
    return { startMin, peak };
  });

  const readings: ImportedReading[] = [];
  for (let min = 0; min < 24 * 60; min += DEMO_STEP_MIN) {
    let value = baseline + 4 * Math.sin(min / 90); // gentle natural drift
    for (const b of bumps) {
      const dt = min - b.startMin;
      if (dt < 0 || dt > 180) continue;
      // Rise over ~45 min, decay over the rest of a 3 h window.
      const shape = dt <= 45 ? dt / 45 : Math.max(0, 1 - (dt - 45) / 135);
      value += b.peak * shape;
    }
    value += (Math.random() - 0.5) * 6; // sensor noise
    const at = new Date(dayStart.getTime() + min * 60_000);
    readings.push({
      source: DEMO_SOURCE,
      source_record_id: `demo-${at.getTime()}`,
      timestamp_utc: at.toISOString(),
      display_time_local: localIso(at),
      value_mgdl: Math.round(Math.max(55, Math.min(260, value))),
      trend: null,
      status: null,
    });
  }
  return readings;
}

/** Maps a `CsvFormatError` message key to copy via the dictionary lookup. */
export const csvErrorKey = (e: unknown): string =>
  e instanceof CsvFormatError ? e.message : 'unknown';
