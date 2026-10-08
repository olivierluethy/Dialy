import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
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
import type { Food } from '@/types/models';

type Kind = 'new' | 'fix';
type DialogState = null | 'opened' | 'failed';

const PICKER_RESULTS = 6;

/**
 * Kontakt: suggest a new food or report a wrong one. Deliberately simple —
 * "Senden" opens the user's mail app with recipient, subject and body
 * prefilled (mailto:), so no backend is needed.
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

  const canSend =
    kind === 'new' ? name.trim().length > 0 : food !== null && message.trim().length > 0;

  const reset = () => {
    setName('');
    setCarbs('');
    setSugar('');
    setFat('');
    setQuery('');
    setFood(null);
    setMessage('');
  };

  const buildMail = (): { subject: string; body: string } => {
    const value = (v: string) => (v.trim() ? `${v.trim()} g` : '–');
    const footer = `\n\n—\nGesendet aus Dialy ${Constants.expoConfig?.version ?? ''}`;
    if (kind === 'new') {
      return {
        subject: `Dialy: Neues Lebensmittel – ${name.trim()}`,
        body:
          `Neues Lebensmittel vorschlagen\n\n` +
          `Name: ${name.trim()}\n` +
          `Kohlenhydrate pro 100 g: ${value(carbs)}\n` +
          `Zucker pro 100 g: ${value(sugar)}\n` +
          `Fett pro 100 g: ${value(fat)}\n\n` +
          `Bemerkung / Quelle:\n${message.trim() || '–'}` +
          footer,
      };
    }
    const f = food!;
    return {
      subject: `Dialy: Korrektur – ${f.name}`,
      body:
        `Fehler bei einem Lebensmittel melden\n\n` +
        `Lebensmittel: ${f.name} (ID ${f.id})\n` +
        `Aktuelle Werte pro 100 g: ${f.carbs_per_100g} g KH, ${f.sugar_per_100g} g Zucker, ` +
        `${f.fat_per_100g} g Fett\n\n` +
        `Korrekturvorschlag:\n${message.trim()}` +
        footer,
    };
  };

  const send = async () => {
    if (!canSend) return;
    const { subject, body } = buildMail();
    const url =
      `mailto:${config.contactEmail}` +
      `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      await Linking.openURL(url);
      setDialog('opened');
    } catch {
      setDialog('failed');
    }
  };

  return (
    <Screen contentStyle={styles.content}>
      <Text style={styles.intro}>
        Fehlt ein Lebensmittel oder stimmt ein Wert nicht? Schreib uns – das Formular
        öffnet deine Mail-App mit einer vorbereiteten Nachricht.
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
        style={styles.spaced}
      />
      <Text style={styles.hint}>* Pflichtfeld · Empfänger: {config.contactEmail}</Text>

      <Dialog
        visible={dialog === 'opened'}
        title="Fast geschafft"
        message="Deine Mail-App wurde mit der vorbereiteten Nachricht geöffnet. Bitte sende sie dort ab. Danke für deine Hilfe!"
        onClose={() => setDialog(null)}
        actions={[
          { label: 'Formular behalten', onPress: () => setDialog(null) },
          {
            label: 'Leeren',
            variant: 'primary',
            onPress: () => {
              reset();
              setDialog(null);
            },
          },
        ]}
      />
      <Dialog
        visible={dialog === 'failed'}
        title="Mail-App nicht gefunden"
        message={`Auf diesem Gerät liess sich keine Mail-App öffnen. Du kannst uns direkt an ${config.contactEmail} schreiben.`}
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
    hint: {
      fontSize: 12,
      color: colors.textTertiary,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
  });
