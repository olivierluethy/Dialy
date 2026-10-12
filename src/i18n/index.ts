import { useAppStore } from '@/state/store';
import de, { type Dict } from '@/i18n/locales/de';
import en from '@/i18n/locales/en';
import fr from '@/i18n/locales/fr';
import it from '@/i18n/locales/it';

/**
 * UI languages. German is the reference (and the language of the stored
 * data: food names, categories, portion labels); the others translate it.
 *
 * Components get the dictionary with `useT()` (re-renders on a language
 * change); plain functions outside React use `getT()`.
 */
export type Language = 'de' | 'en' | 'fr' | 'it';
/** The user's choice: a language, or follow the device. */
export type LanguageSetting = Language | 'system';

export type { Dict };

const DICTS: Record<Language, Dict> = { de, en, fr, it };

/** Picker order: the Swiss national languages first. Names in their own language. */
export const LANGUAGES: Array<{ code: Language; name: string; short: string }> = [
  { code: 'de', name: 'Deutsch', short: 'DE' },
  { code: 'fr', name: 'Français', short: 'FR' },
  { code: 'it', name: 'Italiano', short: 'IT' },
  { code: 'en', name: 'English', short: 'EN' },
];

/** Device language if supported, else German. */
export function systemLanguage(): Language {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const base = locale.toLowerCase().split(/[-_]/)[0];
    if (base && base in DICTS) return base as Language;
  } catch {
    // No Intl support: fall through.
  }
  return 'de';
}

export const resolveLanguage = (setting: LanguageSetting): Language =>
  setting === 'system' ? systemLanguage() : setting;

/** Current language, for code outside React. */
export const getLanguage = (): Language => resolveLanguage(useAppStore.getState().language);

/** Current dictionary, for code outside React. */
export const getT = (): Dict => DICTS[getLanguage()];

/** Current language; re-renders when it changes. */
export function useLanguage(): Language {
  return resolveLanguage(useAppStore((s) => s.language));
}

/** Current dictionary; re-renders when the language changes. */
export function useT(): Dict {
  return DICTS[useLanguage()];
}
