import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { ScreenTitle, Card, IconBubble } from '@/components/primitives';
import { FadeIn, staggerDelay } from '@/components/FadeIn';
import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import { TextField } from '@/components/TextField';
import { SelectableChip } from '@/components/Chip';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { useAppStore } from '@/state/store';
import { mealsRepo } from '@/db/repositories/meals';
import { sportsRepo } from '@/db/repositories/sports';
import type { EntryChanges } from '@/db/repositories/base';
import { foodsRepo } from '@/db/repositories/foods';
import { can } from '@/policy/gating';
import { useLanguage, useT, type Dict } from '@/i18n';
import {
  dayKey,
  formatCarbs,
  formatDateInput,
  formatDayHeader,
  formatTime,
  parseLocalDateTime,
} from '@/utils/format';
import type { MealEntry, SportEntry } from '@/types/models';

type FeedItem =
  | { kind: 'meal'; data: MealEntry }
  | { kind: 'sport'; data: SportEntry };

interface DayGroup {
  key: string;
  header: string;
  items: FeedItem[];
  carbTotal: number;
}

/** Stable key of a feed item across both entry tables. */
const itemKey = (item: FeedItem): string => `${item.kind}:${item.data.id}`;

const itemTitle = (item: FeedItem, t: Dict): string =>
  item.kind === 'meal'
    ? item.data.name
    : `${t.activities[item.data.activity] ?? item.data.activity} · ${item.data.duration_min} ${t.units.minutes}`;

/**
 * Meals with the food's name in the UI language. An entry keeps the name it
 * was logged with, which may be another language (or a food since removed).
 */
async function withLocalizedNames(meals: MealEntry[]): Promise<MealEntry[]> {
  const ids = meals.flatMap((m) => (m.food_id ? [m.food_id] : []));
  const names = await foodsRepo.namesFor(ids);
  return meals.map((m) => {
    const name = m.food_id ? names.get(m.food_id) : undefined;
    return name && name !== m.name ? { ...m, name } : m;
  });
}

