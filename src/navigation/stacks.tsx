import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@/theme/useTheme';
import { fontFor } from '@/theme/fonts';
import { useT } from '@/i18n';
import { RatgeberScreen } from '@/screens/ratgeber/RatgeberScreen';
import { ArticleDetailScreen } from '@/screens/ratgeber/ArticleDetailScreen';
import { LoginScreen } from '@/screens/login/LoginScreen';
import { RegisterScreen } from '@/screens/login/RegisterScreen';
import { AccountView } from '@/screens/login/AccountView';
import { PaywallScreen } from '@/screens/paywall/PaywallScreen';
import { PrivacyScreen } from '@/screens/privacy/PrivacyScreen';
import { TermsScreen } from '@/screens/terms/TermsScreen';
import { ContactScreen } from '@/screens/contact/ContactScreen';
import { ForgotPasswordScreen } from '@/screens/login/ForgotPasswordScreen';
import type { LoginStackParamList, RatgeberStackParamList } from '@/navigation/types';

// Shared themed header styling for all stacks.
function useScreenOptions() {
  const { colors } = useTheme();
  return {
    headerStyle: { backgroundColor: colors.bgBase },
    headerTintColor: colors.textPrimary,
    headerTitleStyle: { color: colors.textPrimary, ...fontFor('600') },
    headerShadowVisible: false,
    contentStyle: { backgroundColor: colors.bgBase },
  } as const;
}

const RatgeberStack = createNativeStackNavigator<RatgeberStackParamList>();
export function RatgeberNavigator() {
  const screenOptions = useScreenOptions();
  const t = useT();
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
        options={{ title: t.nav.article, headerBackTitle: t.common.back }}
      />
    </RatgeberStack.Navigator>
  );
}

const LoginStack = createNativeStackNavigator<LoginStackParamList>();
export function LoginNavigator() {
  const screenOptions = useScreenOptions();
  const t = useT();
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
        options={{ title: t.nav.register, headerBackTitle: t.common.back }}
      />
      <LoginStack.Screen
        name="Account"
        component={AccountView}
        options={{ title: t.nav.settings }}
      />
      <LoginStack.Screen
        name="Paywall"
        component={PaywallScreen}
        options={{ title: t.nav.premium, headerBackTitle: t.common.back }}
      />
      <LoginStack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ title: t.nav.privacy, headerBackTitle: t.common.back }}
      />
      <LoginStack.Screen
        name="Terms"
        component={TermsScreen}
        options={{ title: t.nav.terms, headerBackTitle: t.common.back }}
      />
      <LoginStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: t.nav.forgotPassword, headerBackTitle: t.common.back }}
      />
      <LoginStack.Screen
        name="Contact"
        component={ContactScreen}
        options={{ title: t.nav.contact, headerBackTitle: t.common.back }}
      />
    </LoginStack.Navigator>
  );
}
