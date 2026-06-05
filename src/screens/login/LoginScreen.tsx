import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { IconBubble } from '@/components/primitives';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { colors, spacing } from '@/theme/theme';
import { useAppStore } from '@/state/store';
import { authService } from '@/services/auth';
import { syncEngine } from '@/sync/syncEngine';
import { AccountView } from '@/screens/login/AccountView';
import type { LoginStackParamList } from '@/navigation/types';

export function LoginScreen() {
  const user = useAppStore((s) => s.user);
  // When signed in, this tab shows the account state instead of the form.
  if (user) return <AccountView />;
  return <LoginForm />;
}

function LoginForm() {
  const navigation = useNavigation<NativeStackNavigationProp<LoginStackParamList>>();
  const setUser = useAppStore((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setError(null);
    setLoading(true);
    const { user, error } = await authService.signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    setUser(user);
    // Reconcile local + remote data right after login (best-effort).
    void syncEngine.syncNow();
  };

  return (
    <Screen>
      <View style={styles.header}>
        <IconBubble name="person" size={28} />
        <Text style={styles.title}>Willkommen</Text>
        <Text style={styles.subtitle}>
          Ratgeber & KH-Rechner ohne Konto verfügbar.{'\n'}
          Mit Konto: Tagebuch & Foto-Funktion.
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
        placeholder="••••••••"
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button title="Anmelden" onPress={signIn} loading={loading} style={styles.btn} />

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>oder</Text>
        <View style={styles.divider} />
      </View>

      <Button
        title="Konto erstellen"
        variant="secondary"
        onPress={() => navigation.navigate('Register')}
      />

      <Text
        style={styles.privacyLink}
        onPress={() => navigation.navigate('Privacy')}
      >
        Datenschutzerklärung
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginVertical: spacing.xl },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 21,
  },
  error: { color: colors.danger, fontSize: 14, marginBottom: spacing.md },
  btn: { marginTop: spacing.sm },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xl },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textTertiary, marginHorizontal: spacing.md },
  privacyLink: {
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.xl,
    textDecorationLine: 'underline',
  },
});
