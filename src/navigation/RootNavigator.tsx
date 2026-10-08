import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RatgeberNavigator, LoginNavigator } from '@/navigation/stacks';
import { AppHeader } from '@/navigation/AppHeader';
import { KHRechnerScreen } from '@/screens/khrechner/KHRechnerScreen';
import { TagebuchScreen } from '@/screens/tagebuch/TagebuchScreen';
import { SportScreen } from '@/screens/sport/SportScreen';
import type { RootTabParamList } from '@/navigation/types';

const Tab = createBottomTabNavigator<RootTabParamList>();

// The sections are still tabs internally (so cross-section links like
// navigate('Login', { screen: 'Register' }) keep working), but the bottom tab
// bar is hidden: navigation happens through the Apple-style AppHeader menu.
// Section order is fixed (§3): Ratgeber, KH-Rechner, Tagebuch, Sport, Login.
export function RootNavigator() {
  return (
    <Tab.Navigator
      tabBar={() => null}
      screenOptions={{ header: (props) => <AppHeader {...props} /> }}
    >
      <Tab.Screen name="Ratgeber" component={RatgeberNavigator} options={{ title: 'Ratgeber' }} />
      <Tab.Screen name="KHRechner" component={KHRechnerScreen} options={{ title: 'KH-Rechner' }} />
      <Tab.Screen name="Tagebuch" component={TagebuchScreen} options={{ title: 'Tagebuch' }} />
      <Tab.Screen name="Sport" component={SportScreen} options={{ title: 'Sport' }} />
      <Tab.Screen name="Login" component={LoginNavigator} options={{ title: 'Login' }} />
    </Tab.Navigator>
  );
}
