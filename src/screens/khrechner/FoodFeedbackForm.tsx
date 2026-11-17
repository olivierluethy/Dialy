import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { SectionLabel } from '@/components/primitives';
import { spacing, type Colors } from '@/theme/theme';
import { useThemedStyles } from '@/theme/useTheme';
import { config } from '@/config';
import { useT } from '@/i18n';
import { contactErrorText, sendContactMessage, type ContactError } from '@/services/contact';
import type { Food } from '@/types/models';

export type FeedbackKind = 'error' | 'portion';

const MAX_PORTION_GRAMS = 2000;

/** "45" / "12,5" -> number; empty -> null; not a number or out of range -> NaN. */
function parsePortionGrams(v: string): number | null {
  const t = v.trim().replace(',', '.');
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) && n >= 1 && n <= MAX_PORTION_GRAMS ? n : NaN;
}

/**
 * Report an error or suggest a portion size for the open food, right in the
 * KH-Rechner popup. Sent to Supabase like the Kontakt form
 * (services/contact.ts, kinds 'food_fix' and 'portion'); the food is known,
 * so there is nothing to search. Needs an internet connection.
 */
export function FoodFeedbackForm({
  food,
  kind,
  onClose,
}: {
  food: Food;
  kind: FeedbackKind;
  onClose: () => void;
}) {
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  const [message, setMessage] = useState('');
  const [label, setLabel] = useState('');
  const [grams, setGrams] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<null | 'sent' | ContactError>(null);

  const gramsValue = parsePortionGrams(grams);
  const gramsInvalid = Number.isNaN(gramsValue);
  const canSend =
    kind === 'error'
      ? message.trim().length > 0
      : label.trim().length > 0 && gramsValue !== null && !gramsInvalid;

  const send = async () => {
    if (!canSend || sending) return;
    setSending(true);
    const app_version = Constants.expoConfig?.version ?? null;
    const reply = await sendContactMessage(
      kind === 'error'
        ? { kind: 'food_fix', food_name: food.name, food_id: food.id, message: message.trim(), app_version }
        : {
            kind: 'portion',
            food_name: food.name,
            food_id: food.id,
            portion_label: label.trim(),
            portion_grams: gramsValue,
            message: message.trim(),
            app_version,
          }
    );
    setSending(false);
    setResult('ok' in reply ? 'sent' : reply.error);
  };

  if (result === 'sent') {
    return (
      <View>
        <Text style={styles.sent}>{t.feedback.sent}</Text>
        <Button title={t.common.close} variant="neutral" onPress={onClose} style={styles.spaced} />
      </View>
    );
  }

  return (
    <View>
      <SectionLabel>{kind === 'error' ? t.feedback.reportError : t.feedback.suggestPortion}</SectionLabel>
      {kind === 'portion' && (
        <View style={styles.portionRow}>
          <TextField
            label={t.feedback.portionLabel}
            value={label}
            onChangeText={setLabel}
            placeholder={t.feedback.portionLabelPlaceholder}
            maxLength={80}
            containerStyle={styles.labelField}
          />
          <TextField
            label={t.feedback.portionGrams}
            value={grams}
            onChangeText={setGrams}
            keyboardType="decimal-pad"
            containerStyle={styles.gramsField}
          />
        </View>
      )}
      {kind === 'portion' && gramsInvalid && (
        <Text style={styles.error}>{t.feedback.portionGramsInvalid}</Text>
      )}
      <TextField
        label={kind === 'error' ? t.feedback.reportLabel : t.feedback.remark}
        value={message}
        onChangeText={setMessage}
        placeholder={kind === 'error' ? t.feedback.reportPlaceholder : t.feedback.remarkPlaceholder}
        multiline
        maxLength={4000}
        style={styles.multiline}
      />
      {result !== null && (
        <Text style={styles.error}>
          {`${contactErrorText(result)} ${t.contact.writeTo(config.contactEmail)}`}
        </Text>
      )}
      <View style={styles.actions}>
        <Button title={t.common.cancel} variant="neutral" onPress={onClose} style={styles.action} />
        <Button
          title={t.contact.send}
          icon="send"
          onPress={send}
          disabled={!canSend}
          loading={sending}
          style={styles.action}
        />
      </View>
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    portionRow: { flexDirection: 'row', gap: spacing.sm },
    labelField: { flex: 2 },
    gramsField: { flex: 1 },
    multiline: { minHeight: 90, paddingTop: spacing.md, textAlignVertical: 'top' },
    error: { fontSize: 13, color: colors.danger, marginBottom: spacing.sm },
    actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
    action: { flex: 1 },
    sent: { fontSize: 15, color: colors.textPrimary, marginTop: spacing.sm },
    spaced: { marginTop: spacing.md },
  });
