import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DiabetesType } from '@/types/models';
import type { ThemeMode } from '@/theme/theme';
import type { AuthUser } from '@/services/auth';
import type { GateContext } from '@/policy/gating';

interface AppState {
  // Global Typ-1/Typ-2 selection — persists across tabs and restarts.
  diabetesType: DiabetesType;
  setDiabetesType: (t: DiabetesType) => void;

  // Appearance: dark (default), light, or follow the OS.
  themeMode: ThemeMode;
  setThemeMode: (m: ThemeMode) => void;

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
        isPremium: s.isPremium,
      }),
    }
  )
);
