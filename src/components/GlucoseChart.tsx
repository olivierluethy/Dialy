import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Rect, Path, Line, Circle, Text as SvgText, G } from 'react-native-svg';
import { spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import {
  mgdlToMmol,
  TARGET_HIGH_MMOL,
  TARGET_LOW_MMOL,
  type GlucoseUnit,
} from '@/utils/glucose';
import type { GlucosePoint } from '@/services/glucoseStats';

/** A meal placed on the day axis, plus its highlight state. */
export interface ChartMeal {
  number: number;
  minute: number; // local minute of day 0–1440
  selected: boolean;
}

/** Tooltip shown above a selected meal's post-meal peak. */
export interface ChartPeak {
  minute: number;
  mgdl: number;
  label: string; // e.g. "Spitze 10.5 um 13:00"
}

interface Props {
  segments: GlucosePoint[][]; // continuous runs; gaps between them stay empty
  meals: ChartMeal[];
  peak: ChartPeak | null;
  unit: GlucoseUnit;
  onSelectMeal: (number: number) => void;
}

const DAY_MIN = 1440;
const PAD = { top: 18, right: 10, bottom: 40, left: 30 };
const HEIGHT = 240;

/**
 * Day glucose curve with the target band shaded, meal markers on the time
 * axis and a tooltip for the selected meal's peak (issue #21 §5). Gaps in the
 * sensor data are left as breaks, never interpolated. Built on react-native-svg
 * for full control over the band, markers and selection highlight.
 */
export function GlucoseChart({ segments, meals, peak, unit, onSelectMeal }: Props) {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  // screen padding + card padding, both sides.
  const chartWidth = width - spacing.lg * 2 - spacing.lg * 2;
  const plotW = chartWidth - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;

  const { yLoMmol, yHiMmol, gridMmol } = useMemo(() => yScale(segments), [segments]);

  const xOf = (minute: number) => PAD.left + (minute / DAY_MIN) * plotW;
  const yOf = (mgdl: number) => {
    const v = mgdlToMmol(mgdl);
    const frac = (v - yLoMmol) / (yHiMmol - yLoMmol);
    return PAD.top + (1 - frac) * plotH;
  };
  const yOfMmol = (mmol: number) => PAD.top + (1 - (mmol - yLoMmol) / (yHiMmol - yLoMmol)) * plotH;

  const bandTop = yOfMmol(Math.min(TARGET_HIGH_MMOL, yHiMmol));
  const bandBottom = yOfMmol(Math.max(TARGET_LOW_MMOL, yLoMmol));

  const linePaths = segments.filter((s) => s.length > 0).map((seg) => toPath(seg, xOf, yOf));
  const areaPaths = segments
    .filter((s) => s.length > 1)
    .map((seg) => `${toPath(seg, xOf, yOf)} L ${xOf(seg[seg.length - 1]!.minute)} ${PAD.top + plotH} L ${xOf(seg[0]!.minute)} ${PAD.top + plotH} Z`);

  // X-axis ticks every 3 hours.
  const xTicks = Array.from({ length: 9 }, (_, i) => i * 180);

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={HEIGHT}>
        {/* Target band */}
        <Rect
          x={PAD.left}
          y={bandTop}
          width={plotW}
          height={Math.max(0, bandBottom - bandTop)}
          fill={colors.accent}
          opacity={0.14}
        />
        {/* Y grid + labels */}
        {gridMmol.map((m) => (
          <G key={`y${m}`}>
            <Line
              x1={PAD.left}
              y1={yOfMmol(m)}
              x2={PAD.left + plotW}
              y2={yOfMmol(m)}
              stroke={colors.border}
              strokeWidth={1}
            />
            <SvgText x={PAD.left - 6} y={yOfMmol(m) + 4} fill={colors.textTertiary} fontSize={10} textAnchor="end">
              {labelFor(m, unit)}
            </SvgText>
          </G>
        ))}
        {/* X ticks */}
        {xTicks.map((min) => (
          <SvgText
            key={`x${min}`}
            x={xOf(min)}
            y={HEIGHT - PAD.bottom + 16}
            fill={colors.textTertiary}
            fontSize={10}
            textAnchor="middle"
          >
            {`${String(min / 60).padStart(2, '0')}:00`}
          </SvgText>
        ))}
        {/* Meal markers: dashed vertical line + numbered circle below the axis */}
        {meals.map((meal) => {
          const x = xOf(meal.minute);
          const cy = HEIGHT - PAD.bottom + 28;
          return (
            <G key={`m${meal.number}`} onPress={() => onSelectMeal(meal.number)}>
              <Line
                x1={x}
                y1={PAD.top}
                x2={x}
                y2={HEIGHT - PAD.bottom}
                stroke={meal.selected ? colors.warn : colors.dataSugar}
                strokeWidth={meal.selected ? 2 : 1}
                strokeDasharray="4 4"
                opacity={meal.selected ? 1 : 0.6}
              />
              {/* Larger invisible hit target */}
              <Circle cx={x} cy={cy} r={16} fill="transparent" />
              <Circle
                cx={x}
                cy={cy}
                r={11}
                fill={meal.selected ? colors.warn : colors.bgSurface}
                stroke={colors.warn}
                strokeWidth={2}
              />
              <SvgText
                x={x}
                y={cy + 4}
                fill={meal.selected ? colors.textOnAccent : colors.warn}
                fontSize={11}
                fontWeight="700"
                textAnchor="middle"
              >
                {meal.number}
              </SvgText>
            </G>
          );
        })}
        {/* Glucose curve (area + line per segment) */}
        {areaPaths.map((d, i) => (
          <Path key={`a${i}`} d={d} fill={colors.dataCarb} opacity={0.12} />
        ))}
        {linePaths.map((d, i) => (
          <Path key={`l${i}`} d={d} stroke={colors.accent} strokeWidth={2.5} fill="none" />
        ))}
        {/* Selected peak marker + tooltip */}
        {peak && (
          <G>
            <Circle cx={xOf(peak.minute)} cy={yOf(peak.mgdl)} r={4} fill={colors.accent} />
            <Tooltip
              x={xOf(peak.minute)}
              y={yOf(peak.mgdl)}
              text={peak.label}
              plotLeft={PAD.left}
              plotRight={PAD.left + plotW}
              colors={colors}
            />
          </G>
        )}
      </Svg>
    </View>
  );
}

