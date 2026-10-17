/**
 * Shared glucose-import layer (issue #21 §4).
 *
 * Every source implements `GlucoseProvider` so the UI stays source-agnostic:
 *  - `LibreCsvProvider` — LibreView CSV, fully working offline (MVP, §3 option C).
 *  - `DexcomProvider` — SCAFFOLD ONLY. Live Dexcom needs OAuth 2.0 with
 *    server-side, rotated refresh tokens and a Dexcom data-licence partnership
 *    (§2). It is wired as "not connected" here so the UI and data model are
 *    ready, without shipping a half-built OAuth flow.
 *  - `HealthPlatformProvider` — later (Apple Health / Health Connect, §3 B).
 *
 * All providers yield `ImportedReading`s in mg/dL; the repository deduplicates.
 */
import { parseLibreViewCsv, type ImportedReading } from '@/services/glucoseImport';
import { isHealthAvailable, healthSourceName } from '@/services/healthGlucose';
import type { GlucoseSource } from '@/types/models';

export interface SyncRange {
  fromIso: string;
  toIso: string;
}

export interface GlucoseProvider {
  readonly source: GlucoseSource;
  /** Whether this source can be used in the current build. */
  isAvailable(): boolean;
  /** Human-visible connection state, for the settings screen. */
  isConnected(): boolean;
}

/** LibreView CSV: no account to connect; the user uploads/pastes an export. */
export const libreCsvProvider = {
  source: 'libre' as const,
  isAvailable: () => true,
  isConnected: () => true,
  /** Parses an export's text into readings (throws CsvFormatError on bad input). */
  parse(text: string): ImportedReading[] {
    return parseLibreViewCsv(text).readings;
  },
};

/**
 * Dexcom provider — scaffold. The real flow (developer.dexcom.com):
 *  1. OAuth 2.0 authorization-code flow; region base URL (EU: api.dexcom.eu).
 *  2. Exchange the code server-side, store the refresh token encrypted, rotate
 *     it on every refresh (tokens never live in the client).
 *  3. GET /v3/users/self/dataRange to find the first-import window.
 *  4. GET /v3/users/self/egvs in ≤30-day blocks; back off on HTTP 429.
 *  5. EU data lags ~3 h, so the view is retrospective, not real-time.
 */
export const dexcomProvider: GlucoseProvider = {
  source: 'dexcom',
  isAvailable: () => false, // needs a registered app + partnership (§2)
  isConnected: () => false,
};

/**
 * Apple Health / Health Connect: the official on-device way to read values
 * other apps (Dexcom, Libre) wrote there. Available only in a dev/EAS build
 * with the native modules installed (see services/healthGlucose).
 */
export const healthProvider = {
  source: 'health_platform' as const,
  isAvailable: () => isHealthAvailable(),
  isConnected: () => isHealthAvailable(),
  name: () => healthSourceName(),
};
