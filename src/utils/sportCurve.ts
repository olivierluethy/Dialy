import type { Activity, BgCurvePoint } from '@/types/models';

/**
 * Illustrative, heuristic blood-sugar trend for a planned sport session.
 *
 * ⚠️ NOT A MEDICAL DEVICE. This is a deliberately simple, transparent,
 * EDUCATIONAL estimate of how blood glucose *might* trend during/after
 * activity. It is NOT a clinical prediction and must NEVER be presented as
 * therapeutic advice or used to dose insulin. (Keeps Dialy outside EU MDR /
 * Swiss medical-device regulation.)
 *
 * Model (intentionally crude):
 *  - Endurance activities (wandern/laufen/rad/schwimmen) raise insulin
 *    sensitivity / GLUT4 uptake → curve trends DOWN, steeper for higher
 *    intensity and longer duration.
 *  - Strength (kraft) triggers stress-hormone (adrenaline/cortisol) release
 *    → curve can trend UP during the session.
 *  - A mild post-session drift continues because sensitivity stays elevated.
 */

// Relative intensity factor per activity (higher = stronger glucose effect).
const INTENSITY: Record<Activity, number> = {
  wandern: 0.6,
  laufen: 1.0,
  rad: 0.85,
  schwimmen: 0.9,
  kraft: 0.7,
};

// Sign of the dominant trend: endurance lowers, strength raises.
const DIRECTION: Record<Activity, number> = {
  wandern: -1,
  laufen: -1,
  rad: -1,
  schwimmen: -1,
  kraft: +1,
};

export interface CurveOptions {
  activity: Activity;
  durationMin: number;
  bgBeforeMmol: number;
}

/**
 * Produce ~13 sample points spanning the session plus a short recovery tail.
 * Values are clamped to a plausible illustrative range (2.5–18 mmol/l).
 */
export function estimateBgCurve({
  activity,
  durationMin,
  bgBeforeMmol,
}: CurveOptions): BgCurvePoint[] {
  const intensity = INTENSITY[activity];
  const direction = DIRECTION[activity];
  const duration = Math.max(5, durationMin);
  // Total magnitude of change scales with intensity and (sub-linearly) time.
  const magnitude = intensity * Math.min(6, 1.2 + duration / 30);

  const totalSpan = duration + 45; // include a recovery tail after the session
  const steps = 12;
  const points: BgCurvePoint[] = [];

  for (let i = 0; i <= steps; i += 1) {
    const minute = Math.round((totalSpan / steps) * i);
    // progress over the active session (0..1), then plateau during recovery
    const active = Math.min(minute, duration) / duration;
    // Ease-in curve so the change accelerates after warm-up.
    const eased = active * active * (3 - 2 * active); // smoothstep
    let value = bgBeforeMmol + direction * magnitude * eased;

    // Recovery tail: endurance keeps drifting slightly down; strength relaxes
    // back toward baseline as stress hormones clear.
    if (minute > duration) {
      const recovery = (minute - duration) / 45; // 0..1
      if (direction < 0) {
        value -= 0.4 * recovery * intensity;
      } else {
        value -= magnitude * 0.5 * recovery; // come back down toward baseline
      }
    }

    value = Math.max(2.5, Math.min(18, value));
    points.push({ minute, value: Math.round(value * 10) / 10 });
  }

  return points;
}
