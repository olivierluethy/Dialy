/**
 * Account & premium gating — single source of truth.
 *
 * | Feature                         | No account | Free | Premium |
 * |---------------------------------|------------|------|---------|
 * | Ratgeber (read articles)        | ✅         | ✅   | ✅      |
 * | KH-Rechner (calculate)          | ✅         | ✅   | ✅      |
 * | Sport (plan/preview)            | ✅         | ✅   | ✅      |
 * | Save meal/sport to Tagebuch     | ❌         | ✅   | ✅      |
 * | Photo upload on meals           | ❌         | ✅   | ✅      |
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
  | 'uploadPhoto'
  | 'fullDiary';

export function can(cap: Capability, ctx: GateContext): boolean {
  switch (cap) {
    case 'readArticles':
    case 'calculateCarbs':
    case 'planSport':
      return true; // always free, no account needed
    case 'saveDiaryEntry':
    case 'uploadPhoto':
      return ctx.isLoggedIn; // any account (free or premium)
    case 'fullDiary':
      return ctx.isLoggedIn && ctx.isPremium; // premium feature
    default:
      return false;
  }
}

/** German gating copy shown when a capability is locked. */
export const gateCopy = {
  saveMeal: 'Mahlzeit im Tagebuch speichern erfordert ein Konto.',
  saveSport: 'Sport im Tagebuch speichern erfordert ein Konto.',
  diaryNeedsAccount:
    'Das Tagebuch benötigt ein (kostenloses) Konto. So bleiben deine Einträge sicher und geräteübergreifend verfügbar.',
  diaryNeedsPremium:
    'Das vollständige Tagebuch mit Blutzucker-Verlauf und Auswertung ist Teil von Dialy Premium.',
  registerCta: 'Kostenlos registrieren →',
} as const;
