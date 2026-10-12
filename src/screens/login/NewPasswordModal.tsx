import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconBubble } from '@/components/primitives';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { spacing, type Colors } from '@/theme/theme';
import { useThemedStyles } from '@/theme/useTheme';
import { useAppStore } from '@/state/store';
import { authService } from '@/services/auth';
import { useT } from '@/i18n';

const MIN_PASSWORD = 6;

/**
 * Shown on top of the app after a password-reset link was opened: set the
 * new password (the link already signed the user in), or explain that the
 * link is no longer valid.
 */
export function NewPasswordModal() {
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  const insets = useSafeAreaInsets();
  const recovery = useAppStore((s) => s.passwordRecovery);
  const setRecovery = useAppStore((s) => s.setPasswordRecovery);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (recovery.state === 'idle') return;
    setPassword('');
    setConfirm('');
    setError(null);
    setDone(false);
  }, [recovery.state]);

  const close = () => setRecovery({ state: 'idle' });

  const save = async () => {
    setError(null);
    if (password.length < MIN_PASSWORD) {
      setError(t.newPassword.tooShort(MIN_PASSWORD));
      return;
    }
    if (password !== confirm) {
      setError(t.register.mismatch);
      return;
    }
    setLoading(true);
    const { error } = await authService.updatePassword(password);
    setLoading(false);
    if (error) setError(error);
    else setDone(true);
  };

  return (
    <Modal visible={recovery.state !== 'idle'} animationType="slide" onRequestClose={close}>
      <View style={[styles.screen, { paddingTop: insets.top + spacing.xl }]}>
        <View style={styles.header}>
          <IconBubble name="key" size={26} />
          <Text style={styles.title}>
            {recovery.state === 'expired' ? t.newPassword.invalidLink : t.newPassword.title}
          </Text>
        </View>

        {recovery.state === 'expired' ? (
          <>
            <Text style={styles.text}>{recovery.message}</Text>
            <Button title={t.common.ok} onPress={close} />
          </>
        ) : done ? (
          <>
            <Text style={styles.text}>{t.newPassword.changed}</Text>
            <Button title={t.common.next} onPress={close} />
          </>
        ) : (
          <>
            <Text style={styles.text}>{t.newPassword.intro}</Text>
            <TextField
              label={t.newPassword.label}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder={t.common.minChars(MIN_PASSWORD)}
            />
            <TextField
              label={t.common.confirmPasswordLabel}
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              placeholder="••••••••"
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <Button title={t.newPassword.save} onPress={save} loading={loading} />
            <Button title={t.common.later} variant="secondary" onPress={close} style={styles.later} />
          </>
        )}
      </View>
    </Modal>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bgBase, paddingHorizontal: spacing.lg },
    header: { alignItems: 'center', marginBottom: spacing.xl },
    title: { fontSize: 26, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.md },
    text: { fontSize: 15, color: colors.textSecondary, lineHeight: 21, marginBottom: spacing.lg },
    error: { color: colors.danger, fontSize: 14, marginBottom: spacing.md },
    later: { marginTop: spacing.md },
  });
