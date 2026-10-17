import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { ScreenTitle, Card, SectionLabel, IconBubble } from '@/components/primitives';
import { Button } from '@/components/Button';
import { GlucoseChart, type ChartMeal, type ChartPeak } from '@/components/GlucoseChart';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { useAppStore } from '@/state/store';
import { mealsRepo } from '@/db/repositories/meals';
import { glucoseRepo } from '@/db/repositories/glucose';
import { can } from '@/policy/gating';
import { useLanguage, useT, type Dict } from '@/i18n';
import { dayKey, formatTime } from '@/utils/format';
import {
  formatGlucoseValue,
  formatGlucoseDelta,
  unitLabel,
  TARGET_HIGH_MGDL,
} from '@/utils/glucose';
import {
  dayPoints,
  segmentize,
  mealImpact,
  minuteOfDay,
  type GlucosePoint,
} from '@/services/glucoseStats';
import type { GlucoseReading, MealEntry } from '@/types/models';

/** A meal of the day with its computed glucose impact and running number. */
interface MealRow {
  number: number;
  meal: MealEntry;
  peakMgdl: number | null;
  peakTimestamp: string | null;
  riseMgdl: number | null;
}

const MS_DAY = 24 * 60 * 60 * 1000;

export function BlutzuckerScreen() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  const language = useLanguage();
  const navigation = useNavigation<any>();
  const user = useAppStore((s) => s.user);
  const isPremium = useAppStore((s) => s.isPremium);
  const unit = useAppStore((s) => s.glucoseUnit);
  const dataRevision = useAppStore((s) => s.dataRevision);
  const ctx = { isLoggedIn: user !== null, isPremium };
  const userId = user?.id ?? null;
  const unlocked = can('fullDiary', ctx);

  const [day, setDay] = useState<Date>(() => new Date());
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [readings, setReadings] = useState<GlucoseReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [hasAnyData, setHasAnyData] = useState(true);

  const key = dayKey(day.toISOString());

  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (!userId) {
        setMeals([]);
        setReadings([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
      const end = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);
      Promise.all([
        mealsRepo.listAll(userId),
        glucoseRepo.listBetween(userId, start.toISOString(), end.toISOString()),
        glucoseRepo.counts(userId),
      ]).then(([allMeals, dayReadings, counts]) => {
        if (!active) return;
        setMeals(allMeals.filter((m) => dayKey(m.logged_at) === key));
        setReadings(dayReadings);
        setHasAnyData(Object.values(counts).some((n) => n > 0));
        setSelected(null);
        setLoading(false);
      });
      return () => {
        active = false;
      };
    }, [userId, key, dataRevision])
  );

  const points: GlucosePoint[] = useMemo(() => dayPoints(readings, key), [readings, key]);
  const segments = useMemo(() => segmentize(points), [points]);

  const mealRows: MealRow[] = useMemo(() => {
    const sorted = [...meals].sort((a, b) => a.logged_at.localeCompare(b.logged_at));
    return sorted.map((meal, i) => {
      const impact = mealImpact(meal, points);
      return {
        number: i + 1,
        meal,
        peakMgdl: impact.peakMgdl,
        peakTimestamp: impact.peakTimestamp,
        riseMgdl: impact.riseMgdl,
      };
    });
  }, [meals, points]);

  const totalCarbs = useMemo(() => mealRows.reduce((s, r) => s + r.meal.carbs_g, 0), [mealRows]);

  const chartMeals: ChartMeal[] = mealRows.map((r) => ({
    number: r.number,
    minute: minuteOfDay(r.meal.logged_at),
    selected: r.number === selected,
  }));

  const peak: ChartPeak | null = useMemo(() => {
    const row = mealRows.find((r) => r.number === selected);
    if (!row || row.peakMgdl === null || row.peakTimestamp === null) return null;
    return {
      minute: minuteOfDay(row.peakTimestamp),
      mgdl: row.peakMgdl,
      label: t.blutzucker.peakTooltip(formatGlucoseValue(row.peakMgdl, unit), formatTime(row.peakTimestamp)),
    };
  }, [mealRows, selected, unit, t]);

  const shiftDay = (deltaDays: number) => {
    setDay((d) => new Date(d.getTime() + deltaDays * MS_DAY));
    setSelected(null);
  };
  const isToday = key === dayKey(new Date().toISOString());
  const toggleMeal = (n: number) => setSelected((cur) => (cur === n ? null : n));

  // Provider delay: today, if the newest reading is clearly behind "now".
  const showDelayHint = useMemo(() => {
    if (!isToday || points.length === 0) return false;
    const lastMin = points[points.length - 1]!.minute;
    const nowMin = minuteOfDay(new Date().toISOString());
    return nowMin - lastMin > 180;
  }, [isToday, points]);

  if (!unlocked) {
    return (
      <Screen>
        <GlucoseHeader title={t.blutzucker.title} />
        <LockedCard />
      </Screen>
    );
  }

  return (
    <Screen>
      <GlucoseHeader title={t.blutzucker.title} />

      {/* Day navigation */}
      <View style={styles.dayNav}>
        <Pressable onPress={() => shiftDay(-1)} hitSlop={8} style={styles.navBtn} accessibilityLabel={t.blutzucker.prevDay}>
          <Icon name="chevronLeft" size={22} color={colors.textPrimary} />
        </Pressable>
        <Pressable onPress={() => setDay(new Date())} style={styles.dayLabelWrap}>
          <Text style={styles.dayLabel}>{dayHeader(day, t)}</Text>
          {!isToday && <Text style={styles.todayHint}>{t.blutzucker.backToToday}</Text>}
        </Pressable>
        <Pressable
          onPress={() => shiftDay(1)}
          hitSlop={8}
          style={[styles.navBtn, isToday && styles.navBtnDisabled]}
          disabled={isToday}
          accessibilityLabel={t.blutzucker.nextDay}
        >
          <Icon name="chevronRight" size={22} color={isToday ? colors.textTertiary : colors.textPrimary} />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xl }} />
      ) : !hasAnyData ? (
        <EmptyImport onImport={() => navigation.navigate('Login', { screen: 'GlucoseImport' })} />
      ) : (
        <>
          {showDelayHint && (
            <View style={styles.hintRow}>
              <Icon name="time" size={16} color={colors.textTertiary} />
              <Text style={styles.hintText}>{t.blutzucker.delayHint}</Text>
            </View>
          )}

          {/* Chart */}
          <Card style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>{t.blutzucker.chartTitle}</Text>
              <View style={styles.legend}>
                <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
                <Text style={styles.legendText}>{t.blutzucker.legendGlucose(unitLabel(unit))}</Text>
                <View style={[styles.legendBand, { backgroundColor: colors.accent }]} />
                <Text style={styles.legendText}>{t.blutzucker.legendTarget}</Text>
              </View>
            </View>
            {points.length === 0 ? (
              <Text style={styles.noDayData}>{t.blutzucker.noReadingsDay}</Text>
            ) : (
              <GlucoseChart
                segments={segments}
                meals={chartMeals}
                peak={peak}
                unit={unit}
                onSelectMeal={toggleMeal}
              />
            )}
          </Card>

          {/* Meal table */}
          <View style={styles.tableHeaderRow}>
            <SectionLabel>{t.blutzucker.mealsTitle}</SectionLabel>
            <Text style={styles.totalCarbs}>{t.blutzucker.totalCarbs(Math.round(totalCarbs))}</Text>
          </View>
          {mealRows.length === 0 ? (
            <Text style={styles.noMeals}>{t.blutzucker.noMeals}</Text>
          ) : (
            <Card style={styles.tableCard}>
              {mealRows.map((row, idx) => (
                <Pressable
                  key={row.meal.id}
                  onPress={() => toggleMeal(row.number)}
                  style={[
                    styles.mealRow,
                    idx < mealRows.length - 1 && styles.mealRowBorder,
                    row.number === selected && styles.mealRowSelected,
                  ]}
                >
                  <View style={[styles.numBadge, row.number === selected && styles.numBadgeSelected]}>
                    <Text style={[styles.numText, row.number === selected && styles.numTextSelected]}>
                      {row.number}
                    </Text>
                  </View>
                  <View style={styles.mealMain}>
                    <Text style={styles.mealName} numberOfLines={1}>{row.meal.name}</Text>
                    <Text style={styles.mealTime}>{formatTime(row.meal.logged_at)}</Text>
                  </View>
                  <View style={styles.mealStats}>
                    <Text style={styles.mealCarbs}>{Math.round(row.meal.carbs_g)} g</Text>
                    <View style={styles.mealImpactRow}>
                      <Text
                        style={[
                          styles.mealPeak,
                          row.peakMgdl !== null && row.peakMgdl > TARGET_HIGH_MGDL && styles.mealPeakHigh,
                        ]}
                      >
                        {row.peakMgdl === null ? '–' : formatGlucoseValue(row.peakMgdl, unit)}
                      </Text>
                      <Text style={styles.mealRise}>
                        {row.riseMgdl === null ? '' : formatGlucoseDelta(row.riseMgdl, unit)}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </Card>
          )}

          <Text style={styles.footnote}>{t.blutzucker.footnote(unitLabel(unit))}</Text>
          <Text style={styles.disclaimer}>
            <Icon name="alert" size={12} color={colors.warn} /> {t.blutzucker.disclaimer}
          </Text>

          <Button
            title={t.blutzucker.manageData}
            icon="settings"
            variant="secondary"
            onPress={() => navigation.navigate('Login', { screen: 'GlucoseImport' })}
            style={styles.manageBtn}
          />
        </>
      )}
    </Screen>
  );
}

