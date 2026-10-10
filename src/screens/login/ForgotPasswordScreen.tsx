import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { IconBubble } from '@/components/primitives';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { spacing, type Colors } from '@/theme/theme';
import { useThemedStyles } from '@/theme/useTheme';
import { authService } from '@/services/auth';

/**
 * "Passwort vergessen": sends a reset link by e-mail. The reply is the same
 * whether or not an account exists, so the form can't be used to probe
 * which addresses are registered.
 */
export function ForgotPasswordScreen() {
  const styles = useThemedStyles(makeStyles);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const available = authService.isConfigured();

  const send = async () => {
    setError(null);
    setLoading(true);
    const { error } = await authService.requestPasswordReset(email);
    setLoading(false);
    if (error) setError(error);
    else setSent(true);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <IconBubble name="key" size={26} />
        <Text style={styles.title}>Passwort vergessen</Text>
      </View>

      {!available ? (
        <Text style={styles.text}>
          Ohne Server kann das Passwort nicht zurückgesetzt werden: Lokale Konten haben
          keine bestätigte E-Mail-Adresse. Erstelle bei Bedarf ein neues Konto.
        </Text>
      ) : sent ? (
        <Text style={styles.text}>
          Wenn ein Konto mit dieser E-Mail-Adresse existiert, haben wir dir einen Link
          geschickt. Öffne ihn auf diesem Gerät, um ein neues Passwort festzulegen.
        </Text>
      ) : (
        <>
          <Text style={styles.text}>
            Gib die E-Mail-Adresse deines Kontos ein. Wir schicken dir einen Link, mit
            dem du ein neues Passwort festlegen kannst.
          </Text>
          <TextField
            label="E-Mail-Adresse"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            placeholder="name@beispiel.ch"
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <Button
            title="Link senden"
            icon="mail"
            onPress={send}
            loading={loading}
            disabled={!email.trim()}
            style={styles.btn}
          />
        </>
      )}
    </Screen>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    header: { alignItems: 'center', marginVertical: spacing.lg },
    title: { fontSize: 26, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.md },
    text: { fontSize: 15, color: colors.textSecondary, lineHeight: 21, marginBottom: spacing.lg },
    error: { color: colors.danger, fontSize: 14, marginBottom: spacing.md },
    btn: { marginTop: spacing.sm },
  });
