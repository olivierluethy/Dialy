import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { IconBubble } from '@/components/primitives';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { useAppStore } from '@/state/store';
import { authService } from '@/services/auth';
import { useT } from '@/i18n';
import { TERMS_VERSION } from '@/legal/terms';
import type { LoginStackParamList } from '@/navigation/types';

export function RegisterScreen() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  const navigation = useNavigation<any>();
  const returnTo = useRoute<RouteProp<LoginStackParamList, 'Register'>>().params?.returnTo;
  const setUser = useAppStore((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const register = async () => {
    setError(null);
    setNotice(null);
    if (password !== confirm) {
      setError(t.register.mismatch);
      return;
    }
    if (!consent) {
      setError(t.register.consentMissing);
      return;
    }
    setLoading(true);
    const { user, error, notice } = await authService.signUp(email.trim(), password, TERMS_VERSION);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    // Account created but not active yet (e-mail confirmation pending).
    if (notice) {
      setNotice(notice);
      return;
    }
    setUser(user);
    navigation.goBack();
    // Came from a locked tab: back there instead of the account view.
    if (returnTo) navigation.getParent()?.navigate(returnTo);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <IconBubble name="personAdd" size={26} />
        <Text style={styles.title}>{t.register.title}</Text>
        <Text style={styles.subtitle}>{t.register.subtitle}</Text>
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
        placeholder={t.common.minChars(6)}
      />
      <TextField
        label={t.common.confirmPasswordLabel}
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        placeholder="••••••••"
      />

      {/* Consent — terms of use plus health data, which is specially protected
          (revDSG / GDPR Art. 9). The accepted terms version is stored at sign-up. */}
      <Pressable
        style={styles.consentRow}
        onPress={() => setConsent((c) => !c)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: consent }}
        accessibilityLabel={t.register.consent}
      >
        <Icon name={consent ? 'checkboxOn' : 'checkboxOff'} size={22} color={consent ? colors.accent : colors.textTertiary} />
        <Text style={[styles.consent, consent && styles.consentActive]}>{t.register.consent}</Text>
      </Pressable>
      <Text style={styles.legalLinks}>
        <Text style={styles.legalLink} onPress={() => navigation.navigate('Terms')}>
          {t.common.termsOfUse}
        </Text>
        {'  ·  '}
        <Text style={styles.legalLink} onPress={() => navigation.navigate('Privacy')}>
          {t.common.privacyPolicy}
        </Text>
      </Text>

      {error && <Text style={styles.error}>{error}</Text>}
      {notice && <Text style={styles.notice}>{notice}</Text>}

      <Button title={t.register.submit} onPress={register} loading={loading} style={styles.btn} />
    </Screen>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    header: { alignItems: 'center', marginVertical: spacing.lg },
    title: { fontSize: 26, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.md },
    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.sm,
      lineHeight: 21,
    },
    consentRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      minHeight: 44,
      marginBottom: spacing.md,
    },
    consent: {
      flex: 1,
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    consentActive: { color: colors.textPrimary },
    legalLinks: { fontSize: 14, color: colors.textTertiary, marginBottom: spacing.md },
    legalLink: { color: colors.accent, textDecorationLine: 'underline' },
    error: { color: colors.danger, fontSize: 14, marginBottom: spacing.md },
    notice: { color: colors.textPrimary, fontSize: 14, lineHeight: 20, marginBottom: spacing.md },
    btn: { marginTop: spacing.sm },
  });
