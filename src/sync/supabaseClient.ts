import 'react-native-url-polyfill/auto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config, isSupabaseConfigured } from '@/config';

/**
 * Supabase client. The client ONLY ever uses the public anon key plus the
 * signed-in user's JWT. Row-Level Security (see supabase/migrations) ensures a
 * user can only read/write their own rows. No service-role key or DB
 * credentials ever live in the client bundle.
 *
 * Returns null when Supabase isn't configured — the app then runs fully
 * offline (auth + sync disabled), which is a supported mode.
 */
let client: SupabaseClient | null = null;

/**
 * Where the session is persisted — the same value supabase-js would derive by
 * default (so existing sign-ins survive), made explicit so the app can read
 * the stored session itself while offline (see authService.currentUser).
 */
export const supabaseStorageKey = (): string =>
  `sb-${new URL(config.supabaseUrl).hostname.split('.')[0]}-auth-token`;

/** True for errors caused by a missing connection rather than by the server. */
export const isNetworkError = (e: unknown): boolean => {
  const err = e as { name?: string; message?: string } | null;
  const msg = (err?.message ?? '').toLowerCase();
  return (
    err?.name === 'AuthRetryableFetchError' ||
    msg.includes('failed to fetch') ||
    msg.includes('network request failed') ||
    msg.includes('networkerror')
  );
};

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        storageKey: supabaseStorageKey(),
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}
