import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSupabase, isNetworkError, supabaseStorageKey } from '@/sync/supabaseClient';
import { softDeleteAllUserData } from '@/db/repositories/userData';
import { localAuth } from '@/services/localAuth';

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
  /** Non-error hint, e.g. "check your inbox" after a sign-up needing confirmation. */
  notice?: string;
}

const SYNC_TABLES = [
  'meal_entries',
  'sport_entries',
  'bg_readings',
] as const;

/**
 * Auth + account service backed by Supabase Auth (email + password, JWT).
 *
 * When Supabase isn't configured, every method transparently falls back to a
 * local, on-device account store (services/localAuth.ts) so registration and
 * login work fully offline — the account-gated feature (Tagebuch) is
 * usable with zero backend setup. Configuring Supabase is preferred and takes
 * over automatically (it enables cross-device sync); until then the local
 * store keeps everything on the device.
 */
export const authService = {
  isConfigured(): boolean {
    return getSupabase() !== null;
  },

  async signIn(email: string, password: string): Promise<AuthResult> {
    const sb = getSupabase();
    if (!sb) return localAuth.signIn(email, password);
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error: translateAuthError(error.message) };
    return { user: toUser(data.user), error: null };
  },

  async signUp(email: string, password: string): Promise<AuthResult> {
    const sb = getSupabase();
    if (!sb) return localAuth.signUp(email, password);
    const { data, error } = await sb.auth.signUp({ email, password });
    if (error) return { user: null, error: translateAuthError(error.message) };
    // An already registered address gets a user without identities and no
    // error (Supabase doesn't reveal existing accounts that way).
    if (data.user && data.user.identities?.length === 0) {
      return { user: null, error: 'Diese E-Mail ist bereits registriert. Bitte melde dich an.' };
    }
    // With "Confirm email" enabled there's no session until the link is clicked.
    if (!data.session) {
      return {
        user: null,
        error: null,
        notice:
          `Fast geschafft! Wir haben dir eine E-Mail an ${email} geschickt. Bitte ` +
          'bestätige deine Adresse über den Link darin und melde dich danach an.',
      };
    }
    return { user: toUser(data.user), error: null };
  },

  async signOut(): Promise<void> {
    const sb = getSupabase();
    if (!sb) return localAuth.signOut();
    await sb.auth.signOut();
  },

  /**
   * The signed-in user, read from the session stored on the device — no
   * network round trip, so the app opens (and the diary stays usable)
   * offline. An expired access token is refreshed in the background once a
   * connection is available. If the server has really ended the session,
   * supabase-js drops it and emits SIGNED_OUT (see onSignedOut).
   *
   * (getSession() isn't used directly: offline with an expired token it
   * returns no session and retries the refresh for up to ~30 s.)
   */
  async currentUser(): Promise<AuthUser | null> {
    const sb = getSupabase();
    if (!sb) return localAuth.currentUser();
    const user = await storedSessionUser();
    if (user) void sb.auth.getSession(); // refresh in the background if needed
    return user;
  },

  /**
   * Sends a password-reset e-mail. The link in it opens the app again (see
   * handleRecoveryLink). Local accounts have no verified e-mail, so there's
   * no reset for them.
   */
  async requestPasswordReset(email: string): Promise<{ error: string | null }> {
    const sb = getSupabase();
    if (!sb) return { error: LOCAL_RESET_UNAVAILABLE };
    const { error } = await sb.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: recoveryRedirectUrl(),
    });
    return { error: error ? translateAuthError(error.message) : null };
  },

  /**
   * If `url` is a password-reset link, signs in with its one-time session and
   * returns the user — or an error for an expired / already used link. Returns
   * null for any other URL.
   */
  async handleRecoveryLink(
    url: string
  ): Promise<{ user: AuthUser } | { error: string } | null> {
    const sb = getSupabase();
    if (!sb) return null;
    const params = linkParams(url);
    if (params.get('error_code') || params.get('error')) {
      return { error: 'Der Link ist abgelaufen oder wurde schon verwendet. Bitte fordere einen neuen an.' };
    }
    if (params.get('type') !== 'recovery') return null;
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    if (!accessToken || !refreshToken) return null;
    const { data, error } = await sb.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error || !data.user) {
      return { error: 'Der Link ist abgelaufen oder wurde schon verwendet. Bitte fordere einen neuen an.' };
    }
    return { user: toUser(data.user)! };
  },

  /** Sets a new password for the signed-in user (after a reset link). */
  async updatePassword(password: string): Promise<{ error: string | null }> {
    const sb = getSupabase();
    if (!sb) return { error: LOCAL_RESET_UNAVAILABLE };
    const { error } = await sb.auth.updateUser({ password });
    return { error: error ? translateAuthError(error.message) : null };
  },

  /** Calls `handler` when the server-side session ends; returns an unsubscribe. */
  onSignedOut(handler: () => void): () => void {
    const sb = getSupabase();
    if (!sb) return () => {};
    const { data } = sb.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') handler();
    });
    return () => data.subscription.unsubscribe();
  },

  /**
   * Privacy: erase all of the user's data. Soft-deletes locally (so the
   * deletion syncs out and can't resurface), then issues matching deletes on
   * Supabase. Best-effort on the server; local deletion always succeeds.
   */
  async deleteAccountData(userId: string): Promise<{ error: string | null }> {
    await softDeleteAllUserData(userId);
    const sb = getSupabase();
    if (!sb) return { error: null }; // offline-only: local deletion is enough
    try {
      const ts = new Date().toISOString();
      for (const table of SYNC_TABLES) {
        // supabase-js reports failures in `error` instead of throwing.
        const { error } = await sb
          .from(table)
          .update({ deleted_at: ts, updated_at: ts })
          .eq('user_id', userId);
        if (error) return { error: error.message };
      }
      return { error: null };
    } catch (e) {
      return { error: String(e) };
    }
  },
};

