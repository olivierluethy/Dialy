import React, { useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
  type Theme as NavTheme,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import type { Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { fontAssets } from '@/theme/fonts';
import { useAppStore } from '@/state/store';
import { useBootstrap } from '@/state/useBootstrap';
import { RootNavigator } from '@/navigation/RootNavigator';

export default function App() {
  useBootstrap();
  const dataReady = useAppStore((s) => s.ready);
  // If the font fails to load, render anyway with the system font.
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const ready = dataReady && (fontsLoaded || fontError !== null);
  const { scheme, colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  // React Navigation theme bound to our tokens.
  const navTheme: NavTheme = useMemo(() => {
    const base = scheme === 'dark' ? NavDarkTheme : NavLightTheme;
    return {
      ...base,
      dark: scheme === 'dark',
      colors: {
        ...base.colors,
        primary: colors.accent,
        background: colors.bgBase,
        card: colors.bgSurface,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.accent,
      },
    };
  }, [scheme, colors]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        {ready ? (
          <NavigationContainer theme={navTheme}>
            <RootNavigator />
          </NavigationContainer>
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.accent} size="large" />
          </View>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bgBase },
    loading: {
      flex: 1,
      backgroundColor: colors.bgBase,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
