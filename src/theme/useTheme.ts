import { useColorScheme } from 'react-native';
import { useAppStore } from '@/state/store';
import { palettes, type ColorScheme, type Colors } from '@/theme/theme';
import { withAppFont } from '@/theme/fonts';

/**
 * The active colour scheme and palette, resolved from the user's appearance
 * setting ('dark' | 'light' | 'system'). 'system' follows the OS appearance.
 */
export function useTheme(): { scheme: ColorScheme; colors: Colors } {
  const mode = useAppStore((s) => s.themeMode);
  const system = useColorScheme();
  const scheme: ColorScheme =
    mode === 'system' ? (system === 'light' ? 'light' : 'dark') : mode;
  return { scheme, colors: palettes[scheme] };
}

// Styles are built at most once per factory and scheme, then shared by every
// component instance that uses them.
const styleCache = new WeakMap<object, Partial<Record<ColorScheme, unknown>>>();

/**
 * Theme-aware replacement for a module-level `StyleSheet.create`. Pass a
 * module-level factory `(colors) => StyleSheet.create({...})`. Text styles
 * also get the app font (see theme/fonts.ts).
 */
export function useThemedStyles<T>(factory: (colors: Colors) => T): T {
  const { scheme, colors } = useTheme();
  let entry = styleCache.get(factory);
  if (!entry) {
    entry = {};
    styleCache.set(factory, entry);
  }
  if (!(scheme in entry)) entry[scheme] = withAppFont(factory(colors));
  return entry[scheme] as T;
}