const LOCAL_RESET_UNAVAILABLE =
  'Ohne Server kann das Passwort nicht zurückgesetzt werden: Lokale Konten haben keine bestätigte E-Mail-Adresse. Erstelle bei Bedarf ein neues Konto.';

/**
 * Where the reset link sends the user back to. Must be listed in Supabase
 * (Authentication → URL Configuration → Redirect URLs), otherwise Supabase
 * falls back to the Site URL.
 */
function recoveryRedirectUrl(): string {
  if (Platform.OS === 'web' && typeof window !== 'undefined') return window.location.origin;
  return Linking.createURL('/');
}

/** Query + fragment parameters of a link (Supabase puts the tokens in the #fragment). */
function linkParams(url: string): URLSearchParams {
  const hashAt = url.indexOf('#');
  const queryAt = url.indexOf('?');
  const hash = hashAt >= 0 ? url.slice(hashAt + 1) : '';
  const query = queryAt >= 0 ? url.slice(queryAt + 1, hashAt > queryAt ? hashAt : undefined) : '';
  return new URLSearchParams(`${query}&${hash}`);
}

/** User of the session supabase-js persisted on this device, if any. */
async function storedSessionUser(): Promise<AuthUser | null> {
  try {
    const raw = await AsyncStorage.getItem(supabaseStorageKey());
    if (!raw) return null;
    const stored = JSON.parse(raw) as { user?: { id: string; email?: string | null } };
    return toUser(stored.user ?? null);
  } catch {
    return null;
  }
}

function toUser(user: { id: string; email?: string | null } | null): AuthUser | null {
  if (!user) return null;
  return { id: user.id, email: user.email ?? '' };
}

/** Map common Supabase auth errors to simple Swiss-German copy. */
function translateAuthError(msg: string): string {
  const m = msg.toLowerCase();
  if (isNetworkError({ message: msg })) {
    return 'Keine Internetverbindung. Anmelden und Registrieren brauchen Internet – alles andere funktioniert auch offline.';
  }
  if (m.includes('invalid login')) return 'E-Mail oder Passwort ist falsch.';
  if (m.includes('already registered')) return 'Diese E-Mail ist bereits registriert.';
  if (m.includes('email not confirmed')) {
    return 'Bitte bestätige zuerst deine E-Mail-Adresse (Link in der Bestätigungs-Mail) und melde dich dann an.';
  }
  if (m.includes('should be different')) return 'Das neue Passwort muss sich vom bisherigen unterscheiden.';
  if (m.includes('rate limit')) return 'Zu viele Versuche. Bitte warte einen Moment und versuche es erneut.';
  if (m.includes('password')) return 'Das Passwort erfüllt die Anforderungen nicht (mind. 6 Zeichen).';
  if (m.includes('email')) return 'Bitte gib eine gültige E-Mail-Adresse ein.';
  return 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.';
}
