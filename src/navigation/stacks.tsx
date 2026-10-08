import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@/theme/useTheme';
import { RatgeberScreen } from '@/screens/ratgeber/RatgeberScreen';
import { ArticleDetailScreen } from '@/screens/ratgeber/ArticleDetailScreen';
import { LoginScreen } from '@/screens/login/LoginScreen';
import { RegisterScreen } from '@/screens/login/RegisterScreen';
import { AccountView } from '@/screens/login/AccountView';
import { PaywallScreen } from '@/screens/paywall/PaywallScreen';
import { PrivacyScreen } from '@/screens/privacy/PrivacyScreen';
import type { LoginStackParamList, RatgeberStackParamList } from '@/navigation/types';

// Shared themed header styling for all stacks.
function useScreenOptions() {
  const { colors } = useTheme();
  return {
    headerStyle: { backgroundColor: colors.bgBase },
    headerTintColor: colors.textPrimary,
    headerTitleStyle: { color: colors.textPrimary },
    headerShadowVisible: false,
    contentStyle: { backgroundColor: colors.bgBase },
  } as const;
}

const RatgeberStack = createNativeStackNavigator<RatgeberStackParamList>();
export function RatgeberNavigator() {
  const screenOptions = useScreenOptions();
  return (
    <RatgeberStack.Navigator screenOptions={screenOptions}>
      <RatgeberStack.Screen
        name="RatgeberList"
        component={RatgeberScreen}
        options={{ headerShown: false }}
      />
      <RatgeberStack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{ title: 'Artikel', headerBackTitle: 'Zurück' }}
      />
    </RatgeberStack.Navigator>
  );
}

const LoginStack = createNativeStackNavigator<LoginStackParamList>();
export function LoginNavigator() {
  const screenOptions = useScreenOptions();
  return (
    <LoginStack.Navigator screenOptions={screenOptions}>
      <LoginStack.Screen
        name="LoginHome"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <LoginStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Registrieren', headerBackTitle: 'Zurück' }}
      />
      <LoginStack.Screen
        name="Account"
        component={AccountView}
        options={{ title: 'Konto' }}
      />
      <LoginStack.Screen
        name="Paywall"
        component={PaywallScreen}
        options={{ title: 'Premium', headerBackTitle: 'Zurück' }}
      />
      <LoginStack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ title: 'Datenschutz', headerBackTitle: 'Zurück' }}
      />
    </LoginStack.Navigator>
  );
}
