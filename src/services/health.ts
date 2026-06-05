import { config } from '@/config';
import type { BgReading } from '@/types/models';

/**
 * Health-import abstraction for CGM / blood-glucose readings.
 *
 * The app is structured behind this interface so the source can be HealthKit
 * (iOS, react-native-health) or Health Connect (Android,
 * react-native-health-connect) without touching the UI. A manual-entry
 * fallback ALWAYS works and is the default.
 *
 * Live native health integration requires a dev/EAS build (not Expo Go) and is
 * a TODO(native) follow-up. Until enabled, isAvailable() is false and the UI
 * uses manual entry.
 */
export interface HealthGlucoseSample {
  value_mmol: number;
  logged_at: string; // ISO
}

export interface HealthProvider {
  isAvailable(): boolean;
  requestPermissions(): Promise<boolean>;
  readGlucose(sinceIso: string): Promise<HealthGlucoseSample[]>;
}

/** Default provider: native bridge disabled, manual entry only. */
const manualOnlyProvider: HealthProvider = {
  isAvailable: () => config.featureHealthImport, // false unless explicitly enabled
  async requestPermissions() {
    return false;
  },
  async readGlucose() {
    // TODO(native): implement via react-native-health / -health-connect.
    return [];
  },
};

export function getHealthProvider(): HealthProvider {
  // TODO(native): select HealthKit/Health Connect provider per platform when
  // config.featureHealthImport is true and running in a native build.
  return manualOnlyProvider;
}

/** Convenience marker: where a reading came from. */
export const readingSourceFor = (
  fromHealth: boolean
): BgReading['source'] => (fromHealth ? 'cgm' : 'manual');
