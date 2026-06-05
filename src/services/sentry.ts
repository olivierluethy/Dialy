import { config } from '@/config';

/**
 * Crash reporting wrapper. No-op unless a Sentry DSN is configured, so the app
 * runs with zero external setup. Health data is NEVER attached to events
 * (specially protected data — GDPR Art. 9 / revDSG Art. 5).
 *
 * To enable later: add `sentry-expo`, set EXPO_PUBLIC_SENTRY_DSN, and wire the
 * real `init`/`captureException` calls inside the guards below.
 */
const enabled = config.sentryDsn.length > 0;

export const Sentry = {
  init(): void {
    if (!enabled) return;
    // TODO(sentry): Sentry.init({ dsn: config.sentryDsn }) once sentry-expo added.
  },
  captureException(error: unknown): void {
    if (!enabled) {
      // Fall back to console so failures aren't swallowed in dev.
      // eslint-disable-next-line no-console
      console.warn('[Dialy] captured error:', error);
      return;
    }
    // TODO(sentry): forward to Sentry.captureException(error).
  },
};