/** Small dark rounded label above a point, clamped to the plot width. */
function Tooltip({
  x,
  y,
  text,
  plotLeft,
  plotRight,
  colors,
}: {
  x: number;
  y: number;
  text: string;
  plotLeft: number;
  plotRight: number;
  colors: Colors;
}) {
  const w = Math.max(90, text.length * 6.2 + 16);
  const h = 22;
  const cx = Math.min(Math.max(x, plotLeft + w / 2), plotRight - w / 2);
  const top = Math.max(0, y - h - 8);
  return (
    <G>
      <Rect x={cx - w / 2} y={top} width={w} height={h} rx={6} fill={colors.textPrimary} />
      <SvgText x={cx} y={top + 15} fill={colors.bgBase} fontSize={11} fontWeight="600" textAnchor="middle">
        {text}
      </SvgText>
    </G>
  );
}

/** SVG path string from a continuous segment. */
function toPath(seg: GlucosePoint[], xOf: (m: number) => number, yOf: (v: number) => number): string {
  return seg
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.minute).toFixed(1)} ${yOf(p.mgdl).toFixed(1)}`)
    .join(' ');
}

/** mmol gridline label; for mg/dL, round to a plain integer. */
function labelFor(mmol: number, unit: GlucoseUnit): string {
  if (unit === 'mmol') return String(mmol);
  return String(Math.round(mmol * 18.016));
}

/** Nice y-range in mmol/L covering the data and the target band, step 2. */
function yScale(segments: GlucosePoint[][]): { yLoMmol: number; yHiMmol: number; gridMmol: number[] } {
  let min = TARGET_LOW_MMOL;
  let max = TARGET_HIGH_MMOL;
  for (const seg of segments) {
    for (const p of seg) {
      const v = mgdlToMmol(p.mgdl);
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  const lo = Math.max(0, Math.floor((min - 0.5) / 2) * 2);
  const hi = Math.ceil((max + 0.5) / 2) * 2;
  const grid: number[] = [];
  for (let m = lo; m <= hi; m += 2) grid.push(m);
  return { yLoMmol: lo, yHiMmol: hi, gridMmol: grid };
}

const makeStyles = (_: Colors) =>
  StyleSheet.create({
    container: { paddingTop: spacing.sm },
  });
