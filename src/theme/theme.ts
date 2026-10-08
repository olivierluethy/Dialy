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
}

export const darkColors: Colors = {
  bgBase: '#0E1512', // near-black, slight green tint
  bgSurface: '#161D1A',
  bgSurfaceAlt: '#1E2723',
  bgInput: '#1B2420',

  accent: '#3DBA7D',
  accentPressed: '#34A06C',
  accentSubtle: '#14271F',

  textPrimary: '#F2F5F3',
  textSecondary: '#9DACA3',
  textTertiary: '#6B7A72',
  textOnAccent: '#0E1512',

  dataCarb: '#3DBA7D',
  dataSugar: '#E8915A',
  dataGlyc: '#4FD1B5',
  dataFat: '#8C9A92',
  warn: '#E8915A',
  danger: '#E5654F',
  hypo: '#5AA9E8',
  border: '#2A332E',
  shadow: 'rgba(0, 0, 0, 0.35)',
};

// Light palette: same green-tinted neutrals, with the accent and semantic
// colours darkened so text on white keeps a readable contrast.
export const lightColors: Colors = {
  bgBase: '#F4F7F5',
  bgSurface: '#FFFFFF',
  bgSurfaceAlt: '#EAF0EC',
  bgInput: '#EEF2EF',

  accent: '#1B7F50',
  accentPressed: '#176C44',
  accentSubtle: '#DCEFE4',

  textPrimary: '#111A16',
  textSecondary: '#4A5952',
  textTertiary: '#66756D',
  textOnAccent: '#FFFFFF',

  dataCarb: '#1B7F50',
  dataSugar: '#D9733A',
  dataGlyc: '#1FA88A',
  dataFat: '#7D8B83',
  warn: '#B85C1E',
  danger: '#C9402B',
  hypo: '#2F7FC1',
  border: '#D5DED8',
  shadow: 'rgba(16, 32, 24, 0.10)',
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