function GlucoseHeader({ title }: { title: string }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.titleRow}>
      <SectionLabel>{title.toUpperCase()}</SectionLabel>
    </View>
  );
}

function EmptyImport({ onImport }: { onImport: () => void }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  return (
    <Card style={styles.emptyCard}>
      <IconBubble name="glucose" color={colors.accent} />
      <Text style={styles.emptyTitle}>{t.blutzucker.emptyTitle}</Text>
      <Text style={styles.emptyText}>{t.blutzucker.emptyText}</Text>
      <Button title={t.blutzucker.importCta} icon="upload" onPress={onImport} style={styles.emptyBtn} />
    </Card>
  );
}

function LockedCard() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  const navigation = useNavigation<any>();
  const user = useAppStore((s) => s.user);
  return (
    <Card style={styles.emptyCard}>
      <IconBubble name="lock" color={colors.warn} bg={colors.bgSurfaceAlt} />
      <Text style={styles.emptyTitle}>{t.blutzucker.locked}</Text>
      <Text style={styles.emptyText}>{user === null ? t.gate.diaryNeedsAccount : t.gate.diaryNeedsPremium}</Text>
      <Button
        title={user === null ? t.login.signIn : t.account.viewPremium}
        icon={user === null ? 'login' : 'premium'}
        onPress={() =>
          user === null
            ? navigation.navigate('Login', { screen: 'LoginHome' })
            : navigation.navigate('Login', { screen: 'Paywall' })
        }
        style={styles.emptyBtn}
      />
    </Card>
  );
}

