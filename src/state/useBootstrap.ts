import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import * as Linking from 'expo-linking';
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
  const setPasswordRecovery = useAppStore((s) => s.setPasswordRecovery);

  useEffect(() => {
    let mounted = true;

    // Password-reset link (from the e-mail) opened the app: sign in with its
    // one-time session and ask for a new password.
    const handleLink = async (url: string | null): Promise<boolean> => {
      if (!url) return false;
      const result = await authService.handleRecoveryLink(url);
      if (!result) return false;
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        // Don't leave the tokens in the address bar / history.
        window.history.replaceState(null, '', window.location.pathname);
      }
      if ('error' in result) {
        setPasswordRecovery({ state: 'expired', message: result.error });
        return false;
      }
      setUser(result.user);
      setPasswordRecovery({ state: 'active' });
      return true;
    };
    const linkSub = Linking.addEventListener('url', ({ url }) => void handleLink(url));

    (async () => {
      Sentry.init();
      try {
        await seedDatabase();
        await handleLink(await Linking.getInitialURL());
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

    // Browser: send waiting changes as soon as the connection is back (native
    // apps retry on a timer and on return to the foreground).
    const onOnline = () => {
      if (useAppStore.getState().user) void syncEngine.syncNow();
    };
    const isWeb = Platform.OS === 'web' && typeof window !== 'undefined';
    if (isWeb) window.addEventListener('online', onOnline);

    return () => {
      mounted = false;
      sub.remove();
      linkSub.remove();
      unsubscribeAuth();
      if (isWeb) window.removeEventListener('online', onOnline);
    };
  }, [setUser, setReady, setPasswordRecovery]);
}
