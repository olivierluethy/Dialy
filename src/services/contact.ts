import { getSupabase, isNetworkError } from '@/sync/supabaseClient';
import { getT } from '@/i18n';

/**
 * Messages to the Dialy team, written to the Supabase table
 * `contact_messages` (insert-only via RLS): new foods and other requests
 * from the Kontakt form, error reports ('food_fix') and portion suggestions
 * ('portion', 0038) from a food in the KH-Rechner. The sender's account is
 * attached by the database when signed in. Nothing is queued offline.
 */

export interface ContactMessage {
  kind: 'new_food' | 'food_fix' | 'portion' | 'other';
  food_name: string; // subject for 'other'
  food_id?: string | null; // food_fix and portion
  carbs_per_100g?: number | null;
  sugar_per_100g?: number | null;
  fat_per_100g?: number | null;
  portion_label?: string | null; // portion only
  portion_grams?: number | null; // portion only
  message: string;
  app_version?: string | null;
}

/** Why a message could not be sent. */
export type ContactError = 'offline' | 'not-configured' | 'unavailable';

const TIMEOUT_MS = 8000;

export async function sendContactMessage(
  msg: ContactMessage
): Promise<{ ok: true } | { error: ContactError }> {
  const sb = getSupabase();
  if (!sb) return { error: 'not-configured' };
  try {
    // No .select(): senders may not read the table back.
    const reply = await Promise.race([
      sb.from('contact_messages').insert(msg),
      new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), TIMEOUT_MS)),
    ]);
    if (reply === 'timeout') return { error: 'offline' };
    if (reply.error) return { error: isNetworkError(reply.error) ? 'offline' : 'unavailable' };
    return { ok: true };
  } catch (e) {
    return { error: isNetworkError(e) ? 'offline' : 'unavailable' };
  }
}

/** User-facing explanation for a failed send. */
export function contactErrorText(error: ContactError): string {
  switch (error) {
    case 'offline':
      return getT().contact.errorOffline;
    case 'not-configured':
      return getT().contact.errorNotConfigured;
    default:
      return getT().contact.errorUnavailable;
  }
}
