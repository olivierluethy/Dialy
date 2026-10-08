import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useThemedStyles } from '@/theme/useTheme';

interface NutrientBarProps {
  label: string;
  value: string; // already-formatted display value, e.g. "36 g"
  /** 0..1 fill fraction of the bar. */
  fraction: number;
  color: string;
}

/**
 * A labelled horizontal bar used in the KH-Rechner Nährwerte section.
 * Colours come from the data.* tokens.
 */
export function NutrientBar({ label, value, fraction, color }: NutrientBarProps) {
  const styles = useThemedStyles(makeStyles);
  const pct = Math.max(0, Math.min(1, fraction)) * 100;
  return (
    <View style={styles.row}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    row: { marginBottom: spacing.md },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    label: { fontSize: 14, color: colors.textSecondary },
    value: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
    track: {
      height: 8,
      borderRadius: radius.pill,
      backgroundColor: colors.bgInput,
      overflow: 'hidden',
    },
    fill: { height: '100%', borderRadius: radius.pill },
  });
