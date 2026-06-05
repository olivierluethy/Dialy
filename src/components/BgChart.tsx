import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { colors, radius, spacing } from '@/theme/theme';
import type { BgCurvePoint } from '@/types/models';

/**
 * Dark-themed line chart for the illustrative blood-sugar trend.
 *
 * Chart library choice: react-native-gifted-charts (built on react-native-svg).
 * It runs cleanly in Expo Go with no extra native setup, unlike Victory Native
 * XL, which depends on Skia and needs a custom dev build. (See README.)
 *
 * Hyper/hypo reference zones are drawn as horizontal rule lines. The curve is
 * an EDUCATIONAL ESTIMATE — never a clinical prediction.
 */
const HYPO_MMOL = 3.9; // below ≈ low
const HYPER_MMOL = 10.0; // above ≈ high

export function BgChart({ curve }: { curve: BgCurvePoint[] }) {
  const { width } = useWindowDimensions();
  const chartWidth = width - spacing.lg * 2 - spacing.lg * 2; // screen pad + card pad

  const data = useMemo(
    () =>
      curve.map((p) => ({
        value: p.value,
        label: p.minute % 30 === 0 ? `${p.minute}` : '',
        dataPointColor:
          p.value <= HYPO_MMOL
            ? colors.hypo
            : p.value >= HYPER_MMOL
              ? colors.danger
              : colors.accent,
      })),
    [curve]
  );

  if (curve.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Gib Werte ein, um den Verlauf zu sehen.</Text>
      </View>
    );
  }

  const values = curve.map((p) => p.value);
  const maxValue = Math.ceil(Math.max(...values, HYPER_MMOL) + 1);

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        width={chartWidth}
        height={180}
        thickness={3}
        color={colors.accent}
        startFillColor={colors.accent}
        areaChart
        startOpacity={0.18}
        endOpacity={0.0}
        hideRules={false}
        rulesColor={colors.border}
        rulesType="dashed"
        yAxisColor={colors.border}
        xAxisColor={colors.border}
        yAxisTextStyle={styles.axisText}
        xAxisLabelTextStyle={styles.axisText}
        maxValue={maxValue}
        noOfSections={4}
        backgroundColor="transparent"
        dataPointsColor={colors.accent}
        showReferenceLine1
        referenceLine1Position={HYPER_MMOL}
        referenceLine1Config={{
          color: colors.danger,
          dashWidth: 4,
          dashGap: 4,
          thickness: 1,
        }}
        showReferenceLine2
        referenceLine2Position={HYPO_MMOL}
        referenceLine2Config={{
          color: colors.hypo,
          dashWidth: 4,
          dashGap: 4,
          thickness: 1,
        }}
      />
      <View style={styles.legendRow}>
        <Legend color={colors.danger} label={`Hyper ≥ ${HYPER_MMOL.toFixed(1)}`} />
        <Legend color={colors.accent} label="Sport-Start" />
        <Legend color={colors.hypo} label={`Hypo ≤ ${HYPO_MMOL.toFixed(1)}`} />
      </View>
      <Text style={styles.axisCaption}>Zeit in Minuten</Text>
    </View>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: spacing.sm },
  empty: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgInput,
    borderRadius: radius.card,
  },
  emptyText: { color: colors.textTertiary, fontSize: 14 },
  axisText: { color: colors.textTertiary, fontSize: 11 },
  axisCaption: {
    color: colors.textTertiary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.xs },
  legendText: { color: colors.textSecondary, fontSize: 12 },
});
