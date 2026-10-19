import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Icon } from '@/components/Icon';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { ScreenTitle, SectionLabel, Card } from '@/components/primitives';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { NutrientBar } from '@/components/NutrientBar';
import { Dialog } from '@/components/Dialog';
import { BLACK, radius, spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { foodsRepo } from '@/db/repositories/foods';
import { hasFoods } from '@/services/foodSync';
import { FOOD_CATEGORIES, USUAL_PORTION_LABEL } from '@/data/foodCategories';
import { useLanguage, useT, type Dict } from '@/i18n';
import { foodCategoryLabel, localizedPortionLabel } from '@/i18n/foods';
import { mealsRepo } from '@/db/repositories/meals';
import { useAppStore } from '@/state/store';
import { can } from '@/policy/gating';
import { carbsToBe, formatCarbs } from '@/utils/format';
import { nowIso, uuidv4 } from '@/utils/id';
import type { Food } from '@/types/models';

// Reference maxima used only to scale the visual nutrient bars.
const BAR_MAX = { carbs: 80, sugar: 50, gi: 100, fat: 40 };
const MAX_GRAMS = 500;
// Search results shown at once; "Weitere anzeigen" adds another page.
const PAGE_SIZE = 50;

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

/**
 * "Quelle: BLV | menuCH" — where the nutrients and (after "|") the usual
 * portion come from. Null for the curated foods.
 */
function foodSourceText(food: Food, t: Dict): string | null {
  if (food.id.startsWith('brand-')) return t.khrechner.source(t.khrechner.sourceManufacturer);
  if (food.id.startsWith('off-')) return t.khrechner.source('Open Food Facts (ODbL)');
  const nutrients = food.id.startsWith('blv-')
    ? 'BLV'
    : food.id.startsWith('bls-')
      ? 'BLS 4.0 (Max Rubner-Institut)'
      : null;
  if (!nutrients) return null;
  const fromMenuch = food.portions[0]?.label.startsWith(USUAL_PORTION_LABEL);
  return t.khrechner.source(`${nutrients}${fromMenuch ? ' | menuCH' : ''}`);
}

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
  const scrollRef = useRef<ScrollView>(null);
  const scrollToTopAfterAddRef = useRef(false);
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  // Search results carry names in the UI language: search again on a change.
  const language = useLanguage();
  const [query, setQuery] = useState('');
  // Searching a large offline catalogue is fast, but a small debounce avoids
  // doing work for every character while somebody is typing quickly.
  const [committedQuery, setCommittedQuery] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  // No foods on the device yet (first start, not downloaded so far).
  const [noFoods, setNoFoods] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [category, setCategory] = useState<string | null>(null);
  const [categoryListOpen, setCategoryListOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Food | null>(null);
  const [portionListOpen, setPortionListOpen] = useState(false);
  const [selectedPortionIndex, setSelectedPortionIndex] = useState<number | null>(null);
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
  // Bumped when food changes from the Dialy-Editor arrive: search again.
  const dataRevision = useAppStore((s) => s.dataRevision);
  const ctx = { isLoggedIn: user !== null, isPremium };

  // A collected (unsaved) meal belongs to whoever built it: drop it when an
  // account signs out or another one signs in, so it can't be saved into
  // someone else's diary. Signing in after building it signed out keeps it.
  const mealOwnerRef = useRef(user?.id ?? null);
  useEffect(() => {
    const id = user?.id ?? null;
    if (mealOwnerRef.current !== null && mealOwnerRef.current !== id) setMeal([]);
    mealOwnerRef.current = id;
  }, [user?.id]);

  // Search runs in memory, so the spinner only shows on the very first load
  // (no flicker per keystroke). A new query starts again at the first page.
  useEffect(() => {
    const timer = setTimeout(() => setCommittedQuery(query), 120);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let active = true;
    foodsRepo.search(committedQuery, category).then((rows) => {
      if (active) {
        setResults(rows);
        if (rows.length > 0) setNoFoods(false);
        else void hasFoods().then((has) => active && setNoFoods(!has));
        setVisibleCount(PAGE_SIZE);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [committedQuery, category, dataRevision, language]);

  // The select list only contains categories that actually contain foods.
  useEffect(() => {
    foodsRepo.categories().then((present) =>
      setCategories(FOOD_CATEGORIES.filter((c) => present.has(c)))
    );
  }, [dataRevision]);

  // Picking a food opens the calculation popup.
  const selectFood = (food: Food) => {
    scrollToTopAfterAddRef.current = false;
    setSelected(food);
    setPortionListOpen(false);
    setSelectedPortionIndex(null);
    // Start at 100 g; portions are applied only through the select list.
    setGramsExternal(100);
  };
  // A new language renames the foods: close the open one so its name
  // isn't left in the old language.
  useEffect(() => {
    setSelected(null);
  }, [language]);

  // Latest handler for the memoised result rows below.
  const selectFoodRef = useRef(selectFood);
  selectFoodRef.current = selectFood;

  // The result rows only depend on the results, so slider drags (which
  // re-render the screen every frame) don't re-render up to ~60 rows.
  const resultRows = useMemo(
    () =>
      results.slice(0, visibleCount).map((food) => (
        <Pressable
          key={food.id}
          style={styles.resultRow}
          onPress={() => selectFoodRef.current(food)}
          accessibilityRole="button"
          accessibilityLabel={`${food.name}, ${food.carbs_per_100g} g / 100 g`}
        >
          <View style={styles.resultBody}>
            <Text style={styles.resultName}>{food.name}</Text>
          </View>
          <Text style={styles.resultCarbs}>{food.carbs_per_100g} g / 100 g</Text>
        </Pressable>
      )),
    [results, visibleCount, styles]
  );
  const remaining = results.length - visibleCount;

  // Live nutrient math for the food currently being edited.
  const nutrients = useMemo(
    () => (selected ? portionNutrients(selected, grams) : null),
    [selected, grams]
  );
  const selectedPortion = selectedPortionIndex === null ? undefined : selected?.portions[selectedPortionIndex];

  // Running carb total of everything collected into the meal so far.
  const mealCarbs = useMemo(
    () => meal.reduce((sum, i) => sum + portionNutrients(i.food, i.grams).carbs, 0),
    [meal]
  );

  // Brief highlight of the total (top right) whenever a food is added, so it's
  // visible that the meal — and its carb total — just changed.
  const totalFlash = useRef(new Animated.Value(0)).current;
  const flashTotal = () => {
    totalFlash.setValue(0);
    Animated.sequence([
      Animated.timing(totalFlash, { toValue: 1, duration: 140, useNativeDriver: false }),
      Animated.timing(totalFlash, { toValue: 0, duration: 420, useNativeDriver: false }),
    ]).start();
  };

  // Collect the current food + portion into the meal, then clear the editor
  // so the next food can be searched.
  const addToMeal = () => {
    if (!selected || grams <= 0) return;
    setMeal((m) => [...m, { key: uuidv4(), food: selected, grams }]);
    flashTotal();
    scrollToTopAfterAddRef.current = true;
    Keyboard.dismiss();
    closeFood();
    scrollRef.current?.scrollTo({ x: 0, y: 0, animated: false });
  };

  // Close the food editor without adding anything.
  const closeFood = () => {
    setSelected(null);
    setPortionListOpen(false);
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

  // Without a subscription: sign in first, or (signed in) get Premium.
  const goUnlock = () =>
    user
      ? navigation.navigate('Login', { screen: 'Paywall' })
      : navigation.navigate('Login', { screen: 'LoginHome', params: { returnTo: 'KHRechner' } });
  const closeDialog = () => setDialog(null);

  // Drive the total's flash: color jumps to the accent and the value pulses.
  const totalFlashColor = totalFlash.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textSecondary, colors.accent],
  });
  const totalFlashScale = totalFlash.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <Screen scrollRef={scrollRef}>
      <View style={styles.titleRow}>
        <ScreenTitle style={styles.title}>{t.khrechner.title}</ScreenTitle>
        <View style={styles.totalRow}>
          <View style={styles.iconActions}>
          {/* Tap the total to see which foods it's made of. */}
          <Pressable
            onPress={() => setDialog({ kind: 'meal' })}
            disabled={meal.length === 0}
            style={({ pressed }) => [styles.total, pressed && styles.totalPressed]}
            accessibilityRole="button"
            accessibilityLabel={t.khrechner.totalA11y(formatCarbs(mealCarbs))}
            hitSlop={6}
          >
            <Animated.View style={{ alignItems: 'flex-end', transform: [{ scale: totalFlashScale }] }}>
              <Animated.Text style={[styles.totalValue, { color: totalFlashColor }]}>
                {Math.round(mealCarbs)} g
              </Animated.Text>
              <Text style={styles.totalUnit}>{t.units.carbs}</Text>
            </Animated.View>
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
              accessibilityLabel={t.khrechner.saveMealA11y}
              hitSlop={4}
            >
              {saving ? (
                <ActivityIndicator size="small" color={BLACK} />
              ) : (
                <Icon
                  name="save"
                  size={20}
                  color={BLACK}
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
              accessibilityLabel={t.khrechner.clearA11y}
              hitSlop={4}
            >
              <Icon name="delete" size={20} color={BLACK} />
            </Pressable>
          </View>
        </View>
      </View>


      <View style={styles.categoryFilter}>
        <Pressable
          onPress={() => setCategoryListOpen((open) => !open)}
          accessibilityRole="button"
          accessibilityLabel={`${t.khrechner.category}: ${category === null ? t.khrechner.all : foodCategoryLabel(category, t)}`}
          accessibilityState={{ expanded: categoryListOpen }}
          style={({ pressed }) => [styles.categorySelect, pressed && styles.categoryOptionPressed]}
        >
          <Text style={styles.categoryValue}>
            {category === null ? t.khrechner.all : foodCategoryLabel(category, t)}
          </Text>
          <Icon name="chevronDown" size={18} color={colors.textSecondary} style={categoryListOpen ? styles.categoryChevronOpen : undefined} />
        </Pressable>
        {categoryListOpen && (
          <ScrollView
            style={styles.categoryList}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {[null, ...categories].map((value) => (
              <Pressable
                key={value ?? 'all'}
                accessibilityRole="radio"
                accessibilityState={{ checked: category === value }}
                onPress={() => {
                  setCategory(value);
                  setCategoryListOpen(false);
                }}
                style={({ pressed }) => [
                  styles.categoryOption,
                  category === value && styles.categoryOptionSelected,
                  pressed && styles.categoryOptionPressed,
                ]}
              >
                <Text style={[styles.categoryValue, category === value && styles.categorySelectedText]}>
                  {value === null ? t.khrechner.all : foodCategoryLabel(value, t)}
                </Text>
                {category === value && <Icon name="check" size={18} color={colors.accent} />}
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.searchRow}>
        <TextField
          placeholder={t.khrechner.searchPlaceholder}
          value={query}
          onChangeText={setQuery}
          containerStyle={styles.searchField}
          style={query.length > 0 && styles.searchInputClearable}
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel={t.khrechner.searchPlaceholder}
        />
        {query.length > 0 && (
          <Pressable
            onPress={() => setQuery('')}
            style={styles.searchClear}
            accessibilityRole="button"
            accessibilityLabel={t.khrechner.clearSearchA11y}
            hitSlop={8}
          >
            <Icon name="clear" size={20} color={colors.textTertiary} />
          </Pressable>
        )}
      </View>

      {/* Search results, paged. */}
      {loading ? (
        <ActivityIndicator color={colors.accent} />
      ) : (
        <>
          {(noFoods || results.length === 0) && (
            <Text style={styles.resultCount}>
              {noFoods ? t.khrechner.noFoodsYet : t.khrechner.noResults}
            </Text>
          )}
          {resultRows}
          {remaining > 0 && (
            <Button
              title={t.khrechner.showMore(Math.min(PAGE_SIZE, remaining), remaining)}
              variant="secondary"
              onPress={() => setVisibleCount((n) => n + PAGE_SIZE)}
              style={styles.spacedBtn}
            />
          )}
        </>
      )}

      {/* Calculation for the picked food, as a popup over the results. Tap
          beside it (or the close button / Android back) to close. */}
      <Modal
        visible={selected !== null && nutrients !== null}
        transparent
        animationType="fade"
        onRequestClose={closeFood}
        onDismiss={() => {
          if (!scrollToTopAfterAddRef.current) return;
          scrollToTopAfterAddRef.current = false;
          // Keep the total visible after the modal restores focus to the food row.
          requestAnimationFrame(() => scrollRef.current?.scrollTo({ x: 0, y: 0, animated: false }));
        }}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeFood}
            accessibilityLabel={t.common.close}
          />
          {selected && nutrients && (
            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalContent}
              keyboardShouldPersistTaps="handled"
            >
              <Card>
                {/* Header */}
                <View style={styles.foodHeader}>
                  <View style={styles.foodHeaderText}>
                    <Text style={styles.foodName}>{selected.name}</Text>
                  </View>
                  <Pressable
                    onPress={closeFood}
                    accessibilityRole="button"
                    accessibilityLabel={t.khrechner.closeFoodA11y}
                    hitSlop={8}
                    style={styles.closeBtn}
                  >
                    <Icon name="close" size={22} color={colors.textTertiary} />
                  </Pressable>
                </View>

                {/* Portion presets (BLV foods have none: grams only) */}
                {selected.portions.length > 0 && (
                  <>
                    <SectionLabel>{t.khrechner.portionSize}</SectionLabel>
                    <View style={styles.portionFilter}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={t.khrechner.portionSize}
                        accessibilityState={{ expanded: portionListOpen }}
                        onPress={() => setPortionListOpen((open) => !open)}
                        style={({ pressed }) => [styles.categorySelect, pressed && styles.categoryOptionPressed]}
                      >
                        <Text style={styles.categoryValue}>
                          {selectedPortion
                            ? `${localizedPortionLabel(selectedPortion.label, t)} · ${selectedPortion.grams} g`
                            : t.khrechner.portionSize}
                        </Text>
                        <Icon name="chevronDown" size={18} color={colors.textSecondary} style={portionListOpen ? styles.categoryChevronOpen : undefined} />
                      </Pressable>
                      {portionListOpen && (
                        <ScrollView style={styles.categoryList} nestedScrollEnabled keyboardShouldPersistTaps="handled">
                          {selected.portions.map((portion, index) => (
                            <Pressable
                              key={`${portion.label}-${index}`}
                              accessibilityRole="radio"
                              accessibilityState={{ checked: selectedPortionIndex === index }}
                              onPress={() => {
                                setGramsExternal(portion.grams);
                                setSelectedPortionIndex(index);
                                setPortionListOpen(false);
                              }}
                              style={({ pressed }) => [
                                styles.categoryOption,
                                selectedPortionIndex === index && styles.portionOptionSelected,
                                pressed && styles.categoryOptionPressed,
                              ]}
                            >
                              <Text style={styles.categoryValue}>{localizedPortionLabel(portion.label, t)} · {portion.grams} g</Text>
                              {selectedPortionIndex === index && <Icon name="check" size={18} color={colors.textPrimary} />}
                            </Pressable>
                          ))}
                        </ScrollView>
                      )}
                    </View>
                  </>
                )}

                {/* Gram field + slider, two-way bound */}
                <View style={styles.gramRow}>
                  <TextField
                    value={String(Math.round(grams))}
                    onChangeText={(v) => {
                      setSelectedPortionIndex(null);
                      const n = parseInt(v.replace(/[^0-9]/g, ''), 10);
                      setGramsExternal(Number.isNaN(n) ? 0 : Math.min(n, MAX_GRAMS));
                    }}
                    keyboardType="number-pad"
                    containerStyle={styles.gramField}
                    style={styles.gramInput}
                  />
                  <View style={styles.gramUnitBox}>
                    <Text style={styles.gramUnit}>{t.khrechner.grams}</Text>
                  </View>
                </View>
                <Slider
                  minimumValue={0}
                  maximumValue={MAX_GRAMS}
                  step={1}
                  value={sliderValue}
                  onSlidingStart={() => {
                    setSelectedPortionIndex(null);
                    setPortionListOpen(false);
                  }}
                  onValueChange={(v) => {
                    // Coalesce the burst of drag events into one commit per frame so
                    // the nutrient math + re-render can keep up (issue #1).
                    pendingGramsRef.current = v;
                    if (rafRef.current !== null) return;
                    rafRef.current = requestAnimationFrame(() => {
                      rafRef.current = null;
                      setSelectedPortionIndex(null);
                      setGrams(Math.round(pendingGramsRef.current));
                    });
                  }}
                  onSlidingComplete={(v) => {
                    setSelectedPortionIndex(null);
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
                <SectionLabel style={styles.nutrientLabel}>{t.khrechner.nutrients}</SectionLabel>
                <NutrientBar
                  label={t.khrechner.carbs}
                  value={`${Math.round(nutrients.carbs)} g`}
                  fraction={nutrients.carbs / BAR_MAX.carbs}
                  color={colors.accent}
                />
                <NutrientBar
                  label={t.khrechner.sugar}
                  value={`${Math.round(nutrients.sugar)} g`}
                  fraction={nutrients.sugar / BAR_MAX.sugar}
                  color={colors.accent}
                />
                {nutrients.gi !== null && (
                  <NutrientBar
                    label={t.khrechner.gi}
                    value={`${Math.round(nutrients.gi)}`}
                    fraction={nutrients.gi / BAR_MAX.gi}
                    color={colors.accent}
                  />
                )}
                <NutrientBar
                  label={t.khrechner.fat}
                  value={`${Math.round(nutrients.fat)} g`}
                  fraction={nutrients.fat / BAR_MAX.fat}
                  color={colors.accent}
                />

                {foodSourceText(selected, t) && (
                  <Text style={styles.foodSource}>{foodSourceText(selected, t)}</Text>
                )}

                {/* Collect into the meal (saved to the diary via the title icon). */}
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ disabled: grams <= 0 }}
                  onPress={addToMeal}
                  disabled={grams <= 0}
                  style={({ pressed }) => [styles.addMealButton, pressed && styles.addMealButtonPressed, grams <= 0 && styles.iconBtnDimmed]}
                >
                  <Text style={styles.addMealLabel}>{t.khrechner.addToMeal}</Text>
                </Pressable>
              </Card>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Foods collected into the meal so far. */}
      <Dialog
        visible={dialog?.kind === 'meal'}
        title={t.khrechner.mealTitle}
        onClose={closeDialog}
        actions={[{ label: t.common.close, variant: 'neutral', onPress: closeDialog }]}
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
            <Text style={styles.mealTotalLabel}>{t.khrechner.total}</Text>
            <Text style={styles.mealCarbs}>{formatCarbs(mealCarbs)}</Text>
          </View>
        </View>
      </Dialog>
      <Dialog
        visible={dialog?.kind === 'account'}
        title={t.khrechner.subscriptionRequired}
        message={t.gate.saveMeal}
        onClose={closeDialog}
        actions={[
          { label: t.common.cancel, onPress: closeDialog },
          {
            label: user ? t.account.viewPremium : t.login.signIn,
            variant: 'primary',
            onPress: () => {
              closeDialog();
              goUnlock();
            },
          },
        ]}
      />
      <Dialog
        visible={dialog?.kind === 'saved'}
        title={t.khrechner.saved}
        message={t.khrechner.savedMessage(dialog?.kind === 'saved' ? dialog.count : 0)}
        onClose={closeDialog}
        actions={[
          { label: t.common.ok, onPress: closeDialog },
          {
            label: t.khrechner.toDiary,
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
        title={t.khrechner.saveFailed}
        message={t.khrechner.saveFailedMessage}
        onClose={closeDialog}
        actions={[{ label: t.common.ok, variant: 'primary', onPress: closeDialog }]}
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
    iconActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      padding: spacing.xs,
      borderRadius: radius.input,
      backgroundColor: colors.bgInput,
    },
    total: {
      alignItems: 'flex-end',
      marginRight: spacing.xs,
      paddingHorizontal: spacing.xs,
      borderRadius: radius.input,
    },
    totalPressed: { backgroundColor: colors.bgSurfaceAlt },
    totalValue: { fontSize: 20, fontWeight: '600', color: colors.textSecondary },
    totalUnit: { fontSize: 12, color: colors.textTertiary },
    iconBtn: {
      width: 40,
      height: 40,
      borderRadius: radius.input,
      alignItems: 'center',
      justifyContent: 'center',
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
    searchField: { flex: 1, marginBottom: spacing.md },
    // Room for the clear button, so long queries don't run under it.
    searchInputClearable: { paddingRight: 44 },
    // Centred on the input (the field has a bottom margin).
    searchClear: {
      position: 'absolute',
      right: spacing.md,
      top: 0,
      bottom: spacing.md,
      justifyContent: 'center',
    },
    resultRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 56,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    resultBody: { flex: 1, marginRight: spacing.md },
    resultName: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
    resultCarbs: { fontSize: 12, color: colors.textSecondary },
    resultCount: { fontSize: 12, color: colors.textTertiary, marginBottom: spacing.xs },
    categoryFilter: { marginBottom: spacing.md },
    categorySelect: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
      minHeight: 48, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
      borderWidth: 1, borderColor: colors.border, borderRadius: radius.input,
      backgroundColor: colors.bgInput,
    },
    categoryValue: { flex: 1, fontSize: 15, color: colors.textPrimary },
    categoryChevronOpen: { transform: [{ rotate: '180deg' }] },
    categoryList: {
      maxHeight: 280, marginTop: spacing.xs,
      borderWidth: 1, borderColor: colors.border, borderRadius: radius.input,
      backgroundColor: colors.bgSurface,
    },
    categoryOption: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
      minHeight: 48, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    },
    categoryOptionSelected: { backgroundColor: colors.accentSubtle },
    categorySelectedText: { color: colors.accent, fontWeight: '600' },
    categoryOptionPressed: { backgroundColor: colors.bgSurfaceAlt },
    modalBackdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
    },
    modalScroll: { width: '100%', maxWidth: 480, maxHeight: '100%', flexGrow: 0 },
    modalContent: { flexGrow: 0 },
    // flex-start keeps the close button top right when the name wraps.
    foodHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.lg },
    // flex: 1 lets long names and the source line wrap instead of overflowing.
    foodHeaderText: { flex: 1 },
    foodName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
    foodSource: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },
    closeBtn: { marginLeft: spacing.md, marginTop: 1 },
    portionFilter: { marginBottom: spacing.lg },
    portionOptionSelected: { backgroundColor: colors.bgSurfaceAlt },
    addMealButton: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
      minHeight: 48, paddingHorizontal: spacing.lg, marginTop: spacing.md,
      borderRadius: radius.button, backgroundColor: colors.bgSurfaceAlt,
      borderWidth: 1, borderColor: colors.border,
    },
    addMealButtonPressed: { backgroundColor: colors.bgInput },
    addMealLabel: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    gramRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
    gramField: { flex: 1, marginBottom: 0 },
    gramInput: { fontSize: 20, fontWeight: '600' },
    gramUnitBox: {
      minHeight: 48,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.bgInput,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.input,
    },
    gramUnit: { color: colors.textSecondary, fontSize: 16 },
    spacedBtn: { marginTop: spacing.md },
    nutrientLabel: { marginTop: spacing.lg },
  });
