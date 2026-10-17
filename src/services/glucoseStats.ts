/**
 * Glucose analytics (issue #21 §5) — pure functions over stored mg/dL
 * readings. All times are ISO strings; day grouping uses local time so a
 * reading belongs to the calendar day the user saw on their device.
 *
 * Nothing here converts units: callers format mg/dL with utils/glucose.
 */
import { dayKey } from '@/utils/format';
import { TARGET_HIGH_MGDL, TARGET_LOW_MGDL } from '@/utils/glucose';
import type { GlucoseReading, MealEntry } from '@/types/models';

/** A reading reduced to what the chart and stats need. */
export interface GlucosePoint {
  /** Local time in minutes from 00:00 (0–1440), for plotting on a day axis. */
  minute: number;
  timestamp: string; // ISO (UTC)
  mgdl: number;
}

/** Readings with an abnormal sensor status are left out of the curve/stats. */
const isUsable = (r: GlucoseReading): boolean =>
  r.status === null || r.status === '' || r.status.toLowerCase() === 'ok';

/** Local minute-of-day (0–1439) of an ISO timestamp. */
export const minuteOfDay = (iso: string): number => {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
};

/**
 * Usable readings of one local day, sorted by time, as plot points.
 * `day` is a YYYY-MM-DD key (utils/format.dayKey of a local date).
 */
export function dayPoints(readings: GlucoseReading[], day: string): GlucosePoint[] {
  return readings
    .filter((r) => isUsable(r) && dayKey(r.timestamp_utc) === day)
    .map((r) => ({ minute: minuteOfDay(r.timestamp_utc), timestamp: r.timestamp_utc, mgdl: r.value_mgdl }))
    .sort((a, b) => a.minute - b.minute);
}

export interface GlucoseExtreme {
  mgdl: number;
  timestamp: string;
}

export interface DayMetrics {
  count: number;
  averageMgdl: number | null;
  timeInRangePct: number | null; // share of readings within the target band
  lowest: GlucoseExtreme | null;
  highest: GlucoseExtreme | null;
}

/** Average, time-in-range and the day's extremes (issue #21 §5). */
export function dayMetrics(points: GlucosePoint[]): DayMetrics {
  if (points.length === 0) {
    return { count: 0, averageMgdl: null, timeInRangePct: null, lowest: null, highest: null };
  }
  let sum = 0;
  let inRange = 0;
  let lowest = points[0]!;
  let highest = points[0]!;
  for (const p of points) {
    sum += p.mgdl;
    if (p.mgdl >= TARGET_LOW_MGDL && p.mgdl <= TARGET_HIGH_MGDL) inRange += 1;
    if (p.mgdl < lowest.mgdl) lowest = p;
    if (p.mgdl > highest.mgdl) highest = p;
  }
  return {
    count: points.length,
    averageMgdl: sum / points.length,
    timeInRangePct: (inRange / points.length) * 100,
    lowest: { mgdl: lowest.mgdl, timestamp: lowest.timestamp },
    highest: { mgdl: highest.mgdl, timestamp: highest.timestamp },
  };
}

/** Minutes without a reading above which the curve is broken, not interpolated. */
export const GAP_MINUTES = 20;
/** Window after a meal in which its glucose impact is measured. */
export const IMPACT_WINDOW_MIN = 150; // 2.5 hours

/**
 * Splits the day's points into continuous segments, breaking wherever the gap
 * between two readings exceeds GAP_MINUTES (e.g. a sensor change). The chart
 * draws each segment on its own so gaps are shown, never bridged (§5).
 */
export function segmentize(points: GlucosePoint[]): GlucosePoint[][] {
  const segments: GlucosePoint[][] = [];
  let current: GlucosePoint[] = [];
  for (const p of points) {
    const prev = current[current.length - 1];
    if (prev && p.minute - prev.minute > GAP_MINUTES) {
      segments.push(current);
      current = [];
    }
    current.push(p);
  }
  if (current.length > 0) segments.push(current);
  return segments;
}

export interface MealImpact {
  /** Reading value at (or just before) the meal time. */
  baselineMgdl: number | null;
  /** Highest reading within IMPACT_WINDOW_MIN after the meal. */
  peakMgdl: number | null;
  peakTimestamp: string | null;
  /** peak − baseline, the post-meal rise. */
  riseMgdl: number | null;
}

/**
 * Glucose impact of one meal: the baseline at the meal time and the peak in
 * the 2.5 h after it, with the resulting rise (issue #21 §5). Needs the full
 * day's points (sorted). Returns nulls when there are no readings around it.
 */
export function mealImpact(meal: MealEntry, points: GlucosePoint[]): MealImpact {
  const start = minuteOfDay(meal.logged_at);
  const end = start + IMPACT_WINDOW_MIN;

  // Baseline: the last reading at or before the meal, else the first after it.
  let baseline: GlucosePoint | null = null;
  for (const p of points) {
    if (p.minute <= start) baseline = p;
    else break;
  }
  const after = points.filter((p) => p.minute >= start && p.minute <= end);
  if (baseline === null && after.length > 0) baseline = after[0]!;

  let peak: GlucosePoint | null = null;
  for (const p of after) {
    if (peak === null || p.mgdl > peak.mgdl) peak = p;
  }

  const baselineMgdl = baseline?.mgdl ?? null;
  const peakMgdl = peak?.mgdl ?? null;
  return {
    baselineMgdl,
    peakMgdl,
    peakTimestamp: peak?.timestamp ?? null,
    riseMgdl: peakMgdl !== null && baselineMgdl !== null ? peakMgdl - baselineMgdl : null,
  };
}
