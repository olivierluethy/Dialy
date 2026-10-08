import { ExpoConfig, ConfigContext } from 'expo/config';

/**
 * Dialy – Diabetes-Begleiter (dark by default, optional light mode; offline-first).
 *
 * Secrets are NEVER hard-coded here. Public, client-safe values
 * (Supabase project URL + anon key) come from environment variables
 * and are exposed via `extra`. A missing value simply disables sync /
 * auth and the app keeps running fully offline.
 *
 * IMPORTANT: only the Supabase *anon* key belongs in the client.
 * Never put a service-role key or DB credentials here.
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Dialy',
  slug: 'dialy',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'dialy',
  // 'automatic' so the OS appearance is reported to the app; the in-app
  // setting (Dunkel / Hell / System, default Dunkel) decides what is shown.
  userInterfaceStyle: 'automatic',
  backgroundColor: '#0E1512',
  splash: {
    backgroundColor: '#0E1512',
    resizeMode: 'contain',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'net.dialy.app',
    userInterfaceStyle: 'automatic',
    // Manual-entry CGM/health fallback always works; native HealthKit
    // bridge is a TODO(native) follow-up – see services/health.ts.
  },
  android: {
    package: 'net.dialy.app',
    userInterfaceStyle: 'automatic',
    adaptiveIcon: {
      backgroundColor: '#0E1512',
    },
    permissions: [], // no camera / storage access needed
  },
  plugins: [
    'expo-asset',
    'expo-font',
    'expo-secure-store',
    'expo-sqlite',
  ],
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
    // Recipient of the Kontakt form (food suggestions / corrections).
    contactEmail: process.env.EXPO_PUBLIC_CONTACT_EMAIL ?? '',
    // Feature flags – everything external is off by default so the app
    // runs with zero configuration.
    featureFcm: process.env.EXPO_PUBLIC_FEATURE_FCM === 'true',
    featureHealthImport: process.env.EXPO_PUBLIC_FEATURE_HEALTH === 'true',
  },
});
