import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DiabetesType } from '@/types/models';
import type { ThemeMode } from '@/theme/theme';
import type { AuthUser } from '@/services/auth';
import type { GateContext } from '@/policy/gating';

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
  // Global Typ-1/Typ-2 selection — persists across tabs and restarts.
  diabetesType: DiabetesType;
  setDiabetesType: (t: DiabetesType) => void;

  // Appearance: dark (default), light, or follow the OS.
  themeMode: ThemeMode;
  setThemeMode: (m: ThemeMode) => void;

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

  // Premium flag. For THIS build it's a dev toggle (no real IAP). Persisted so
  // the premium UI can be tested across restarts.
  isPremium: boolean;
  setPremium: (v: boolean) => void;
  togglePremiumDev: () => void;

  // Has the DB been seeded/initialised this app session.
  ready: boolean;
  setReady: (v: boolean) => void;

  // Derived gate context for the policy module.
  gateContext: () => GateContext;
  isLoggedIn: () => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      diabetesType: 't1',
      setDiabetesType: (t) => set({ diabetesType: t }),

      themeMode: 'dark',
      setThemeMode: (m) => set({ themeMode: m }),

      passwordRecovery: { state: 'idle' },
      setPasswordRecovery: (v) => set({ passwordRecovery: v }),

      syncStatus: { state: 'idle', pending: 0 },
      setSyncStatus: (s) => set({ syncStatus: s }),
      lastSyncedAt: null,
      setLastSyncedAt: (iso) => set({ lastSyncedAt: iso }),
      dataRevision: 0,
      bumpDataRevision: () => set((s) => ({ dataRevision: s.dataRevision + 1 })),

      user: null,
      setUser: (u) => set({ user: u }),

      isPremium: false,
      setPremium: (v) => set({ isPremium: v }),
      togglePremiumDev: () => set((s) => ({ isPremium: !s.isPremium })),

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
        themeMode: s.themeMode,
        lastSyncedAt: s.lastSyncedAt,
        isPremium: s.isPremium,
      }),
    }
  )
);
