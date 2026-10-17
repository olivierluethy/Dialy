/**
 * Glucose units and conversion (issue #21).
 *
 * Readings are stored in mg/dL (the CGM providers' raw unit) and shown in the
 * unit the user picked — mmol/L by default in Switzerland, mg/dL optionally.
 * Conversion: mmol/L = mg/dL / 18.016.
 */
import { getT } from '@/i18n';

export type GlucoseUnit = 'mmol' | 'mgdl';

/** mg/dL per 1 mmol/L (glucose molar mass factor). */
export const MGDL_PER_MMOL = 18.016;

export const mgdlToMmol = (mgdl: number): number => mgdl / MGDL_PER_MMOL;
export const mmolToMgdl = (mmol: number): number => mmol * MGDL_PER_MMOL;

/**
 * Target range, defined in mmol/L (3.9–10.0, the common "time in range"
 * band) and mirrored in mg/dL for the stored values.
 */
export const TARGET_LOW_MMOL = 3.9;
export const TARGET_HIGH_MMOL = 10.0;
export const TARGET_LOW_MGDL = mmolToMgdl(TARGET_LOW_MMOL); // ≈ 70
export const TARGET_HIGH_MGDL = mmolToMgdl(TARGET_HIGH_MMOL); // ≈ 180

/** A stored mg/dL value in the user's unit (number only, no unit suffix). */
export const toUnit = (mgdl: number, unit: GlucoseUnit): number =>
  unit === 'mmol' ? mgdlToMmol(mgdl) : mgdl;

/** Decimals to show: mmol/L one decimal, mg/dL none. */
export const unitDecimals = (unit: GlucoseUnit): number => (unit === 'mmol' ? 1 : 0);

/** A mg/dL value as a plain number string in the user's unit, e.g. "6.8" / "123". */
export const formatGlucoseValue = (mgdl: number, unit: GlucoseUnit): string =>
  toUnit(mgdl, unit).toFixed(unitDecimals(unit));

/** The unit's label, e.g. "mmol/L" / "mg/dL". */
export const unitLabel = (unit: GlucoseUnit): string =>
  unit === 'mmol' ? 'mmol/L' : 'mg/dL';

/** A mg/dL value with its unit, e.g. "6.8 mmol/L". */
export const formatGlucose = (mgdl: number, unit: GlucoseUnit): string =>
  `${formatGlucoseValue(mgdl, unit)} ${unitLabel(unit)}`;

/** A signed delta in the user's unit, e.g. "+3.4" / "-1.0". */
export const formatGlucoseDelta = (mgdlDelta: number, unit: GlucoseUnit): string => {
  const v = toUnit(mgdlDelta, unit);
  const sign = v > 0 ? '+' : v < 0 ? '−' : '';
  return `${sign}${Math.abs(v).toFixed(unitDecimals(unit))}`;
};

/** "mmol/L" / "mg/dL" segmented-control options in the current language. */
export const unitOptions = (): Array<{ value: GlucoseUnit; label: string }> => {
  void getT(); // keep signature consistent with other option builders
  return [
    { value: 'mmol', label: 'mmol/L' },
    { value: 'mgdl', label: 'mg/dL' },
  ];
};
