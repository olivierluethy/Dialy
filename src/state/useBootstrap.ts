import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useAppStore } from '@/state/store';
import { seedDatabase } from '@/db/seed';
import { authService } from '@/services/auth';
import { syncEngine } from '@/sync/syncEngine';
import { fcm } from '@/services/fcm';
import { Sentry } from '@/services/sentry';

/**
 * One-time app bootstrap:
 *  1. init crash reporting (no-op without DSN)
 *  2. seed/migrate the local DB (offline source of truth)
 *  3. restore any existing Supabase session
 *  4. register FCM sync-ping handler (no-op without config) and sync-on-foreground
 */
export function useBootstrap(): void {
  const setUser = useAppStore((s) => s.setUser);
  const setReady = useAppStore((s) => s.setReady);

  useEffect(() => {
    let mounted = true;

    (async () => {
      Sentry.init();
      try {
        await seedDatabase();
        const user = await authService.currentUser();
        if (mounted && user) {
          setUser(user);
          void syncEngine.syncNow();
        }
        // FCM is the intended sync trigger (no polling). No-op when unconfigured.
        await fcm.register(() => void syncEngine.syncNow());
      } catch (e) {
        Sentry.captureException(e);
      } finally {
        if (mounted) setReady(true);
      }
    })();

    // Fallback sync trigger for local dev when FCM is inactive: sync whenever
    // the app returns to the foreground.
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && useAppStore.getState().user) {
        void syncEngine.syncNow();
      }
    });

    // The server ended the session (e.g. password changed elsewhere): sign
    // out locally too. Offline the session is kept, so this only fires on a
    // definitive answer from the server.
    const unsubscribeAuth = authService.onSignedOut(() => setUser(null));

    return () => {
      mounted = false;
      sub.remove();
      unsubscribeAuth();
    };
  }, [setUser, setReady]);
}
