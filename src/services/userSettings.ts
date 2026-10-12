import type { SupabaseClient, User } from '@supabase/supabase-js';
import { useAppStore } from '@/state/store';
import type { DiabetesType } from '@/types/models';

/**
 * The diabetes type (settings / Ratgeber) saved in the account: Supabase
 * user metadata, so it follows the user to other devices. Reconciled on
 * every sync, last write wins:
 *  - first sync for this account: the account's value wins (if it has one),
 *  - afterwards: whichever side changed it last.
 */
const TYPE_KEY = 'diabetes_type';
const CHANGED_KEY = 'diabetes_type_changed_at';

const isType = (v: unknown): v is DiabetesType => v === 't1' || v === 't2';

export async function syncDiabetesType(sb: SupabaseClient, user: User): Promise<void> {
  const meta = user.user_metadata ?? {};
  const remote = isType(meta[TYPE_KEY]) ? meta[TYPE_KEY] : null;
  const remoteAt = typeof meta[CHANGED_KEY] === 'string' ? (meta[CHANGED_KEY] as string) : null;
  const s = useAppStore.getState();
  const localAt = s.diabetesTypeChangedAt;
  const firstSync = s.diabetesTypeSyncedFor !== user.id;

  const remoteNewer = remote !== null && (firstSync || !localAt || (remoteAt !== null && remoteAt > localAt));
  if (remoteNewer) {
    s.setDiabetesTypeFromAccount(remote, remoteAt, user.id);
    return;
  }
  if (remote === s.diabetesType) {
    if (firstSync) s.setDiabetesTypeSyncedFor(user.id);
    return;
  }
  // The device's choice is newer (or the account has none yet): save it.
  const { error } = await sb.auth.updateUser({
    data: { [TYPE_KEY]: s.diabetesType, [CHANGED_KEY]: localAt ?? new Date().toISOString() },
  });
  if (!error) s.setDiabetesTypeSyncedFor(user.id);
}
