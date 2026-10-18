import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { IconBubble, SectionLabel } from '@/components/primitives';
import { DiabetesTypeControl, LanguageControl, ThemeModeControl } from '@/components/SegmentedControl';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { spacing, type Colors } from '@/theme/theme';
import { useThemedStyles } from '@/theme/useTheme';
import { useAppStore } from '@/state/store';
import { useT } from '@/i18n';
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
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  const navigation = useNavigation<NativeStackNavigationProp<LoginStackParamList>>();
  const returnTo = useRoute<RouteProp<LoginStackParamList, 'LoginHome'>>().params?.returnTo;
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
    // Came from a locked tab: back there instead of the account view.
    if (returnTo) {
      navigation.setParams({ returnTo: undefined });
      navigation.getParent()?.navigate(returnTo);
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);
    const { error: authError } = await authService.signInWithGoogle();
    setLoading(false);
    if (authError) setError(authError);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <IconBubble name="person" size={28} />
        <Text style={styles.title}>{t.login.welcome}</Text>
      </View>

      <TextField
        label={t.common.emailLabel}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoCorrect={false}
        placeholder={t.common.emailPlaceholder}
      />
      <TextField
        label={t.common.passwordLabel}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
      />
      <Text
        style={styles.forgot}
        onPress={() => navigation.navigate('ForgotPassword')}
        accessibilityRole="link"
      >
        {t.login.forgot}
      </Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <Button title={t.login.signIn} onPress={signIn} loading={loading} style={styles.btn} />

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>{t.common.or}</Text>
        <View style={styles.divider} />
      </View>

      <Button
        title="Continue with Google"
        icon="google"
        variant="secondary"
        onPress={signInWithGoogle}
        loading={loading}
        style={styles.googleButton}
      />

      <Button
        title={t.login.createAccount}
        variant="secondary"
        onPress={() => navigation.navigate('Register', { returnTo })}
      />

      <Text style={styles.legalLinks}>
        <Text style={styles.legalLink} onPress={() => navigation.navigate('Privacy')}>
          {t.common.privacyPolicy}
        </Text>
        {'  ·  '}
        <Text style={styles.legalLink} onPress={() => navigation.navigate('Terms')}>
          {t.common.termsOfUse}
        </Text>
      </Text>

      <SectionLabel style={styles.appearanceLabel}>{t.common.diabetesType}</SectionLabel>
      <DiabetesTypeControl />
      <SectionLabel>{t.common.appearance}</SectionLabel>
      <ThemeModeControl />
      <SectionLabel>{t.common.language}</SectionLabel>
      <LanguageControl />
    </Screen>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    header: { alignItems: 'center', marginVertical: spacing.xl },
    title: {
      fontSize: 30,
      fontWeight: '700',
      color: colors.textPrimary,
      marginTop: spacing.md,
    },
    error: { color: colors.danger, fontSize: 14, marginBottom: spacing.md },
    forgot: {
      alignSelf: 'flex-end',
      color: colors.accent,
      fontSize: 14,
      fontWeight: '600',
      marginBottom: spacing.md,
    },
    btn: { marginTop: spacing.sm },
    dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
    divider: { flex: 1, height: 1, backgroundColor: colors.border },
    dividerText: { color: colors.textTertiary, marginHorizontal: spacing.md },
    googleButton: { marginBottom: spacing.md },
    legalLinks: { color: colors.textTertiary, textAlign: 'center', marginTop: spacing.xl },
    legalLink: { textDecorationLine: 'underline' },
    appearanceLabel: { marginTop: spacing.xxl },
  });
