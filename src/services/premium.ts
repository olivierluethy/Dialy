import type { SupabaseClient } from '@supabase/supabase-js';
import { useAppStore } from '@/state/store';

/**
 * Premium granted by hand in the Dialy-Editor (table `premium_grants`,
 * supabase/migrations/0012_premium_grants.sql). Read on every sync; the
 * result is kept in the store (per account), so it also holds offline.
 */
export async function refreshPremiumGrant(sb: SupabaseClient, uid: string): Promise<void> {
  const { data, error } = await sb
    .from('premium_grants')
    .select('expires_at')
    .eq('user_id', uid)
    .maybeSingle();
  // Missing table (migration not run yet) or a failed request: keep what we
  // know rather than taking Premium away.
  if (error) return;
  const active = data !== null && (data.expires_at === null || new Date(data.expires_at) > new Date());
  const store = useAppStore.getState();
  if (active) store.setGrantedPremiumFor(uid);
  else if (store.grantedPremiumFor === uid) store.setGrantedPremiumFor(null);
}
