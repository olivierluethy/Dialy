import React from 'react';
import { View, ScrollView, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  /** Access to the inner ScrollView, e.g. to scroll programmatically. */
  scrollRef?: React.Ref<ScrollView>;
}

/**
 * Base screen wrapper. Themed background + matching status-bar content.
 * The top safe-area inset is handled by the AppHeader above every screen.
 */
export function Screen({ children, scroll = true, contentStyle, scrollRef }: ScreenProps) {
  const { scheme } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      {scroll ? (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[styles.content, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.flex, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bgBase },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxl * 2,
    },
    flex: { flex: 1 },
  });
