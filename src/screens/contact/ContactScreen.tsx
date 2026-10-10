import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { Card, SectionLabel } from '@/components/primitives';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { SelectableChip } from '@/components/Chip';
import { Dialog } from '@/components/Dialog';
import { spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { foodsRepo } from '@/db/repositories/foods';
import { config } from '@/config';
import { contactErrorText, sendContactMessage, type ContactError } from '@/services/contact';
import type { Food } from '@/types/models';

type Kind = 'new' | 'fix';
type DialogState = null | 'sent' | ContactError;

const PICKER_RESULTS = 6;

/** "12,5" → 12.5; empty → null; not a number or outside 0–100 g → NaN. */
function parseGrams(v: string): number | null {
  const t = v.trim().replace(',', '.');
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 && n <= 100 ? n : NaN;
}

/**
 * Kontakt: suggest a new food or report a wrong one. "Senden" writes the
 * message to Supabase (services/contact.ts); it needs an internet connection.
 */
export function ContactScreen() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [kind, setKind] = useState<Kind>('new');

  // Neues Lebensmittel
  const [name, setName] = useState('');
  const [carbs, setCarbs] = useState('');
  const [sugar, setSugar] = useState('');
  const [fat, setFat] = useState('');

  // Fehler melden
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [food, setFood] = useState<Food | null>(null);

  const [message, setMessage] = useState('');
  const [dialog, setDialog] = useState<DialogState>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let active = true;
    if (!query.trim()) {
      setResults([]);
      return;
    }
    foodsRepo.search(query).then((rows) => {
      if (active) setResults(rows.slice(0, PICKER_RESULTS));
    });
    return () => {
      active = false;
    };
  }, [query]);

  const values = { carbs: parseGrams(carbs), sugar: parseGrams(sugar), fat: parseGrams(fat) };
  const valuesValid = Object.values(values).every((v) => !Number.isNaN(v));
  const canSend =
    kind === 'new'
      ? name.trim().length > 0 && valuesValid
      : food !== null && message.trim().length > 0;

  const reset = () => {
    setName('');
    setCarbs('');
    setSugar('');
    setFat('');
    setQuery('');
    setFood(null);
    setMessage('');
  };

  const send = async () => {
    if (!canSend || sending) return;
    const app_version = Constants.expoConfig?.version ?? null;
    setSending(true);
    const result = await sendContactMessage(
      kind === 'new'
        ? {
            kind: 'new_food',
            food_name: name.trim(),
            carbs_per_100g: values.carbs,
            sugar_per_100g: values.sugar,
            fat_per_100g: values.fat,
            message: message.trim(),
            app_version,
          }
        : {
            kind: 'food_fix',
            food_name: food!.name,
            food_id: food!.id,
            message: message.trim(),
            app_version,
          }
    );
    setSending(false);
    if ('ok' in result) {
      reset();
      setDialog('sent');
    } else {
      setDialog(result.error);
    }
  };

  return (
    <Screen contentStyle={styles.content}>
      <Text style={styles.intro}>
        Fehlt ein Lebensmittel oder stimmt ein Wert nicht? Schreib uns – wir prüfen jeden
        Hinweis.
      </Text>

      <View style={styles.kindRow}>
        <SelectableChip
          label="Neues Lebensmittel"
          selected={kind === 'new'}
          onPress={() => setKind('new')}
        />
        <SelectableChip
          label="Fehler melden"
          selected={kind === 'fix'}
          onPress={() => setKind('fix')}
        />
      </View>

      {kind === 'new' ? (
        <>
          <TextField
            label="Name des Lebensmittels *"
            value={name}
            onChangeText={setName}
            placeholder="z. B. Dinkel-Vollkornbrötli"
          />
          <SectionLabel>Nährwerte pro 100 g (falls bekannt)</SectionLabel>
          <View style={styles.valuesRow}>
            <TextField
              label="KH (g)"
              value={carbs}
              onChangeText={setCarbs}
              keyboardType="decimal-pad"
              containerStyle={styles.valueField}
            />
            <TextField
              label="Zucker (g)"
              value={sugar}
              onChangeText={setSugar}
              keyboardType="decimal-pad"
              containerStyle={styles.valueField}
            />
            <TextField
              label="Fett (g)"
              value={fat}
              onChangeText={setFat}
              keyboardType="decimal-pad"
              containerStyle={styles.valueField}
            />
          </View>
          {!valuesValid && (
            <Text style={styles.error}>Nährwerte bitte als Zahl zwischen 0 und 100 angeben.</Text>
          )}
          <TextField
            label="Bemerkung / Quelle"
            value={message}
            onChangeText={setMessage}
            placeholder="z. B. Werte von der Verpackung"
            multiline
            style={styles.multiline}
          />
        </>
      ) : (
        <>
          <SectionLabel>Welches Lebensmittel ist falsch? *</SectionLabel>
          {food ? (
            <Card style={styles.selectedFood}>
              <View style={styles.selectedRow}>
                <View style={styles.flex}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodValues}>
                    {food.carbs_per_100g} g KH · {food.sugar_per_100g} g Zucker ·{' '}
                    {food.fat_per_100g} g Fett pro 100 g
                  </Text>
                </View>
                <Pressable
                  onPress={() => setFood(null)}
                  accessibilityRole="button"
                  accessibilityLabel="Anderes Lebensmittel wählen"
                  hitSlop={8}
                >
                  <Ionicons name="close-circle" size={22} color={colors.textTertiary} />
                </Pressable>
              </View>
            </Card>
          ) : (
            <>
              <TextField
                value={query}
                onChangeText={setQuery}
                placeholder="Lebensmittel suchen…"
                autoCorrect={false}
              />
              {results.map((f) => (
                <Pressable
                  key={f.id}
                  style={styles.resultRow}
                  onPress={() => {
                    setFood(f);
                    setQuery('');
                  }}
                >
                  <Text style={styles.resultName}>{f.name}</Text>
                  <Text style={styles.resultCarbs}>{f.carbs_per_100g} g / 100 g</Text>
                </Pressable>
              ))}
            </>
          )}
          <TextField
            label="Korrekturvorschlag *"
            value={message}
            onChangeText={setMessage}
            placeholder="z. B. Laut Verpackung 48 g KH pro 100 g"
            multiline
            style={styles.multiline}
            containerStyle={styles.spaced}
          />
        </>
      )}

      <Button
        title="Senden"
        icon="send"
        onPress={send}
        disabled={!canSend}
        loading={sending}
        style={styles.spaced}
      />
      <Text style={styles.hint}>* Pflichtfeld</Text>

      <Dialog
        visible={dialog === 'sent'}
        title="Danke!"
        message="Deine Nachricht ist bei uns angekommen. Danke für deine Hilfe!"
        onClose={() => setDialog(null)}
        actions={[{ label: 'OK', variant: 'primary', onPress: () => setDialog(null) }]}
      />
      <Dialog
        visible={dialog !== null && dialog !== 'sent'}
        title="Nicht gesendet"
        message={
          dialog !== null && dialog !== 'sent'
            ? `${contactErrorText(dialog)} Du kannst uns auch an ${config.contactEmail} schreiben.`
            : undefined
        }
        onClose={() => setDialog(null)}
        actions={[{ label: 'OK', variant: 'primary', onPress: () => setDialog(null) }]}
      />
    </Screen>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    // Half the usual top padding above the intro…
    content: { paddingTop: spacing.sm },
    // …and an empty line (one line height) more below it.
    intro: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 21,
      marginBottom: spacing.lg + 21,
    },
    // Like the intro: an empty line (one line height) more below the chips.
    kindRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.lg + 21,
    },
    valuesRow: { flexDirection: 'row', gap: spacing.sm },
    valueField: { flex: 1 },
    multiline: { minHeight: 110, paddingTop: spacing.md, textAlignVertical: 'top' },
    selectedFood: { marginBottom: spacing.sm },
    selectedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    flex: { flex: 1 },
    foodName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
    foodValues: { fontSize: 13, color: colors.textTertiary, marginTop: 2 },
    resultRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    resultName: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
    resultCarbs: { fontSize: 13, color: colors.textSecondary },
    spaced: { marginTop: spacing.md },
    error: { fontSize: 13, color: colors.danger, marginTop: -spacing.xs, marginBottom: spacing.sm },
    hint: {
      fontSize: 12,
      color: colors.textTertiary,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
  });
