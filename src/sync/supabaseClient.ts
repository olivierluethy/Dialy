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

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}
