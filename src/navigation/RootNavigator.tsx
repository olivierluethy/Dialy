import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/theme';
import { RatgeberNavigator, LoginNavigator } from '@/navigation/stacks';
import { KHRechnerScreen } from '@/screens/khrechner/KHRechnerScreen';
import { TagebuchScreen } from '@/screens/tagebuch/TagebuchScreen';
import { SportScreen } from '@/screens/sport/SportScreen';
import type { RootTabParamList } from '@/navigation/types';

const Tab = createBottomTabNavigator<RootTabParamList>();

// Tab order is fixed (§3): Ratgeber, KH-Rechner, Tagebuch, Sport, Login.
const ICONS: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
  Ratgeber: 'book',
  KHRechner: 'calculator',
  Tagebuch: 'calendar',
  Sport: 'walk',
  Login: 'person',
};

export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.bgSurface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Ratgeber" component={RatgeberNavigator} options={{ title: 'Ratgeber' }} />
      <Tab.Screen name="KHRechner" component={KHRechnerScreen} options={{ title: 'KH-Rechner' }} />
      <Tab.Screen name="Tagebuch" component={TagebuchScreen} options={{ title: 'Tagebuch' }} />
      <Tab.Screen name="Sport" component={SportScreen} options={{ title: 'Sport' }} />
      <Tab.Screen name="Login" component={LoginNavigator} options={{ title: 'Login' }} />
    </Tab.Navigator>
  );
}