export function TagebuchScreen() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  // Day headers and food names depend on the language: reload on a change.
  const language = useLanguage();
  const navigation = useNavigation<any>();
  const user = useAppStore((s) => s.user);
  const isPremium = useAppStore((s) => s.isPremium);
  const ctx = { isLoggedIn: user !== null, isPremium };
  const userId = user?.id ?? null;
  // Changes pulled in by a sync (e.g. from another device) reload the list.
  const dataRevision = useAppStore((s) => s.dataRevision);

  const [groups, setGroups] = useState<DayGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadTick, setReloadTick] = useState(0);

  // Selection mode: tap marks entries, the bar changes date/time of all.
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  // Entries being edited: date/time of one or several, comment of one.
  const [editKeys, setEditKeys] = useState<string[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (!userId) {
        setGroups([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      Promise.all([
        mealsRepo.listAll(userId).then(withLocalizedNames),
        sportsRepo.listAll(userId),
      ]).then(
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
    }, [userId, reloadTick, dataRevision, language])
  );

  const itemsByKey = useMemo(() => {
    const map = new Map<string, FeedItem>();
    for (const g of groups) for (const item of g.items) map.set(itemKey(item), item);
    return map;
  }, [groups]);

  const exitSelection = () => {
    setSelecting(false);
    setSelected(new Set());
  };

  const toggle = (key: string) =>
    setSelected((cur) => {
      const next = new Set(cur);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const onRowPress = (item: FeedItem) => {
    if (selecting) toggle(itemKey(item));
    else setEditKeys([itemKey(item)]);
  };

  const onRowLongPress = (item: FeedItem) => {
    setSelecting(true);
    setSelected((cur) => new Set(cur).add(itemKey(item)));
  };

  const saveEntry = async (changes: EntryChanges) => {
    if (!userId || !editKeys) return;
    const ids = (kind: FeedItem['kind']) =>
      editKeys.filter((k) => k.startsWith(`${kind}:`)).map((k) => k.slice(kind.length + 1));
    // One after the other: both use a DB transaction.
    await mealsRepo.update(ids('meal'), userId, changes);
    await sportsRepo.update(ids('sport'), userId, changes);
    setEditKeys(null);
    exitSelection();
    setReloadTick((n) => n + 1);
  };

  const goLogin = () => navigation.navigate('Login', { screen: 'LoginHome' });
  const goRegister = () => navigation.navigate('Login', { screen: 'Register' });
  const unlocked = can('saveDiaryEntry', ctx);
  const firstEdited = editKeys?.[0] ? itemsByKey.get(editKeys[0]) : undefined;

  return (
    <Screen>
      <View style={styles.titleRow}>
        <ScreenTitle style={styles.title}>{t.tagebuch.title}</ScreenTitle>
        {unlocked && groups.length > 0 && (
          <Pressable
            onPress={() => (selecting ? exitSelection() : setSelecting(true))}
            accessibilityRole="button"
            hitSlop={8}
          >
            <Text style={styles.titleAction}>{selecting ? t.tagebuch.done : t.tagebuch.select}</Text>
          </Pressable>
        )}
      </View>

      {/* Logged-out: account-gated locked state. */}
      {!unlocked ? (
        <Card style={styles.lockedCard}>
          <IconBubble name="lock-closed" color={colors.warn} bg={colors.bgSurfaceAlt} />
          <Text style={styles.lockedTitle}>{t.tagebuch.locked}</Text>
          <Text style={styles.lockedText}>{t.gate.diaryNeedsAccount}</Text>
          <Button
            title={t.login.signIn}
            icon="log-in-outline"
            onPress={goLogin}
            style={styles.lockedButton}
          />
          <Button
            title={t.login.createAccount}
            icon="person-add"
            variant="secondary"
            onPress={goRegister}
            style={styles.lockedButtonSecondary}
          />
        </Card>
      ) : (
        <>
          {/* Logged-in but not premium: nudge toward full diary (non-blocking). */}
          {!can('fullDiary', ctx) && !selecting && (
            <Pressable
              style={styles.premiumBanner}
              onPress={() => navigation.navigate('Login', { screen: 'Paywall' })}
            >
              <Ionicons name="star" size={18} color={colors.accent} />
              <Text style={styles.premiumText}>{t.gate.diaryNeedsPremium}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </Pressable>
          )}

          {selecting && (
            <Card style={styles.selectBar}>
              <Text style={styles.selectCount}>
                {selected.size === 0
                  ? t.tagebuch.tapToMark
                  : t.tagebuch.selectedCount(selected.size)}
              </Text>
              <Button
                title={t.tagebuch.changeDateTime}
                icon="time-outline"
                onPress={() => setEditKeys([...selected])}
                disabled={selected.size === 0}
                style={styles.selectButton}
              />
            </Card>
          )}

          {loading ? (
            <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xl }} />
          ) : groups.length === 0 ? (
            <Text style={styles.empty}>{t.tagebuch.empty}</Text>
          ) : (
            groups.map((g, i) => (
              <FadeIn key={g.key} delay={staggerDelay(i)} style={styles.dayBlock}>
                <Text style={styles.dayHeader}>{g.header}</Text>
                <Card style={styles.dayCard}>
                  {g.items.map((item, idx) => (
                    <FeedRow
                      key={item.data.id}
                      item={item}
                      last={idx === g.items.length - 1}
                      selecting={selecting}
                      selected={selected.has(itemKey(item))}
                      onPress={() => onRowPress(item)}
                      onLongPress={() => onRowLongPress(item)}
                    />
                  ))}
                </Card>
                {/* Daily summary chips */}
                <View style={styles.summaryRow}>
                  <SummaryChip label={t.tagebuch.carbTotal} value={`${Math.round(g.carbTotal)} g`} />
                </View>
              </FadeIn>
            ))
          )}
        </>
      )}

      <EditEntryDialog
        visible={editKeys !== null}
        multiple={(editKeys?.length ?? 0) > 1}
        subtitle={
          editKeys && editKeys.length > 1
            ? t.tagebuch.sameDateTime(editKeys.length)
            : firstEdited
              ? itemTitle(firstEdited, t)
              : ''
        }
        initialIso={firstEdited?.data.logged_at ?? new Date().toISOString()}
        initialNote={firstEdited?.data.note ?? ''}
        onCancel={() => setEditKeys(null)}
        onSave={saveEntry}
      />
    </Screen>
  );
}

function FeedRow({
  item,
  last,
  selecting,
  selected,
  onPress,
  onLongPress,
}: {
  item: FeedItem;
  last: boolean;
  selecting: boolean;
  selected: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  const time = formatTime(item.data.logged_at);
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
      style={({ pressed }) => [
        styles.row,
        !last && styles.rowBorder,
        selected && styles.rowSelected,
        pressed && styles.rowPressed,
      ]}
      accessibilityRole="button"
      accessibilityState={selecting ? { selected } : undefined}
      accessibilityHint={selecting ? t.tagebuch.markHint : t.tagebuch.editHint}
    >
      {selecting && (
        <Ionicons
          name={selected ? 'checkmark-circle' : 'ellipse-outline'}
          size={22}
          color={selected ? colors.accent : colors.textTertiary}
          style={styles.check}
        />
      )}
      <Text style={styles.time}>{time}</Text>
      <IconBubble name={item.kind === 'meal' ? 'restaurant' : 'walk'} size={18} />
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle}>{itemTitle(item, t)}</Text>
        {item.kind === 'meal' ? (
          <Text style={styles.rowMeta}>{formatCarbs(item.data.carbs_g)}</Text>
        ) : (
          <Text style={styles.rowSub}>{t.tagebuch.bgCurveSaved}</Text>
        )}
        {item.data.note ? (
          <Text style={styles.rowNote} numberOfLines={3}>
            {item.data.note}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const NOTE_MAX = 500;

/**
 * Popup to edit an entry: date + time and a comment. With several entries
 * selected only date + time (they all get the same); comments are per entry.
 */
function EditEntryDialog({
  visible,
  multiple,
  subtitle,
  initialIso,
  initialNote,
  onCancel,
  onSave,
}: {
  visible: boolean;
  multiple: boolean;
  subtitle: string;
  initialIso: string;
  initialNote: string;
  onCancel: () => void;
  onSave: (changes: EntryChanges) => Promise<void>;
}) {
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Prefill each time the dialog opens.
  useEffect(() => {
    if (!visible) return;
    setDate(formatDateInput(initialIso));
    setTime(formatTime(initialIso));
    setNote(initialNote);
    setError(null);
  }, [visible, initialIso, initialNote]);

  const shiftDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    setDate(formatDateInput(d.toISOString()));
  };

  const save = async () => {
    const loggedAt = parseLocalDateTime(date, time);
    if (!loggedAt) {
      setError(t.tagebuch.invalidDateTime);
      return;
    }
    if (multiple) {
      await onSave({ logged_at: loggedAt });
    } else {
      const trimmed = note.trim();
      await onSave({ logged_at: loggedAt, note: trimmed ? trimmed : null });
    }
  };

  return (
    <Dialog
      visible={visible}
      title={multiple ? t.tagebuch.editDateTimeTitle : t.tagebuch.editEntryTitle}
      message={subtitle}
      onClose={onCancel}
      actions={[
        { label: t.common.cancel, onPress: onCancel },
        { label: t.common.save, variant: 'primary', onPress: save },
      ]}
    >
      <View style={styles.editFields}>
        <TextField
          label={t.tagebuch.date}
          value={date}
          onChangeText={(v) => {
            setDate(v);
            setError(null);
          }}
          placeholder={t.date.datePlaceholder}
          keyboardType="numbers-and-punctuation"
          containerStyle={styles.dateField}
        />
        <TextField
          label={t.tagebuch.time}
          value={time}
          onChangeText={(v) => {
            setTime(v);
            setError(null);
          }}
          placeholder={t.date.timePlaceholder}
          keyboardType="numbers-and-punctuation"
          containerStyle={styles.timeField}
        />
      </View>
      <View style={styles.quickRow}>
        <SelectableChip label={t.tagebuch.today} selected={false} onPress={() => shiftDays(0)} />
        <SelectableChip label={t.tagebuch.yesterday} selected={false} onPress={() => shiftDays(1)} />
      </View>
      {error && <Text style={styles.editError}>{error}</Text>}
      {!multiple && (
        <TextField
          label={t.tagebuch.comment}
          value={note}
          onChangeText={setNote}
          placeholder={t.tagebuch.commentPlaceholder}
          multiline
          maxLength={NOTE_MAX}
          style={styles.noteInput}
          containerStyle={styles.noteField}
        />
      )}
    </Dialog>
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
      };
      map.set(key, g);
    }
    g.items.push(item);
    if (item.kind === 'meal') g.carbTotal += item.data.carbs_g;
  }
  return Array.from(map.values());
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    title: { marginBottom: 0 },
    titleAction: { fontSize: 16, fontWeight: '600', color: colors.accent },
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
    lockedButton: { alignSelf: 'stretch', marginTop: spacing.lg },
    lockedButtonSecondary: { alignSelf: 'stretch', marginTop: spacing.sm },
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
    selectBar: { marginBottom: spacing.lg },
    selectCount: { fontSize: 15, color: colors.textSecondary },
    selectButton: { marginTop: spacing.md },
    empty: { color: colors.textTertiary, fontSize: 15, marginTop: spacing.lg, lineHeight: 22 },
    dayBlock: { marginBottom: spacing.xl },
    dayHeader: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1,
      color: colors.textTertiary,
      marginBottom: spacing.sm,
    },
    // Rows bleed to the card edge so the selection highlight fills it.
    dayCard: { paddingVertical: 0, paddingHorizontal: 0, overflow: 'hidden' },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
    rowSelected: { backgroundColor: colors.accentSubtle },
    rowPressed: { backgroundColor: colors.bgSurfaceAlt },
    check: { marginRight: spacing.sm },
    time: { width: 44, fontSize: 13, color: colors.textTertiary },
    rowBody: { flex: 1, marginLeft: spacing.md },
    rowTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    rowMeta: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
    rowSub: { fontSize: 13, color: colors.textTertiary, marginTop: 2 },
    rowNote: { fontSize: 13, color: colors.textSecondary, fontStyle: 'italic', marginTop: 4 },
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
    editFields: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
    dateField: { flex: 3, marginBottom: 0 },
    timeField: { flex: 2, marginBottom: 0 },
    quickRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
    editError: { color: colors.danger, fontSize: 14, marginTop: spacing.md },
    noteField: { marginTop: spacing.lg, marginBottom: 0 },
    noteInput: { minHeight: 80, paddingTop: spacing.md, textAlignVertical: 'top' },
  });
