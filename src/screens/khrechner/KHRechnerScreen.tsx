import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { TypeSegmentedControl } from '@/components/SegmentedControl';
import { ScreenTitle, SectionLabel, IconBubble, Card } from '@/components/primitives';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { SelectableChip } from '@/components/Chip';
import { NutrientBar } from '@/components/NutrientBar';
import { GateNotice } from '@/components/GateNotice';
import { colors, radius, spacing } from '@/theme/theme';
import { foodsRepo } from '@/db/repositories/foods';
import { mealsRepo } from '@/db/repositories/meals';
import { useAppStore } from '@/state/store';
import { can, gateCopy } from '@/policy/gating';
import { carbsToBe, formatCarbsWithBe } from '@/utils/format';
import type { Food } from '@/types/models';

// Reference maxima used only to scale the visual nutrient bars.
const BAR_MAX = { carbs: 80, sugar: 50, gi: 100, fat: 40 };
const MAX_GRAMS = 500;

export function KHRechnerScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Food | null>(null);
  const [grams, setGrams] = useState(0);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // ── Slider performance (issue #1) ──────────────────────────────────────────
  // The Slider fires onValueChange at a very high rate while dragging. Committing
  // every raw event to state re-rendered the whole screen (search list + card +
  // four nutrient bars + photo) on every pixel and fed the controlled `value`
  // back into the native slider each time — which is what made it stutter and
  // feel "verbuggt". We now:
  //   1. coalesce drag events to at most one state update per animation frame, and
  //   2. only re-seed the slider (via `key`) when grams is set from OUTSIDE the
  //      drag (preset chip, gram field, food select), so the round-trip that
  //      caused the fight no longer happens mid-drag.
  const [sliderSeed, setSliderSeed] = useState(0);
  const rafRef = useRef<number | null>(null);
  const pendingGramsRef = useRef(0);

  // Cancel any in-flight slider frame if the screen unmounts mid-drag.
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Set grams from a source other than the slider drag, and re-seed the slider
  // so its thumb jumps to the new position.
  const setGramsExternal = (n: number) => {
    setGrams(n);
    setSliderSeed((s) => s + 1);
    setSaved(false);
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
    setPhotoUri(null);
    // Default to the first preset portion, or 100 g.
    setGramsExternal(food.portions[0]?.grams ?? 100);
  };

  // Live nutrient math. GI is a property of the food, not scaled by portion.
  const nutrients = useMemo(() => {
    if (!selected) return null;
    const f = grams / 100;
    return {
      carbs: selected.carbs_per_100g * f,
      sugar: selected.sugar_per_100g * f,
      fat: selected.fat_per_100g * f,
      gi: selected.glycemic_index,
    };
  }, [selected, grams]);

  const pickPhoto = async () => {
    if (!can('uploadPhoto', ctx)) return;
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    let result: ImagePicker.ImagePickerResult;
    if (perm.granted) {
      result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    } else {
      // Fall back to the library if camera permission was denied.
      result = await ImagePicker.launchImageLibraryAsync({ quality: 0.6 });
    }
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const saveToDiary = async () => {
    if (!selected || !nutrients) return;
    if (!can('saveDiaryEntry', ctx)) return;
    await mealsRepo.create(
      {
        food_id: selected.id,
        name: selected.name,
        grams,
        carbs_g: nutrients.carbs,
        sugar_g: nutrients.sugar,
        fat_g: nutrients.fat,
        glycemic_index: nutrients.gi,
        be: carbsToBe(nutrients.carbs),
        photo_uri: photoUri,
      },
      user?.id ?? null
    );
    setSaved(true);
  };

  const goRegister = () => navigation.navigate('Login', { screen: 'Register' });

  return (
    <Screen>
      <TypeSegmentedControl />
      <ScreenTitle>KH-Rechner</ScreenTitle>

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
            <IconBubble name="nutrition" size={18} />
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
            <IconBubble name="nutrition" />
            <View style={styles.foodHeaderText}>
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
            key={sliderSeed}
            minimumValue={0}
            maximumValue={MAX_GRAMS}
            step={1}
            value={grams}
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
              setGrams(Math.round(v));
              setSaved(false);
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

          {/* Total summary chip */}
          <View style={styles.summaryChip}>
            <Text style={styles.summaryText}>
              Kohlenhydrate total {formatCarbsWithBe(nutrients.carbs)}
            </Text>
          </View>

          {/* Photo */}
          {photoUri && <Image source={{ uri: photoUri }} style={styles.photo} />}
          <Button
            title={photoUri ? 'Foto ersetzen' : 'Foto hochladen'}
            icon="camera"
            variant="secondary"
            onPress={pickPhoto}
            disabled={!can('uploadPhoto', ctx)}
            style={styles.spacedBtn}
          />

          {/* Save / gating */}
          {can('saveDiaryEntry', ctx) ? (
            <Button
              title={saved ? 'Im Tagebuch gespeichert ✓' : 'Zu Tagebuch hinzufügen'}
              icon={saved ? 'checkmark' : 'add'}
              onPress={saveToDiary}
              disabled={saved}
              style={styles.spacedBtn}
            />
          ) : (
            <View style={styles.spacedBtn}>
              <GateNotice message={gateCopy.saveMeal} onRegister={goRegister} />
            </View>
          )}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  resultBody: { flex: 1, marginHorizontal: spacing.md },
  resultName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  resultGroup: { fontSize: 13, color: colors.textTertiary },
  resultCarbs: { fontSize: 13, color: colors.textSecondary },
  selectedCard: { marginTop: spacing.lg },
  foodHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  foodHeaderText: { marginLeft: spacing.md },
  foodName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  foodGroup: { fontSize: 14, color: colors.textTertiary },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  gramRow: { flexDirection: 'row', alignItems: 'center' },
  gramField: { flex: 1, marginBottom: spacing.sm },
  gramInput: { fontSize: 20, fontWeight: '700' },
  gramUnit: { marginLeft: spacing.md, color: colors.textSecondary, fontSize: 16 },
  nutrientLabel: { marginTop: spacing.lg },
  summaryChip: {
    backgroundColor: colors.accentSubtle,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  summaryText: { color: colors.accent, fontWeight: '700', fontSize: 16, textAlign: 'center' },
  photo: { width: '100%', height: 160, borderRadius: radius.card, marginTop: spacing.lg },
  spacedBtn: { marginTop: spacing.md },
});
