import type { Activity, BgCurvePoint } from '@/types/models';

/**
 * Generic, illustrative tendency of how blood glucose typically moves during
 * and after a type of activity.
 *
 * ⚠️ NOT A MEDICAL DEVICE. To stay outside EU MDR / Swiss MepV this is
 * deliberately NOT personalised: it never takes the user's own glucose value
 * or any other personal input except the chosen activity and duration, has no
 * absolute mmol/l scale and no hypo/hyper zones. It only illustrates general
 * physiology (as in a textbook) and must never be presented as a prediction,
 * a warning or advice on food or insulin.
 *
 * Values are unitless around a neutral baseline of TREND_BASELINE:
 *  - Endurance activities (wandern/laufen/rad/schwimmen) raise insulin
 *    sensitivity / GLUT4 uptake → trends DOWN, more for higher intensity and
 *    longer duration.
 *  - Strength (kraft) triggers stress-hormone release → can trend UP.
 *  - A mild post-session drift continues because sensitivity stays elevated.
 */

/** Neutral starting level of the illustration (unitless). */
export const TREND_BASELINE = 10;

// Relative intensity factor per activity (higher = stronger effect).
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

export interface TrendOptions {
  activity: Activity;
  durationMin: number;
}

/** ~13 sample points spanning the session plus a short recovery tail. */
export function illustrativeTrend({ activity, durationMin }: TrendOptions): BgCurvePoint[] {
  const intensity = INTENSITY[activity];
  const direction = DIRECTION[activity];
  const duration = Math.max(5, durationMin);
  // Size of the change scales with intensity and (sub-linearly) time.
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
    let value = TREND_BASELINE + direction * magnitude * eased;

    // Recovery tail: endurance keeps drifting slightly down; strength relaxes
    // back toward baseline as stress hormones clear.
    if (minute > duration) {
      const recovery = (minute - duration) / 45; // 0..1
      if (direction < 0) {
        value -= 0.4 * recovery * intensity;
      } else {
        value -= magnitude * 0.5 * recovery;
      }
    }

    points.push({ minute, value: Math.round(value * 10) / 10 });
  }

  return points;
}
