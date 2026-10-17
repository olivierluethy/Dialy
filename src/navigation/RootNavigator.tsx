import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RatgeberNavigator, LoginNavigator } from '@/navigation/stacks';
import { AppHeader } from '@/navigation/AppHeader';
import { KHRechnerScreen } from '@/screens/khrechner/KHRechnerScreen';
import { TagebuchScreen } from '@/screens/tagebuch/TagebuchScreen';
import { SportScreen } from '@/screens/sport/SportScreen';
import { BlutzuckerScreen } from '@/screens/blutzucker/BlutzuckerScreen';
import type { RootTabParamList } from '@/navigation/types';
import { useT } from '@/i18n';

const Tab = createBottomTabNavigator<RootTabParamList>();

// The sections are still tabs internally (so cross-section links like
// navigate('Login', { screen: 'Register' }) keep working), but the bottom tab
// bar is hidden: navigation happens through the Apple-style AppHeader menu.
// Section order is fixed (§3): Ratgeber, KH-Rechner, Tagebuch, Sport, Login.
export function RootNavigator() {
  const t = useT();
  return (
    <Tab.Navigator
      tabBar={() => null}
      screenOptions={{ header: (props) => <AppHeader {...props} /> }}
    >
      <Tab.Screen name="Ratgeber" component={RatgeberNavigator} options={{ title: t.nav.ratgeber }} />
      <Tab.Screen name="KHRechner" component={KHRechnerScreen} options={{ title: t.nav.khrechner }} />
      <Tab.Screen name="Tagebuch" component={TagebuchScreen} options={{ title: t.nav.tagebuch }} />
      <Tab.Screen name="Blutzucker" component={BlutzuckerScreen} options={{ title: t.nav.blutzucker }} />
      <Tab.Screen name="Sport" component={SportScreen} options={{ title: t.nav.sport }} />
      <Tab.Screen name="Login" component={LoginNavigator} options={{ title: t.nav.login }} />
    </Tab.Navigator>
  );
}
