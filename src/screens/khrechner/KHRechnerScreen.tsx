import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { ScreenTitle, SectionLabel, Card } from '@/components/primitives';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { SelectableChip } from '@/components/Chip';
import { NutrientBar } from '@/components/NutrientBar';
import { Dialog } from '@/components/Dialog';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { foodsRepo } from '@/db/repositories/foods';
import { mealsRepo } from '@/db/repositories/meals';
import { useAppStore } from '@/state/store';
import { can, gateCopy } from '@/policy/gating';
import { carbsToBe, formatCarbs } from '@/utils/format';
import { nowIso, uuidv4 } from '@/utils/id';
import type { Food } from '@/types/models';

// Reference maxima used only to scale the visual nutrient bars.
const BAR_MAX = { carbs: 80, sugar: 50, gi: 100, fat: 40 };
const MAX_GRAMS = 500;

/** A food + chosen portion collected into the meal being built. */
interface MealItem {
  key: string;
  food: Food;
  grams: number;
}

type DialogState =
  | null
  | { kind: 'account' }
  | { kind: 'meal' }
  | { kind: 'saved'; count: number }
  | { kind: 'error' };

// GI is a property of the food, not scaled by portion.
function portionNutrients(food: Food, grams: number) {
  const f = grams / 100;
  return {
    carbs: food.carbs_per_100g * f,
    sugar: food.sugar_per_100g * f,
    fat: food.fat_per_100g * f,
    gi: food.glycemic_index,
  };
}

