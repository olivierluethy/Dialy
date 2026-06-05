import { config } from '@/config';

/**
 * Firebase Cloud Messaging integration — structured but gated behind a feature
 * flag so the app runs without Firebase configured.
 *
 * Design (see §7 sync contract): the server pings the client about pending
 * changes via FCM; the client then pulls. NO polling. For local dev FCM is
 * inactive, and the sync engine falls back to sync-on-foreground + a manual
 * "jetzt synchronisieren" action.
 *
 * TODO(native): wire @react-native-firebase/messaging (requires a dev/EAS
 * build, not Expo Go) and call onSyncPing when a data-changed push arrives.
 */
export const fcm = {
  isEnabled(): boolean {
    return config.featureFcm;
  },

  /** Register for push + subscribe to the user's data-changed topic. */
  async register(_onSyncPing: () => void): Promise<void> {
    if (!config.featureFcm) return; // no-op when unconfigured
    // TODO(native): obtain FCM token, send to Supabase, subscribe to topic,
    // and invoke _onSyncPing() on incoming data-changed messages.
  },
};
