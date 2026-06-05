/**
 * Dialy design system — DARK THEME ONLY (authoritative).
 *
 * There is no light theme, no toggle, no system-appearance following.
 * Every colour used anywhere in the app must come from this file.
 * Do not hard-code colours in components.
 */

export const colors = {
  // Backgrounds
  bgBase: '#0E1512', // app background (near-black, slight green tint)
  bgSurface: '#161D1A', // cards, list rows
  bgSurfaceAlt: '#1E2723', // elevated / nested surfaces, summary chips
  bgInput: '#1B2420', // text inputs, slider track bg

  // Brand / accent
  accent: '#3DBA7D', // primary green (active tab, primary buttons, selected segment)
  accentPressed: '#34A06C',
  accentSubtle: '#14271F', // tinted background for accent chips / icon bubbles

  // Text
  textPrimary: '#F2F5F3',
  textSecondary: '#9DACA3',
  textTertiary: '#6B7A72', // captions, timestamps, placeholder
  textOnAccent: '#0E1512', // text on top of accent-green fills

  // Data-viz / semantic
  dataCarb: '#3DBA7D', // carbohydrate bar (green)
  dataSugar: '#E8915A', // sugar bar (orange)
  dataGlyc: '#4FD1B5', // glycaemic index bar (teal)
  dataFat: '#8C9A92', // fat bar (grey-green)
  warn: '#E8915A',
  danger: '#E5654F', // hypo/hyper markers, destructive actions
  hypo: '#5AA9E8', // low-glucose marker
  border: '#2A332E', // dividers, card outlines
} as const;

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

export const typography = {
  screenTitle: { fontSize: 30, fontWeight: '700' as const, color: colors.textPrimary },
  sectionTitle: { fontSize: 20, fontWeight: '700' as const, color: colors.textPrimary },
  // Small uppercase section labels in tertiary colour
  label: {
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 1,
    color: colors.textTertiary,
    textTransform: 'uppercase' as const,
  },
  body: { fontSize: 16, color: colors.textPrimary },
  bodySecondary: { fontSize: 15, color: colors.textSecondary },
  caption: { fontSize: 13, color: colors.textTertiary },
} as const;

// Subtle dark-tuned elevation. Never rely on white shadows.
export const elevation = {
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
} as const;

export const theme = { colors, spacing, radius, typography, elevation };
export type Theme = typeof theme;
