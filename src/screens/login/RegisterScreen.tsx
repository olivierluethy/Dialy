import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { IconBubble } from '@/components/primitives';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { colors, spacing } from '@/theme/theme';
import { useAppStore } from '@/state/store';
import { authService } from '@/services/auth';

export function RegisterScreen() {
  const navigation = useNavigation<any>();
  const setUser = useAppStore((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const register = async () => {
    setError(null);
    if (password !== confirm) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }
    if (!consent) {
      setError('Bitte stimme der Verarbeitung deiner Gesundheitsdaten zu.');
      return;
    }
    setLoading(true);
    const { user, error } = await authService.signUp(email.trim(), password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    setUser(user);
    navigation.goBack();
  };

  return (
    <Screen>
      <View style={styles.header}>
        <IconBubble name="person-add" size={26} />
        <Text style={styles.title}>Konto erstellen</Text>
        <Text style={styles.subtitle}>
          Kostenlos. Schaltet Tagebuch und Foto-Funktion frei.
        </Text>
      </View>

      <TextField
        label="E-Mail-Adresse"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoCorrect={false}
        placeholder="name@beispiel.ch"
      />
      <TextField
        label="Passwort"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="mind. 6 Zeichen"
      />
      <TextField
        label="Passwort bestätigen"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        placeholder="••••••••"
      />

      {/* Consent — health data is specially protected (revDSG / GDPR Art. 9). */}
      <Text
        style={[styles.consent, consent && styles.consentActive]}
        onPress={() => setConsent((c) => !c)}
      >
        {consent ? '☑' : '☐'}  Ich stimme zu, dass meine Eingaben (inkl.
        Gesundheitsdaten wie Blutzuckerwerte) zur Bereitstellung des Tagebuchs
        verarbeitet werden. Es findet keine Werbe- oder Analysenutzung statt.
      </Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <Button title="Registrieren" onPress={register} loading={loading} style={styles.btn} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginVertical: spacing.lg },
  title: { fontSize: 26, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.md },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 21,
  },
  consent: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  consentActive: { color: colors.textPrimary },
  error: { color: colors.danger, fontSize: 14, marginBottom: spacing.md },
  btn: { marginTop: spacing.sm },
});
