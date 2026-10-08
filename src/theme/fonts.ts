import { Platform, type TextStyle } from 'react-native';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';

/**
 * App typeface. iOS keeps the system font (SF Pro). SF Pro may only be used
 * on Apple platforms, so Android and web use Inter — the closest freely
 * licensed (OFL) match.
 */
export const USE_CUSTOM_FONT = Platform.OS !== 'ios';

/** Font files for `useFonts()`; empty on iOS. */
export const fontAssets: Record<string, number> = USE_CUSTOM_FONT
  ? { Inter_400Regular, Inter_600SemiBold, Inter_700Bold }
  : {};

/**
 * Text style for a font weight. A custom font needs one family per weight
 * (setting `fontWeight` on it would fall back or fake the bold), so on
 * Android/web the weight is expressed through `fontFamily` only.
 */
export function fontFor(
  weight?: TextStyle['fontWeight']
): Pick<TextStyle, 'fontFamily' | 'fontWeight'> {
  if (!USE_CUSTOM_FONT) return weight ? { fontWeight: weight } : {};
  const w = weight === 'bold' ? 700 : Number(weight ?? 400) || 400;
  if (w >= 700) return { fontFamily: 'Inter_700Bold' };
  if (w >= 600) return { fontFamily: 'Inter_600SemiBold' };
  return { fontFamily: 'Inter_400Regular' };
}

/**
 * Applies the app font to every text style (any style with `fontSize` or
 * `fontWeight`) of a style sheet. Inter also gets SF-like tighter tracking on
 * large text (iOS's SF Pro does this on its own).
 */
export function withAppFont<T>(styles: T): T {
  if (!USE_CUSTOM_FONT) return styles;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(styles as Record<string, TextStyle>)) {
    if (value.fontSize === undefined && value.fontWeight === undefined) {
      out[key] = value;
      continue;
    }
    const { fontWeight, ...rest } = value;
    const tracking =
      value.letterSpacing === undefined && (value.fontSize ?? 0) >= 20
        ? { letterSpacing: -0.02 * (value.fontSize ?? 0) }
        : {};
    out[key] = { ...rest, ...tracking, ...fontFor(fontWeight) };
  }
  return out as T;
}