export function KHRechnerScreen() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Food | null>(null);
  const [grams, setGrams] = useState(0);
  const [meal, setMeal] = useState<MealItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [dialog, setDialog] = useState<DialogState>(null);

  // ── Slider performance (issue #1) ──────────────────────────────────────────
  // The Slider fires onValueChange at a very high rate while dragging. Committing
  // every raw event to state re-rendered the whole screen (search list + card +
  // four nutrient bars) on every pixel and fed the controlled `value`
  // back into the native slider each time — which is what made it stutter and
  // feel "verbuggt". We now:
  //   1. coalesce drag events to at most one state update per animation frame, and
  //   2. drive the slider's `value` from its own state that only changes when
  //      grams is set from OUTSIDE the drag (preset chip, gram field, food
  //      select) or when the drag ends. Feeding `grams` back in mid-drag made the
  //      thumb snap to a stale (frame-throttled) value, which fired another
  //      onValueChange — a feedback loop that froze the app on fast back-and-forth
  //      dragging.
  const [sliderValue, setSliderValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const pendingGramsRef = useRef(0);

  // Cancel any in-flight slider frame if the screen unmounts mid-drag.
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Set grams from a source other than the slider drag, and move the slider
  // thumb to the new position.
  const setGramsExternal = (n: number) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setGrams(n);
    setSliderValue(n);
  };

  const navigation = useNavigation<any>();
  const user = useAppStore((s) => s.user);
  const isPremium = useAppStore((s) => s.isPremium);
  const ctx = { isLoggedIn: user !== null, isPremium };

  useEffect(() => {
    let active = true;
    setLoading(true);
    foodsRepo.search(query).then((rows) => {
      if (active) {
        setResults(rows);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [query]);

  const selectFood = (food: Food) => {
    setSelected(food);
    // Default to the first preset portion, or 100 g.
    setGramsExternal(food.portions[0]?.grams ?? 100);
  };

  // Live nutrient math for the food currently being edited.
  const nutrients = useMemo(
    () => (selected ? portionNutrients(selected, grams) : null),
    [selected, grams]
  );

  // Running carb total of everything collected into the meal so far.
  const mealCarbs = useMemo(
    () => meal.reduce((sum, i) => sum + portionNutrients(i.food, i.grams).carbs, 0),
    [meal]
  );

  // Collect the current food + portion into the meal, then clear the editor
  // so the next food can be searched.
  const addToMeal = () => {
    if (!selected || grams <= 0) return;
    setMeal((m) => [...m, { key: uuidv4(), food: selected, grams }]);
    setSelected(null);
  };

  const clearMeal = () => setMeal([]);

  const canSaveDiary = can('saveDiaryEntry', ctx);

  // Write every collected food (with its portion) to the diary as one meal:
  // all entries share the same timestamp.
  const saveMeal = async () => {
    if (!canSaveDiary) {
      setDialog({ kind: 'account' });
      return;
    }
    if (meal.length === 0 || saving) return;
    setSaving(true);
    const loggedAt = nowIso();
    let savedCount = 0;
    try {
      for (const item of meal) {
        const n = portionNutrients(item.food, item.grams);
        await mealsRepo.create(
          {
            food_id: item.food.id,
            name: item.food.name,
            grams: item.grams,
            carbs_g: n.carbs,
            sugar_g: n.sugar,
            fat_g: n.fat,
            glycemic_index: n.gi,
            be: carbsToBe(n.carbs),
            photo_uri: null,
            logged_at: loggedAt,
          },
          user?.id ?? null
        );
        savedCount += 1;
      }
      setMeal([]);
      setDialog({ kind: 'saved', count: savedCount });
    } catch {
      // Keep only what wasn't saved, so a retry doesn't create duplicates.
      setMeal((m) => m.slice(savedCount));
      setDialog({ kind: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const goRegister = () => navigation.navigate('Login', { screen: 'Register' });
  const closeDialog = () => setDialog(null);

  return (
    <Screen>
      <View style={styles.titleRow}>
        <ScreenTitle style={styles.title}>KH-Rechner</ScreenTitle>
        <View style={styles.totalRow}>
          {/* Tap the total to see which foods it's made of. */}
          <Pressable
            onPress={() => setDialog({ kind: 'meal' })}
            disabled={meal.length === 0}
            style={({ pressed }) => [styles.total, pressed && styles.totalPressed]}
            accessibilityRole="button"
            accessibilityLabel={`Zwischentotal ${formatCarbs(mealCarbs)}, Lebensmittel anzeigen`}
            hitSlop={6}
          >
            <Text style={styles.totalValue}>{Math.round(mealCarbs)} g</Text>
            <Text style={styles.totalUnit}>KH</Text>
          </Pressable>
          {/* Greyed out without an account, but still tappable to explain why. */}
          <Pressable
            onPress={saveMeal}
            disabled={canSaveDiary && (meal.length === 0 || saving)}
            style={({ pressed }) => [
              styles.iconBtn,
              pressed && styles.iconBtnPressed,
              (!canSaveDiary || meal.length === 0) && styles.iconBtnDimmed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Mahlzeit im Tagebuch speichern"
            hitSlop={4}
          >
            {saving ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Ionicons
                name="save-outline"
                size={20}
                color={canSaveDiary ? colors.accent : colors.textTertiary}
              />
            )}
          </Pressable>
          <Pressable
            onPress={clearMeal}
            disabled={meal.length === 0}
            style={({ pressed }) => [
              styles.iconBtn,
              pressed && styles.iconBtnPressed,
              meal.length === 0 && styles.iconBtnDimmed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Zwischentotal auf null setzen"
            hitSlop={4}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </Pressable>
        </View>
      </View>


      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={colors.textTertiary} />
        <TextField
          placeholder="Lebensmittel suchen…"
          value={query}
          onChangeText={setQuery}
          containerStyle={styles.searchField}
          style={styles.searchInput}
          autoCorrect={false}
        />
      </View>

      {/* Search results list (hidden once a food is chosen & query cleared). */}
      {loading ? (
        <ActivityIndicator color={colors.accent} />
      ) : (
        results.slice(0, 8).map((food) => (
          <Pressable
            key={food.id}
            style={styles.resultRow}
            onPress={() => selectFood(food)}
          >
            <View style={styles.resultBody}>
              <Text style={styles.resultName}>{food.name}</Text>
              <Text style={styles.resultGroup}>{food.food_group}</Text>
            </View>
            <Text style={styles.resultCarbs}>{food.carbs_per_100g} g / 100 g</Text>
          </Pressable>
        ))
      )}

      {selected && nutrients && (
        <Card style={styles.selectedCard}>
          {/* Header */}
          <View style={styles.foodHeader}>
            <View>
              <Text style={styles.foodName}>{selected.name}</Text>
              <Text style={styles.foodGroup}>{selected.food_group}</Text>
            </View>
          </View>

          {/* Portion presets */}
          <SectionLabel>Portionsgrösse</SectionLabel>
          <View style={styles.chipRow}>
            {selected.portions.map((p) => (
              <SelectableChip
                key={p.label}
                label={p.label}
                selected={Math.round(grams) === p.grams}
                onPress={() => setGramsExternal(p.grams)}
              />
            ))}
          </View>

          {/* Gram field + slider, two-way bound */}
          <View style={styles.gramRow}>
            <TextField
              value={String(Math.round(grams))}
              onChangeText={(t) => {
                const n = parseInt(t.replace(/[^0-9]/g, ''), 10);
                setGramsExternal(Number.isNaN(n) ? 0 : Math.min(n, MAX_GRAMS));
              }}
              keyboardType="number-pad"
              containerStyle={styles.gramField}
              style={styles.gramInput}
            />
            <Text style={styles.gramUnit}>Gramm</Text>
          </View>
          <Slider
            minimumValue={0}
            maximumValue={MAX_GRAMS}
            step={1}
            value={sliderValue}
            onValueChange={(v) => {
              // Coalesce the burst of drag events into one commit per frame so
              // the nutrient math + re-render can keep up (issue #1).
              pendingGramsRef.current = v;
              if (rafRef.current !== null) return;
              rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                setGrams(Math.round(pendingGramsRef.current));
              });
            }}
            onSlidingComplete={(v) => {
              if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
              }
              // Sync the slider's own value once the drag is over, so a later
              // external set to the previous value still moves the thumb.
              setGrams(Math.round(v));
              setSliderValue(Math.round(v));
            }}
            minimumTrackTintColor={colors.accent}
            maximumTrackTintColor={colors.bgInput}
            thumbTintColor={colors.accent}
          />

          {/* Nutrient bars */}
          <SectionLabel style={styles.nutrientLabel}>Nährwerte</SectionLabel>
          <NutrientBar
            label="Kohlenhydrate"
            value={`${Math.round(nutrients.carbs)} g`}
            fraction={nutrients.carbs / BAR_MAX.carbs}
            color={colors.dataCarb}
          />
          <NutrientBar
            label="Zucker"
            value={`${Math.round(nutrients.sugar)} g`}
            fraction={nutrients.sugar / BAR_MAX.sugar}
            color={colors.dataSugar}
          />
          <NutrientBar
            label="Glyk. Index"
            value={`${Math.round(nutrients.gi)}`}
            fraction={nutrients.gi / BAR_MAX.gi}
            color={colors.dataGlyc}
          />
          <NutrientBar
            label="Fett"
            value={`${Math.round(nutrients.fat)} g`}
            fraction={nutrients.fat / BAR_MAX.fat}
            color={colors.dataFat}
          />

          {/* Carbs of this portion */}
          <View style={styles.summaryChip}>
            <Text style={styles.summaryText}>
              Diese Portion: {formatCarbs(nutrients.carbs)}
            </Text>
          </View>

          {/* Collect into the meal (saved to the diary via the title icon). */}
          <Button
            title="Zur Mahlzeit hinzufügen"
            icon="add"
            onPress={addToMeal}
            disabled={grams <= 0}
            style={styles.spacedBtn}
          />
        </Card>
      )}

      {/* Foods collected into the meal so far. */}
      <Dialog
        visible={dialog?.kind === 'meal'}
        title="Mahlzeit"
        onClose={closeDialog}
        actions={[{ label: 'Schliessen', onPress: closeDialog }]}
      >
        <View style={styles.mealList}>
          {meal.map((item) => (
            <View key={item.key} style={[styles.mealRow, styles.mealRowBorder]}>
              <Text style={styles.mealName} numberOfLines={1}>
                {item.food.name}
              </Text>
              <Text style={styles.mealGrams}>{item.grams} g</Text>
              <Text style={styles.mealCarbs}>
                {formatCarbs(portionNutrients(item.food, item.grams).carbs)}
              </Text>
            </View>
          ))}
          <View style={styles.mealRow}>
            <Text style={styles.mealTotalLabel}>Total</Text>
            <Text style={styles.mealCarbs}>{formatCarbs(mealCarbs)}</Text>
          </View>
        </View>
      </Dialog>
      <Dialog
        visible={dialog?.kind === 'account'}
        title="Konto erforderlich"
        message={`${gateCopy.saveMeal} Mit einem kostenlosen Konto werden deine Mahlzeiten im Tagebuch gespeichert.`}
        onClose={closeDialog}
        actions={[
          { label: 'Abbrechen', onPress: closeDialog },
          {
            label: 'Konto erstellen',
            variant: 'primary',
            onPress: () => {
              closeDialog();
              goRegister();
            },
          },
        ]}
      />
      <Dialog
        visible={dialog?.kind === 'saved'}
        title="Gespeichert"
        message={
          dialog?.kind === 'saved' && dialog.count === 1
            ? '1 Lebensmittel wurde im Tagebuch eingetragen.'
            : `${dialog?.kind === 'saved' ? dialog.count : 0} Lebensmittel wurden im Tagebuch eingetragen.`
        }
        onClose={closeDialog}
        actions={[
          { label: 'OK', onPress: closeDialog },
          {
            label: 'Zum Tagebuch',
            variant: 'primary',
            onPress: () => {
              closeDialog();
              navigation.navigate('Tagebuch');
            },
          },
        ]}
      />
      <Dialog
        visible={dialog?.kind === 'error'}
        title="Speichern fehlgeschlagen"
        message="Nicht alle Lebensmittel konnten gespeichert werden. Die übrigen sind noch in der Mahlzeit – bitte versuche es erneut."
        onClose={closeDialog}
        actions={[{ label: 'OK', variant: 'primary', onPress: closeDialog }]}
      />
    </Screen>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    title: { marginBottom: 0, flexShrink: 1 },
    totalRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    total: {
      alignItems: 'flex-end',
      marginRight: spacing.xs,
      paddingHorizontal: spacing.xs,
      borderRadius: radius.input,
    },
    totalPressed: { backgroundColor: colors.bgSurfaceAlt },
    totalValue: { fontSize: 20, fontWeight: '700', color: colors.accent },
    totalUnit: { fontSize: 12, color: colors.textTertiary },
    iconBtn: {
      width: 40,
      height: 40,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.bgSurface,
    },
    iconBtnPressed: { backgroundColor: colors.bgSurfaceAlt },
    iconBtnDimmed: { opacity: 0.4 },
    mealList: { marginTop: spacing.md },
    mealRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
    mealRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
    mealName: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
    mealGrams: { fontSize: 13, color: colors.textTertiary, marginHorizontal: spacing.md },
    mealCarbs: { fontSize: 14, fontWeight: '700', color: colors.accent },
    mealTotalLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.textPrimary },
    searchRow: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
    searchField: { flex: 1, marginBottom: spacing.md, marginLeft: -26 },
    searchInput: { paddingLeft: 42 },
    resultRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    resultBody: { flex: 1, marginRight: spacing.md },
    resultName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
    resultGroup: { fontSize: 13, color: colors.textTertiary },
    resultCarbs: { fontSize: 13, color: colors.textSecondary },
    selectedCard: { marginTop: spacing.lg },
    foodHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
    foodName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
    foodGroup: { fontSize: 14, color: colors.textTertiary },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
    gramRow: { flexDirection: 'row', alignItems: 'center' },
    gramField: { flex: 1, marginBottom: spacing.sm },
    gramInput: { fontSize: 20, fontWeight: '700' },
    gramUnit: { marginLeft: spacing.md, color: colors.textSecondary, fontSize: 16 },
    nutrientLabel: { marginTop: spacing.lg },
    summaryChip: {
      paddingVertical: spacing.md,
      marginTop: spacing.sm,
    },
    summaryText: { color: colors.textPrimary, fontWeight: '700', fontSize: 16, textAlign: 'center' },
    spacedBtn: { marginTop: spacing.md },
  });
