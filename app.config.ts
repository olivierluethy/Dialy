import { ExpoConfig, ConfigContext } from 'expo/config';

/**
 * Health-import native modules (issue #21 §3 B) are optional: they only take
 * effect in a dev/EAS build where the packages are installed. Referencing a
 * plugin that isn't installed would break `expo prebuild`, so each is added
 * only when it resolves. Install to enable:
 *   npm i @kingstinct/react-native-healthkit react-native-health-connect
 */
type PluginEntry = string | [string, Record<string, unknown>];
const optionalPlugin = (name: string, config?: Record<string, unknown>): PluginEntry | null => {
  try {
    require.resolve(name);
    return config ? [name, config] : name;
  } catch {
    return null;
  }
};

const HEALTH_USAGE =
  'Dialy liest deine Glukosewerte (z. B. von Dexcom oder FreeStyle Libre) aus Apple Health, um sie zusammen mit deinen Mahlzeiten anzuzeigen.';

const healthPlugins = [
  optionalPlugin('@kingstinct/react-native-healthkit', {
    NSHealthShareUsageDescription: HEALTH_USAGE,
  }),
  optionalPlugin('react-native-health-connect'),
].filter((p): p is PluginEntry => p !== null);

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
    // Glucose read from Apple Health (issue #21). The HealthKit entitlement is
    // added by the @kingstinct/react-native-healthkit config plugin; the usage
    // string below shows in the OS permission dialog.
    infoPlist: {
      NSHealthShareUsageDescription: HEALTH_USAGE,
    },
  },
  android: {
    package: 'net.dialy.app',
    userInterfaceStyle: 'automatic',
    adaptiveIcon: {
      backgroundColor: '#0E1512',
    },
    // Read blood glucose from Health Connect (issue #21); no other permissions.
    permissions: ['android.permission.health.READ_BLOOD_GLUCOSE'],
  },
  plugins: [
    'expo-asset',
    'expo-font',
    'expo-secure-store',
    'expo-sqlite',
    ...healthPlugins,
  ],
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
    // Recipient of the Kontakt form (food suggestions / corrections).
    contactEmail: process.env.EXPO_PUBLIC_CONTACT_EMAIL ?? '',
    // Feature flags – everything external is off by default so the app
    // runs with zero configuration.
    featureHealthImport: process.env.EXPO_PUBLIC_FEATURE_HEALTH === 'true',
  },
});
