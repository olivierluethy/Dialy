/**
 * Account & premium gating — single source of truth.
 *
 * | Feature                         | No account | Free | Premium |
 * |---------------------------------|------------|------|---------|
 * | Ratgeber (read articles)        | ✅         | ✅   | ✅      |
 * | KH-Rechner (calculate)          | ✅         | ✅   | ✅      |
 * | Sport (plan/preview)            | ✅         | ✅   | ✅      |
 * | Save meal/sport to Tagebuch     | ❌         | ✅   | ✅      |
 * | Full Tagebuch / BZ-analytics    | ❌         | 🔒   | ✅      |
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
      return ctx.isLoggedIn; // any account (free or premium)
    case 'fullDiary':
      return ctx.isLoggedIn && ctx.isPremium; // premium feature
    default:
      return false;
  }
}

// The copy shown when a capability is locked is in the UI dictionaries
// (src/i18n/locales, section `gate`).
