/**
 * Account & premium gating — single source of truth.
 *
 * | Feature                         | No account | Free | Premium |
 * |---------------------------------|------------|------|---------|
 * | Ratgeber (read articles)        | ✅         | ✅   | ✅      |
 * | KH-Rechner (calculate)          | ✅         | ✅   | ✅      |
 * | Sport (plan/preview)            | ✅         | ✅   | ✅      |
 * | Save meal/sport to Tagebuch     | ❌         | ❌   | ✅      |
 * | Tagebuch / BZ-analytics         | ❌         | ❌   | ✅      |
 */

export interface GateContext {
  isLoggedIn: boolean;
  isPremium: boolean;
}

export type Capability =
  | 'readArticles'
  | 'calculateCarbs'
  | 'planSport'
  | 'saveDiaryEntry'
  | 'fullDiary';

export function can(cap: Capability, ctx: GateContext): boolean {
  switch (cap) {
    case 'readArticles':
    case 'calculateCarbs':
    case 'planSport':
      return true; // always free, no account needed
    case 'saveDiaryEntry':
    case 'fullDiary':
      return ctx.isLoggedIn && ctx.isPremium; // account with subscription
    default:
      return false;
  }
}

// The copy shown when a capability is locked is in the UI dictionaries
// (src/i18n/locales, section `gate`).
