/**
 * Reading glucose from the phone's health platform (issue #21 §3 option B):
 *  - iOS: Apple HealthKit (@kingstinct/react-native-healthkit)
 *  - Android: Health Connect (react-native-health-connect)
 *
 * Dexcom (and Libre) write their values into Health / Health Connect; Dialy
 * asks the user — through the OS permission dialog — for read access and pulls
 * them in. This is the official on-device way to "read from the Dexcom app",
 * with no account password and no undocumented endpoint.
 *
 * The native modules only exist in a dev/EAS build with the packages
 * installed and the config plugins applied (see app.config.ts). They are
 * loaded lazily so the app still compiles and runs (feature inactive) in Expo
 * Go and on web. All reads degrade to an empty result on any error.
 */
import { Platform } from 'react-native';
import { mgdlToMmol, mmolToMgdl } from '@/utils/glucose';
import type { ImportedReading } from '@/services/glucoseImport';

/** Minimal shape of an HKQuantitySample we rely on (typed locally). */
interface HkSample {
  uuid?: string;
  startDate: string | number | Date;
  quantity: number;
  unit?: string;
}

/** Health Connect BloodGlucose record (subset). */
interface HcRecord {
  metadata?: { id?: string };
  time: string;
  level?: { inMilligramsPerDeciliter?: number; inMillimolesPerLiter?: number };
}

// Optional native modules. Metro only accepts a string-literal `require`
// inside try/catch (a dynamic `require(variable)` is rejected); with Expo's
// optional-dependency handling this does not fail bundling when the package
// isn't installed — it just returns null.
function loadHealthKit(): any | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('@kingstinct/react-native-healthkit');
    return mod?.default ?? mod;
  } catch {
    return null;
  }
}
function loadHealthConnect(): any | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('react-native-health-connect');
  } catch {
    return null;
  }
}

let healthKit: any | undefined;
let healthConnect: any | undefined;

function hk(): any | null {
  if (healthKit === undefined) healthKit = loadHealthKit();
  return healthKit ?? null;
}
function hc(): any | null {
  if (healthConnect === undefined) healthConnect = loadHealthConnect();
  return healthConnect ?? null;
}

/** Whether a usable health source exists on this platform/build. */
export function isHealthAvailable(): boolean {
  if (Platform.OS === 'ios') {
    const k = hk();
    return !!k && (typeof k.requestAuthorization === 'function' || typeof k.isHealthDataAvailable === 'function');
  }
  if (Platform.OS === 'android') {
    const c = hc();
    return !!c && typeof c.requestPermission === 'function';
  }
  return false;
}

/** The health source's display name for the current platform. */
export function healthSourceName(): string {
  return Platform.OS === 'ios' ? 'Apple Health' : 'Health Connect';
}

const BLOOD_GLUCOSE_HK = 'HKQuantityTypeIdentifierBloodGlucose';

/**
 * Asks the OS for permission to read blood glucose. Returns false when the
 * platform has no provider or the user declined. (HealthKit never reveals a
 * denied read for privacy, so there we treat "no throw" as granted.)
 */
export async function requestHealthPermission(): Promise<boolean> {
  try {
    if (Platform.OS === 'ios') {
      const k = hk();
      if (!k) return false;
      if (typeof k.isHealthDataAvailable === 'function' && !(await k.isHealthDataAvailable())) return false;
      // Read-only: request read access to blood glucose.
      if (typeof k.requestAuthorization === 'function') {
        await k.requestAuthorization([], [BLOOD_GLUCOSE_HK]);
      }
      return true;
    }
    if (Platform.OS === 'android') {
      const c = hc();
      if (!c) return false;
      if (typeof c.initialize === 'function') await c.initialize();
      const granted = await c.requestPermission([{ accessType: 'read', recordType: 'BloodGlucose' }]);
      return Array.isArray(granted) ? granted.length > 0 : Boolean(granted);
    }
  } catch {
    return false;
  }
  return false;
}

/**
 * Reads blood-glucose samples recorded at or after `sinceIso` and maps them to
 * importable readings (mg/dL). source = 'health_platform'; the record's own id
 * (or its timestamp) deduplicates re-imports. Empty on any error.
 */
export async function readHealthGlucose(sinceIso: string): Promise<ImportedReading[]> {
  try {
    if (Platform.OS === 'ios') return await readHealthKit(sinceIso);
    if (Platform.OS === 'android') return await readHealthConnect(sinceIso);
  } catch {
    return [];
  }
  return [];
}

async function readHealthKit(sinceIso: string): Promise<ImportedReading[]> {
  const k = hk();
  if (!k) return [];
  const options = { from: new Date(sinceIso), unit: 'mg/dL', ascending: true };
  // Library method name differs across versions; try the known ones.
  const query = k.queryQuantitySamples ?? k.getQuantitySamples ?? k.querySamples;
  if (typeof query !== 'function') return [];
  const samples: HkSample[] = (await query.call(k, BLOOD_GLUCOSE_HK, options)) ?? [];

  return samples.map((s) => {
    const dt = new Date(s.startDate);
    // Values come back in the requested unit; convert if a sample reports mmol.
    const mgdl = s.unit && s.unit.toLowerCase().includes('mmol') ? mmolToMgdl(s.quantity) : s.quantity;
    const id = s.uuid ?? `hk-${dt.getTime()}`;
    return reading(id, dt, mgdl);
  });
}

async function readHealthConnect(sinceIso: string): Promise<ImportedReading[]> {
  const c = hc();
  if (!c) return [];
  if (typeof c.initialize === 'function') await c.initialize();
  const res = await c.readRecords('BloodGlucose', {
    timeRangeFilter: { operator: 'between', startTime: sinceIso, endTime: new Date().toISOString() },
  });
  const records: HcRecord[] = res?.records ?? res ?? [];

  return records.map((r) => {
    const dt = new Date(r.time);
    const mgdl =
      r.level?.inMilligramsPerDeciliter ??
      (r.level?.inMillimolesPerLiter !== undefined ? mmolToMgdl(r.level.inMillimolesPerLiter) : 0);
    const id = r.metadata?.id ?? `hc-${dt.getTime()}`;
    return reading(id, dt, mgdl);
  });
}

function reading(id: string, dt: Date, mgdl: number): ImportedReading {
  const p = (n: number) => n.toString().padStart(2, '0');
  const local = `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}T${p(dt.getHours())}:${p(dt.getMinutes())}:00`;
  return {
    source: 'health_platform',
    source_record_id: `health-${id}`,
    timestamp_utc: dt.toISOString(),
    display_time_local: local,
    value_mgdl: Math.round(mgdl),
    trend: null,
    status: null,
  };
}

/** mg/dL value a health sample would show in mmol/L (for debugging/logging). */
export const sampleInMmol = (mgdl: number): number => mgdlToMmol(mgdl);