/** "Samstag, 17. Oktober 2026" for a Date, in the current language. */
function dayHeader(d: Date, t: Dict): string {
  return t.date.withWeekday(
    t.date.weekdays[d.getDay()]!,
    d.getDate(),
    t.date.months[d.getMonth()]!,
    d.getFullYear()
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    titleRow: { marginBottom: spacing.sm },
    dayNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
    navBtn: {
      width: 40,
      height: 40,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.bgSurfaceAlt,
    },
    navBtnDisabled: { opacity: 0.4 },
    dayLabelWrap: { flex: 1, alignItems: 'center' },
    dayLabel: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
    todayHint: { fontSize: 12, color: colors.accent, marginTop: 2 },

    hintRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.md },
    hintText: { flex: 1, fontSize: 12, color: colors.textTertiary, lineHeight: 16 },

    chartCard: { marginTop: spacing.lg, paddingHorizontal: spacing.lg },
    chartHeader: { marginBottom: spacing.sm },
    chartTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
    legend: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.sm },
    legendDot: { width: 14, height: 3, borderRadius: 2 },
    legendBand: { width: 12, height: 12, borderRadius: 3, opacity: 0.3, marginLeft: spacing.sm },
    legendText: { fontSize: 11, color: colors.textTertiary },
    noDayData: { fontSize: 14, color: colors.textTertiary, textAlign: 'center', paddingVertical: spacing.xl },

    tableHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xl },
    totalCarbs: { fontSize: 12, color: colors.textTertiary },
    noMeals: { fontSize: 14, color: colors.textTertiary, marginTop: spacing.sm },
    tableCard: { paddingVertical: 0, paddingHorizontal: 0, overflow: 'hidden', marginTop: spacing.sm },
    mealRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
    mealRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
    mealRowSelected: { backgroundColor: colors.bgSurfaceAlt },
    numBadge: {
      width: 26, height: 26, borderRadius: radius.pill, borderWidth: 2, borderColor: colors.warn,
      alignItems: 'center', justifyContent: 'center',
    },
    numBadgeSelected: { backgroundColor: colors.warn },
    numText: { fontSize: 12, fontWeight: '700', color: colors.warn },
    numTextSelected: { color: colors.textOnAccent },
    mealMain: { flex: 1, marginLeft: spacing.md },
    mealName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
    mealTime: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },
    mealStats: { alignItems: 'flex-end' },
    mealCarbs: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
    mealImpactRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginTop: 2 },
    mealPeak: { fontSize: 13, color: colors.textSecondary },
    mealPeakHigh: { color: colors.warn, fontWeight: '700' },
    mealRise: { fontSize: 12, color: colors.textTertiary },

    footnote: { fontSize: 12, color: colors.textTertiary, lineHeight: 17, marginTop: spacing.lg },
    disclaimer: { fontSize: 12, color: colors.warn, lineHeight: 17, marginTop: spacing.sm },
    manageBtn: { marginTop: spacing.xl },

    emptyCard: { alignItems: 'center', marginTop: spacing.lg },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.md },
    emptyText: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, lineHeight: 21 },
    emptyBtn: { alignSelf: 'stretch', marginTop: spacing.lg },
  });
