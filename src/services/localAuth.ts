import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { uuidv4, nowIso } from '@/utils/id';
import type { AuthResult, AuthUser } from '@/services/auth';

/**
 * Offline, on-device account store — the fallback used when no Supabase backend
 * is configured (see services/auth.ts). It lets a user register and sign in so
 * the account-gated features (Tagebuch, Foto) work out of the box, fully
 * offline. There is NO sync in this mode: data stays local on the device, which
 * matches the app's offline-first design.
 *
 * Storage:
 *   - Accounts live in AsyncStorage (works on native AND web via localStorage).
 *   - Passwords are never stored in the clear: we keep a per-account random
 *     salt and a SHA-256 hash of `salt:password` (expo-crypto → native digest,
 *     Web Crypto in the browser).
 *
 * Note: SHA-256 is a fast hash, not a slow password KDF like bcrypt/scrypt.
 * That is a deliberate, proportionate choice for a LOCAL, non-synced,
 * unpublished build — the store is already app-private on the device. If this
 * ever becomes a real account system, use the Supabase path instead (it is
 * preferred automatically whenever a backend is configured).
 */

const ACCOUNTS_KEY = 'dialy-local-accounts';
const SESSION_KEY = 'dialy-local-session';

interface StoredAccount {
  id: string;
  email: string; // normalized: trimmed + lowercased
  salt: string; // hex
  hash: string; // hex SHA-256 of `${salt}:${password}`
  created_at: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 6;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function readAccounts(): Promise<StoredAccount[]> {
  try {
    const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

async function writeAccounts(accounts: StoredAccount[]): Promise<void> {
  await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function randomSalt(): string {
  const bytes = Crypto.getRandomBytes(16);
  let hex = '';
  for (let i = 0; i < bytes.length; i += 1) {
    hex += bytes[i]!.toString(16).padStart(2, '0');
  }
  return hex;
}

function hashPassword(password: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`
  );
}

const toUser = (a: StoredAccount): AuthUser => ({ id: a.id, email: a.email });

/**
 * Local, offline account service. Mirrors the shape of the Supabase-backed
 * methods in services/auth.ts so authService can delegate to it transparently.
 */
export const localAuth = {
  async signUp(email: string, password: string): Promise<AuthResult> {
    const e = normalizeEmail(email);
    if (!EMAIL_RE.test(e)) {
      return { user: null, error: 'Bitte gib eine gültige E-Mail-Adresse ein.' };
    }
    if (password.length < MIN_PASSWORD) {
      return {
        user: null,
        error: 'Das Passwort erfüllt die Anforderungen nicht (mind. 6 Zeichen).',
      };
    }
    const accounts = await readAccounts();
    if (accounts.some((a) => a.email === e)) {
      return { user: null, error: 'Diese E-Mail ist bereits registriert.' };
    }
    const salt = randomSalt();
    const hash = await hashPassword(password, salt);
    const account: StoredAccount = {
      id: uuidv4(),
      email: e,
      salt,
      hash,
      created_at: nowIso(),
    };
    await writeAccounts([...accounts, account]);
    await AsyncStorage.setItem(SESSION_KEY, account.id);
    return { user: toUser(account), error: null };
  },

  async signIn(email: string, password: string): Promise<AuthResult> {
    const e = normalizeEmail(email);
    const accounts = await readAccounts();
    const account = accounts.find((a) => a.email === e);
    // Same message whether the email is unknown or the password is wrong, so a
    // caller can't probe which emails are registered.
    const invalid: AuthResult = {
      user: null,
      error: 'E-Mail oder Passwort ist falsch.',
    };
    if (!account) return invalid;
    const hash = await hashPassword(password, account.salt);
    if (hash !== account.hash) return invalid;
    await AsyncStorage.setItem(SESSION_KEY, account.id);
    return { user: toUser(account), error: null };
  },

  async signOut(): Promise<void> {
    await AsyncStorage.removeItem(SESSION_KEY);
  },

  async currentUser(): Promise<AuthUser | null> {
    try {
      const id = await AsyncStorage.getItem(SESSION_KEY);
      if (!id) return null;
      const accounts = await readAccounts();
      const account = accounts.find((a) => a.id === id);
      return account ? toUser(account) : null;
    } catch {
      return null;
    }
  },
};
