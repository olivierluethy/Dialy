import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { ScreenTitle, Card, IconBubble } from '@/components/primitives';
import { Button } from '@/components/Button';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { useAppStore } from '@/state/store';
import { mealsRepo } from '@/db/repositories/meals';
import { sportsRepo } from '@/db/repositories/sports';
import { can, gateCopy } from '@/policy/gating';
import { dayKey, formatDayHeader, formatTime, formatCarbsWithBe } from '@/utils/format';
import type { MealEntry, SportEntry } from '@/types/models';

type FeedItem =
  | { kind: 'meal'; data: MealEntry }
  | { kind: 'sport'; data: SportEntry };

interface DayGroup {
  key: string;
  header: string;
  items: FeedItem[];
  carbTotal: number;
  mealCount: number;
  sportCount: number;
}

const ACTIVITY_LABEL: Record<string, string> = {
  wandern: 'Wandern',
  laufen: 'Laufen',
  rad: 'Rad',
  schwimmen: 'Schwimmen',
  kraft: 'Kraft',
};

export function TagebuchScreen() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const navigation = useNavigation<any>();
  const user = useAppStore((s) => s.user);
  const isPremium = useAppStore((s) => s.isPremium);
  const ctx = { isLoggedIn: user !== null, isPremium };

  const [groups, setGroups] = useState<DayGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      Promise.all([mealsRepo.listAll(), sportsRepo.listAll()]).then(
        ([meals, sports]) => {
          if (active) {
            setGroups(buildGroups(meals, sports));
            setLoading(false);
          }
        }
      );
      return () => {
        active = false;
      };
    }, [])
  );

  const goRegister = () => navigation.navigate('Login', { screen: 'Register' });

  return (
    <Screen>
      <ScreenTitle>Tagebuch</ScreenTitle>

      {/* Logged-out: account-gated locked state. */}
      {!can('saveDiaryEntry', ctx) ? (
        <Card style={styles.lockedCard}>
          <IconBubble name="lock-closed" color={colors.warn} bg={colors.bgSurfaceAlt} />
          <Text style={styles.lockedTitle}>Tagebuch gesperrt</Text>
          <Text style={styles.lockedText}>{gateCopy.diaryNeedsAccount}</Text>
          <Button
            title="Kostenlos registrieren"
            icon="person-add"
            onPress={goRegister}
            style={{ marginTop: spacing.lg }}
          />
        </Card>
      ) : (
        <>
          {/* Logged-in but not premium: nudge toward full diary (non-blocking). */}
          {!can('fullDiary', ctx) && (
            <Pressable
              style={styles.premiumBanner}
              onPress={() => navigation.navigate('Login', { screen: 'Paywall' })}
            >
              <Ionicons name="star" size={18} color={colors.accent} />
              <Text style={styles.premiumText}>{gateCopy.diaryNeedsPremium}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </Pressable>
          )}

          {loading ? (
            <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xl }} />
          ) : groups.length === 0 ? (
            <Text style={styles.empty}>
              Noch keine Einträge. Füge im KH-Rechner oder im Sport-Planer etwas hinzu.
            </Text>
          ) : (
            groups.map((g) => (
              <View key={g.key} style={styles.dayBlock}>
                <Text style={styles.dayHeader}>{g.header}</Text>
                <Card>
                  {g.items.map((item, idx) => (
                    <FeedRow
                      key={item.data.id}
                      item={item}
                      last={idx === g.items.length - 1}
                    />
                  ))}
                </Card>
                {/* Daily summary chips */}
                <View style={styles.summaryRow}>
                  <SummaryChip label="KH total" value={`${Math.round(g.carbTotal)} g`} />
                  <SummaryChip label="Mahlzeiten" value={`${g.mealCount}`} />
                  <SummaryChip label="Sport" value={`${g.sportCount}×`} />
                </View>
              </View>
            ))
          )}
        </>
      )}
    </Screen>
  );
}

function FeedRow({ item, last }: { item: FeedItem; last: boolean }) {
  const styles = useThemedStyles(makeStyles);
  const time = formatTime(item.data.logged_at);
  if (item.kind === 'meal') {
    const m = item.data;
    return (
      <View style={[styles.row, !last && styles.rowBorder]}>
        <Text style={styles.time}>{time}</Text>
        <IconBubble name="restaurant" size={18} />
        <View style={styles.rowBody}>
          <Text style={styles.rowTitle}>{m.name}</Text>
          <Text style={styles.rowMeta}>{formatCarbsWithBe(m.carbs_g)}</Text>
          {m.photo_uri && <Text style={styles.rowSub}>Foto gespeichert</Text>}
        </View>
      </View>
    );
  }
  const s = item.data;
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.time}>{time}</Text>
      <IconBubble name="walk" size={18} />
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle}>
          {ACTIVITY_LABEL[s.activity] ?? s.activity} · {s.duration_min} min
        </Text>
        <Text style={styles.rowSub}>BZ-Verlauf gespeichert</Text>
      </View>
    </View>
  );
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.chip}>
      <Text style={styles.chipValue}>{value}</Text>
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
  );
}

/** Merge meals + sports, sort newest first, group by local day. */
function buildGroups(meals: MealEntry[], sports: SportEntry[]): DayGroup[] {
  const items: FeedItem[] = [
    ...meals.map((m) => ({ kind: 'meal' as const, data: m })),
    ...sports.map((s) => ({ kind: 'sport' as const, data: s })),
  ];
  items.sort((a, b) => b.data.logged_at.localeCompare(a.data.logged_at));

  const map = new Map<string, DayGroup>();
  for (const item of items) {
    const key = dayKey(item.data.logged_at);
    let g = map.get(key);
    if (!g) {
      g = {
        key,
        header: formatDayHeader(item.data.logged_at),
        items: [],
        carbTotal: 0,
        mealCount: 0,
        sportCount: 0,
      };
      map.set(key, g);
    }
    g.items.push(item);
    if (item.kind === 'meal') {
      g.carbTotal += item.data.carbs_g;
      g.mealCount += 1;
    } else {
      g.sportCount += 1;
    }
  }
  return Array.from(map.values());
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    lockedCard: { alignItems: 'center', marginTop: spacing.lg },
    lockedTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
      marginTop: spacing.md,
    },
    lockedText: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.sm,
      lineHeight: 21,
    },
    premiumBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.accentSubtle,
      borderRadius: radius.card,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    premiumText: { flex: 1, color: colors.textSecondary, fontSize: 13, marginHorizontal: spacing.sm },
    empty: { color: colors.textTertiary, fontSize: 15, marginTop: spacing.lg, lineHeight: 22 },
    dayBlock: { marginBottom: spacing.xl },
    dayHeader: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1,
      color: colors.textTertiary,
      marginBottom: spacing.sm,
    },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
    time: { width: 44, fontSize: 13, color: colors.textTertiary },
    rowBody: { flex: 1, marginLeft: spacing.md },
    rowTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    rowMeta: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
    rowSub: { fontSize: 13, color: colors.textTertiary, marginTop: 2 },
    summaryRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
    chip: {
      flex: 1,
      backgroundColor: colors.bgSurfaceAlt,
      borderRadius: radius.card,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: spacing.md,
      alignItems: 'center',
    },
    chipValue: { fontSize: 18, fontWeight: '700', color: colors.accent },
    chipLabel: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },
  });
