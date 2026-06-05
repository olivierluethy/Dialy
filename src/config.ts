import Constants from 'expo-constants';

/**
 * Central, typed access to the public runtime config (from app.config.ts
 * `extra`). Everything is optional — missing values keep the app offline.
 */
interface DialyExtra {
  supabaseUrl: string;
  supabaseAnonKey: string;
  sentryDsn: string;
  featureFcm: boolean;
  featureHealthImport: boolean;
}

const extra = (Constants.expoConfig?.extra ?? {}) as Partial<DialyExtra>;

export const config = {
  supabaseUrl: extra.supabaseUrl ?? '',
  supabaseAnonKey: extra.supabaseAnonKey ?? '',
  sentryDsn: extra.sentryDsn ?? '',
  featureFcm: Boolean(extra.featureFcm),
  featureHealthImport: Boolean(extra.featureHealthImport),
};

/** True when a Supabase project is configured (enables auth + sync). */
export const isSupabaseConfigured = (): boolean =>
  config.supabaseUrl.length > 0 && config.supabaseAnonKey.length > 0;
