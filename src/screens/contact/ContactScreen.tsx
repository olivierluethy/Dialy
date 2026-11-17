import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { Screen } from '@/components/Screen';
import { SectionLabel } from '@/components/primitives';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { SelectableChip } from '@/components/Chip';
import { Dialog } from '@/components/Dialog';
import { spacing, type Colors } from '@/theme/theme';
import { useThemedStyles } from '@/theme/useTheme';
import { config } from '@/config';
import { useT } from '@/i18n';
import { contactErrorText, sendContactMessage, type ContactError } from '@/services/contact';

type Kind = 'new' | 'other';
type DialogState = null | 'sent' | ContactError;

/** "12,5" → 12.5; empty → null; not a number or outside 0–100 g → NaN. */
function parseGrams(v: string): number | null {
  const t = v.trim().replace(',', '.');
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 && n <= 100 ? n : NaN;
}

/**
 * Kontakt: suggest a new food or send another request. "Senden" writes the
 * message to Supabase (services/contact.ts); it needs an internet connection.
 * Errors in a food and portion sizes are reported on the food itself in the
 * KH-Rechner (FoodFeedbackForm), so the form only points there.
 */
export function ContactScreen() {
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  const [kind, setKind] = useState<Kind>('new');

  // Neues Lebensmittel
  const [name, setName] = useState('');
  const [carbs, setCarbs] = useState('');
  const [sugar, setSugar] = useState('');
  const [fat, setFat] = useState('');

  // Sonstiges
  const [subject, setSubject] = useState('');

  const [message, setMessage] = useState('');
  const [dialog, setDialog] = useState<DialogState>(null);
  const [sending, setSending] = useState(false);

  const values = { carbs: parseGrams(carbs), sugar: parseGrams(sugar), fat: parseGrams(fat) };
  const valuesValid = Object.values(values).every((v) => !Number.isNaN(v));
  const canSend =
    kind === 'new'
      ? name.trim().length > 0 && valuesValid
      : subject.trim().length > 0 && message.trim().length > 0;

  const reset = () => {
    setName('');
    setCarbs('');
    setSugar('');
    setFat('');
    setSubject('');
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
            kind: 'other',
            food_name: subject.trim(),
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
      <View style={styles.kindRow}>
        <SelectableChip
          label={t.contact.kindNew}
          selected={kind === 'new'}
          onPress={() => setKind('new')}
        />
        <SelectableChip
          label={t.contact.kindOther}
          selected={kind === 'other'}
          onPress={() => setKind('other')}
        />
      </View>
      <Text style={styles.fixHint}>{t.contact.fixHint}</Text>

      {kind === 'new' ? (
        <>
          <TextField
            label={t.contact.foodName}
            value={name}
            onChangeText={setName}
            placeholder={t.contact.foodNamePlaceholder}
          />
          <SectionLabel>{t.contact.valuesLabel}</SectionLabel>
          <View style={styles.valuesRow}>
            <TextField
              label={t.contact.carbs}
              value={carbs}
              onChangeText={setCarbs}
              keyboardType="decimal-pad"
              containerStyle={styles.valueField}
            />
            <TextField
              label={t.contact.sugar}
              value={sugar}
              onChangeText={setSugar}
              keyboardType="decimal-pad"
              containerStyle={styles.valueField}
            />
            <TextField
              label={t.contact.fat}
              value={fat}
              onChangeText={setFat}
              keyboardType="decimal-pad"
              containerStyle={styles.valueField}
            />
          </View>
          {!valuesValid && (
            <Text style={styles.error}>{t.contact.valuesInvalid}</Text>
          )}
          <TextField
            label={t.contact.remark}
            value={message}
            onChangeText={setMessage}
            placeholder={t.contact.remarkPlaceholder}
            multiline
            style={styles.multiline}
          />
        </>
      ) : (
        <>
          <TextField
            label={t.contact.subject}
            value={subject}
            onChangeText={setSubject}
            placeholder={t.contact.subjectPlaceholder}
            maxLength={200}
          />
          <TextField
            label={t.contact.message}
            value={message}
            onChangeText={setMessage}
            placeholder={t.contact.messagePlaceholder}
            multiline
            maxLength={4000}
            style={styles.multiline}
          />
        </>
      )}

      <Button
        title={t.contact.send}
        icon="send"
        onPress={send}
        disabled={!canSend}
        loading={sending}
        style={styles.spaced}
      />
      <Text style={styles.hint}>{t.common.requiredHint}</Text>

      <Dialog
        visible={dialog === 'sent'}
        title={t.contact.thanks}
        message={t.contact.sentMessage}
        onClose={() => setDialog(null)}
        actions={[{ label: t.common.ok, variant: 'primary', onPress: () => setDialog(null) }]}
      />
      <Dialog
        visible={dialog !== null && dialog !== 'sent'}
        title={t.contact.notSent}
        message={
          dialog !== null && dialog !== 'sent'
            ? `${contactErrorText(dialog)} ${t.contact.writeTo(config.contactEmail)}`
            : undefined
        }
        onClose={() => setDialog(null)}
        actions={[{ label: t.common.ok, variant: 'primary', onPress: () => setDialog(null) }]}
      />
    </Screen>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    content: { paddingTop: spacing.sm },
    kindRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    fixHint: { fontSize: 13, color: colors.textTertiary, marginBottom: spacing.lg },
    valuesRow: { flexDirection: 'row', gap: spacing.sm },
    valueField: { flex: 1 },
    multiline: { minHeight: 110, paddingTop: spacing.md, textAlignVertical: 'top' },
    spaced: { marginTop: spacing.md },
    error: { fontSize: 13, color: colors.danger, marginTop: -spacing.xs, marginBottom: spacing.sm },
    hint: {
      fontSize: 12,
      color: colors.textTertiary,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
  });
