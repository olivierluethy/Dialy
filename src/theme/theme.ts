/**
 * Dialy design system — dark (default) and light palettes.
 *
 * Every colour used anywhere in the app must come from this file. Do not
 * hard-code colours in components; read the active palette via `useTheme()` /
 * `useThemedStyles()` (src/theme/useTheme.ts) so it follows the user's
 * appearance setting.
 */

export type ColorScheme = 'dark' | 'light';

/** Appearance setting chosen by the user. 'system' follows the OS. */
export type ThemeMode = ColorScheme | 'system';

export interface Colors {
  // Backgrounds
  bgBase: string; // app background
  bgSurface: string; // cards, list rows
  bgSurfaceAlt: string; // elevated / nested surfaces, summary chips
  bgInput: string; // text inputs, slider track bg

  // Brand / accent
  accent: string; // primary green (active tab, primary buttons, selected segment)
  accentPressed: string;
  accentSubtle: string; // tinted background for accent chips / icon bubbles

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string; // captions, timestamps, placeholder
  textOnAccent: string; // text on top of accent-green fills

  // Data-viz / semantic
  dataCarb: string; // carbohydrate bar (green)
  dataSugar: string; // sugar bar (orange)
  dataGlyc: string; // glycaemic index bar (teal)
  dataFat: string; // fat bar (grey-green)
  warn: string;
  danger: string; // hypo/hyper markers, destructive actions
  hypo: string; // low-glucose marker
  border: string; // dividers, card outlines
  shadow: string; // card shadow (alpha baked in)
  overlay: string; // dimmed backdrop behind dialogs
}

// Soft, pastel palette: desaturated mint accent, peach / lavender / coral
// instead of saturated orange / teal / red.
export const darkColors: Colors = {
  bgBase: '#131A17', // soft charcoal, slight green tint
  bgSurface: '#1A221F',
  bgSurfaceAlt: '#222B27',
  bgInput: '#1F2824',

  accent: '#8FD3B0', // pastel mint
  accentPressed: '#7CC3A0',
  accentSubtle: '#1E2F28',

  textPrimary: '#EEF2EF',
  textSecondary: '#A9B6AF',
  textTertiary: '#7A877F',
  textOnAccent: '#13201A',

  dataCarb: '#8FD3B0', // mint
  dataSugar: '#F2B48C', // peach
  dataGlyc: '#B5A8E6', // lavender
  dataFat: '#B9C4BE', // soft grey-green
  warn: '#F2B48C',
  danger: '#F0998A', // coral
  hypo: '#9CC3EC', // powder blue
  border: '#2C3631',
  shadow: 'rgba(0, 0, 0, 0.30)',
  overlay: 'rgba(0, 0, 0, 0.55)',
};

// Light palette: pastel fills (bars, tints, surfaces), while colours used as
// text on white (accent, warn, danger) stay muted but dark enough for ≥ 4.5:1
// contrast.
export const lightColors: Colors = {
  bgBase: '#F6F8F7',
  bgSurface: '#FFFFFF',
  bgSurfaceAlt: '#EEF3F0',
  bgInput: '#F0F4F2',

  accent: '#3A8562', // muted sage
  accentPressed: '#327354',
  accentSubtle: '#E1F0E8',

  textPrimary: '#1C2622',
  textSecondary: '#55635C',
  textTertiary: '#6F7D76',
  textOnAccent: '#FFFFFF',

  dataCarb: '#7CC4A0', // mint
  dataSugar: '#F0B08A', // peach
  dataGlyc: '#AFA2E0', // lavender
  dataFat: '#B8C2BC', // soft grey-green
  warn: '#A8653A',
  danger: '#B65A4B',
  hypo: '#5B93C7',
  border: '#DCE4DF',
  shadow: 'rgba(30, 50, 40, 0.08)',
  overlay: 'rgba(30, 50, 40, 0.30)',
};

export const palettes: Record<ColorScheme, Colors> = {
  dark: darkColors,
  light: lightColors,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const radius = {
  input: 12,
  button: 14,
  card: 16,
  pill: 999,
} as const;

// Subtle card elevation. The shadow colour (with its alpha) comes from the
// palette, so the opacity here is 1.
export const elevation = {
  card: {
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
} as const;
