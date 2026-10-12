import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import type { BgCurvePoint } from '@/types/models';
import { TREND_BASELINE } from '@/utils/sportCurve';
import { useT } from '@/i18n';

/**
 * Themed line chart for the generic, illustrative sport tendency
 * (see utils/sportCurve). Deliberately has no mmol/l scale and no hypo/hyper
 * zones: it shows a direction, never a predicted value for the user.
 *
 * Chart library choice: react-native-gifted-charts (built on react-native-svg).
 * It runs cleanly in Expo Go with no extra native setup, unlike Victory Native
 * XL, which depends on Skia and needs a custom dev build. (See README.)
 */
// Fixed scale so different activities/durations stay comparable.
const MAX_VALUE = 2 * TREND_BASELINE;

export function TrendChart({ curve }: { curve: BgCurvePoint[] }) {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  const chartWidth = width - spacing.lg * 2 - spacing.lg * 2; // screen pad + card pad

  const data = useMemo(
    () =>
      curve.map((p) => ({
        value: p.value,
        label: p.minute % 30 === 0 ? `${p.minute}` : '',
      })),
    [curve]
  );

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        width={chartWidth}
        height={160}
        thickness={3}
        color={colors.accent}
        startFillColor={colors.accent}
        areaChart
        startOpacity={0.18}
        endOpacity={0.0}
        hideRules
        hideYAxisText
        yAxisLabelWidth={8}
        yAxisColor={colors.border}
        xAxisColor={colors.border}
        xAxisLabelTextStyle={styles.axisText}
        maxValue={MAX_VALUE}
        noOfSections={4}
        backgroundColor="transparent"
        dataPointsColor={colors.accent}
        showReferenceLine1
        referenceLine1Position={TREND_BASELINE}
        referenceLine1Config={{
          color: colors.textTertiary,
          dashWidth: 4,
          dashGap: 4,
          thickness: 1,
        }}
      />
      <Text style={styles.axisCaption}>{t.chart.timeAxis}</Text>
      <Text style={styles.scaleNote}>{t.chart.noScale}</Text>
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    container: { paddingTop: spacing.sm },
    axisText: { color: colors.textTertiary, fontSize: 11 },
    axisCaption: {
      color: colors.textTertiary,
      fontSize: 12,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
    scaleNote: {
      color: colors.textTertiary,
      fontSize: 12,
      textAlign: 'center',
      marginTop: spacing.xs,
    },
  });
