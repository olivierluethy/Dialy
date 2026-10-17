import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DiabetesType } from '@/types/models';
import type { GlucoseUnit } from '@/utils/glucose';
import type { ThemeMode } from '@/theme/theme';
import type { AuthUser } from '@/services/auth';
import type { GateContext } from '@/policy/gating';
import type { LanguageSetting } from '@/i18n';

/** What the account screen shows about syncing (see sync/syncEngine.ts). */
export type SyncState = 'disabled' | 'idle' | 'syncing' | 'offline' | 'error';
export interface SyncStatus {
  state: SyncState;
  /** Local changes of the signed-in account not on the server yet. */
  pending: number;
}

export type PasswordRecovery =
  | { state: 'idle' }
  | { state: 'active' }
  | { state: 'expired'; message: string };

interface AppState {
  // Global Typ-1/Typ-2 selection (settings + Ratgeber) — persists across
  // restarts and is saved in the account (services/userSettings.ts).
  diabetesType: DiabetesType;
  setDiabetesType: (t: DiabetesType) => void;
  // When it was last chosen on this device, and the account it was last
  // reconciled with.
  diabetesTypeChangedAt: string | null;
  diabetesTypeSyncedFor: string | null;
  setDiabetesTypeFromAccount: (t: DiabetesType, changedAt: string | null, userId: string) => void;
  setDiabetesTypeSyncedFor: (userId: string) => void;

  // Appearance: dark (default), light, or follow the OS.
  themeMode: ThemeMode;
  setThemeMode: (m: ThemeMode) => void;

  // UI language: 'system' (default) follows the device, else de/en/fr/it.
  language: LanguageSetting;
  setLanguage: (l: LanguageSetting) => void;

  // Blood-glucose display unit (issue #21): mmol/L (default) or mg/dL.
  glucoseUnit: GlucoseUnit;
  setGlucoseUnit: (u: GlucoseUnit) => void;
  // When the user consented to importing CGM health data (ISO), or null.
  glucoseConsentAt: string | null;
  setGlucoseConsent: (granted: boolean) => void;

  // Password reset: 'active' after opening a valid reset link (set a new
  // password), 'expired' for an invalid one. Not persisted.
  passwordRecovery: PasswordRecovery;
  setPasswordRecovery: (v: PasswordRecovery) => void;

  // Sync status (not persisted) and time of the last successful sync.
  syncStatus: SyncStatus;
  setSyncStatus: (s: SyncStatus) => void;
  lastSyncedAt: string | null;
  setLastSyncedAt: (iso: string | null) => void;
  // Bumped when a sync brought in remote changes, so lists reload.
  dataRevision: number;
  bumpDataRevision: () => void;

  // Auth/session.
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;

  // Premium = demo unlock OR a grant from the Dialy-Editor. isPremium is
  // derived from the two, so read that one.
  isPremium: boolean;
  // Demo unlock (Paywall / long press in the account view; no real IAP in
  // this build). Persisted so the premium UI can be tested across restarts.
  demoPremium: boolean;
  setPremium: (v: boolean) => void;
  togglePremiumDev: () => void;
  // Account whose Premium grant (public.premium_grants) the last sync found,
  // or null. Kept per account so it works offline and not for others.
  grantedPremiumFor: string | null;
  setGrantedPremiumFor: (userId: string | null) => void;

  // Has the DB been seeded/initialised this app session.
  ready: boolean;
  setReady: (v: boolean) => void;

  // Derived gate context for the policy module.
  gateContext: () => GateContext;
  isLoggedIn: () => boolean;
}

type PremiumFields = Pick<AppState, 'user' | 'demoPremium' | 'grantedPremiumFor'>;

/** Recomputes the derived isPremium. */
function withPremium<T extends PremiumFields>(s: T): T & { isPremium: boolean } {
  const granted = s.user !== null && s.grantedPremiumFor === s.user.id;
  return { ...s, isPremium: s.demoPremium || granted };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      diabetesType: 't1',
      setDiabetesType: (t) => set({ diabetesType: t, diabetesTypeChangedAt: new Date().toISOString() }),
      diabetesTypeChangedAt: null,
      diabetesTypeSyncedFor: null,
      setDiabetesTypeFromAccount: (t, changedAt, userId) =>
        set({ diabetesType: t, diabetesTypeChangedAt: changedAt, diabetesTypeSyncedFor: userId }),
      setDiabetesTypeSyncedFor: (userId) => set({ diabetesTypeSyncedFor: userId }),

      themeMode: 'dark',
      setThemeMode: (m) => set({ themeMode: m }),

      language: 'system',
      setLanguage: (l) => set({ language: l }),

      glucoseUnit: 'mmol',
      setGlucoseUnit: (u) => set({ glucoseUnit: u }),
      glucoseConsentAt: null,
      setGlucoseConsent: (granted) =>
        set({ glucoseConsentAt: granted ? new Date().toISOString() : null }),

      passwordRecovery: { state: 'idle' },
      setPasswordRecovery: (v) => set({ passwordRecovery: v }),

      syncStatus: { state: 'idle', pending: 0 },
      setSyncStatus: (s) => set({ syncStatus: s }),
      lastSyncedAt: null,
      setLastSyncedAt: (iso) => set({ lastSyncedAt: iso }),
      dataRevision: 0,
      bumpDataRevision: () => set((s) => ({ dataRevision: s.dataRevision + 1 })),

      user: null,
      setUser: (u) => set((s) => withPremium({ ...s, user: u })),

      isPremium: false,
      demoPremium: false,
      setPremium: (v) => set((s) => withPremium({ ...s, demoPremium: v })),
      togglePremiumDev: () => set((s) => withPremium({ ...s, demoPremium: !s.demoPremium })),
      grantedPremiumFor: null,
      setGrantedPremiumFor: (userId) => set((s) => withPremium({ ...s, grantedPremiumFor: userId })),

      ready: false,
      setReady: (v) => set({ ready: v }),

      gateContext: () => ({
        isLoggedIn: get().user !== null,
        isPremium: get().isPremium,
      }),
      isLoggedIn: () => get().user !== null,
    }),
    {
      name: 'dialy-app-state',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist user-preference + flags; `user` session is restored from
      // Supabase on launch, and runtime flags (`ready`) shouldn't persist.
      partialize: (s) => ({
        diabetesType: s.diabetesType,
        diabetesTypeChangedAt: s.diabetesTypeChangedAt,
        diabetesTypeSyncedFor: s.diabetesTypeSyncedFor,
        themeMode: s.themeMode,
        language: s.language,
        glucoseUnit: s.glucoseUnit,
        glucoseConsentAt: s.glucoseConsentAt,
        lastSyncedAt: s.lastSyncedAt,
        demoPremium: s.demoPremium,
        grantedPremiumFor: s.grantedPremiumFor,
      }),
      // Version 0 stored the demo flag as isPremium.
      version: 1,
      migrate: (persisted, version) => {
        const old = (persisted ?? {}) as { isPremium?: boolean; demoPremium?: boolean };
        if (version === 0) return { ...old, demoPremium: Boolean(old.isPremium) };
        return old;
      },
      merge: (persisted, current) => withPremium({ ...current, ...(persisted as Partial<AppState>) }),
    }
  )
);
