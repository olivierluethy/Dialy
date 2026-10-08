import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  Animated,
  StyleSheet,
  type PressableStateCallbackType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { useAppStore } from '@/state/store';
import { USE_NATIVE_DRIVER, useReducedMotion } from '@/components/FadeIn';
import type { LoginStackParamList, RootTabParamList } from '@/navigation/types';

/**
 * Apple-style global navigation: a slim top bar with the Dialy mark on the
 * left and a two-line "hamburger" on the right. The hamburger opens a
 * full-screen menu: large section links (staggered fade-in), a short list
 * of secondary links, and a light/dark toggle pinned bottom-right. Replaces
 * the bottom tab bar.
 */

interface MenuItem {
  label: string;
  tab: keyof RootTabParamList;
  screen?: keyof LoginStackParamList;
}

const MORE: MenuItem[] = [
  { label: 'Premium', tab: 'Login', screen: 'Paywall' },
  { label: 'Datenschutz', tab: 'Login', screen: 'Privacy' },
];

const itemKey = (item: MenuItem) => item.screen ?? item.tab;

export function AppHeader({ navigation, route }: BottomTabHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const user = useAppStore((s) => s.user);
  const [open, setOpen] = useState(false);

  // Section order is fixed (§3): Ratgeber, KH-Rechner, Tagebuch, Sport,
  // then Kontakt and Login (both screens of the Login stack).
  const sections: MenuItem[] = [
    { label: 'Ratgeber', tab: 'Ratgeber' },
    { label: 'KH-Rechner', tab: 'KHRechner' },
    { label: 'Tagebuch', tab: 'Tagebuch' },
    { label: 'Sport', tab: 'Sport' },
    { label: 'Kontakt', tab: 'Login', screen: 'Contact' },
    { label: user ? 'Konto' : 'Anmelden', tab: 'Login', screen: 'LoginHome' },
  ];

  // Highlight the section matching the focused screen; within the Login stack
  // that's Kontakt on its screen and Anmelden/Konto everywhere else.
  const focused = getFocusedRouteNameFromRoute(route);
  const inTab = sections.filter((s) => s.tab === route.name);
  const activeItem =
    inTab.find((s) => s.screen !== undefined && s.screen === focused) ??
    inTab.find((s) => s.screen === undefined || s.screen === 'LoginHome');
  const activeKey = activeItem ? itemKey(activeItem) : null;

  const go = (item: MenuItem) => {
    setOpen(false);
    if (item.screen) navigation.navigate(item.tab, { screen: item.screen });
    else navigation.navigate(item.tab);
  };

  return (
    <View style={[styles.bar, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <Pressable
          onPress={() => navigation.navigate('Ratgeber', { screen: 'RatgeberList' })}
          style={styles.brand}
          accessibilityRole="link"
          accessibilityLabel="Dialy – zum Ratgeber"
          hitSlop={8}
        >
          <Ionicons name="water" size={22} color={colors.accent} />
          <Text style={styles.brandText}>Dialy</Text>
        </Pressable>
        <Pressable
          onPress={() => setOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Menü öffnen"
          hitSlop={12}
        >
          <Ionicons name="reorder-two-outline" size={28} color={colors.textPrimary} />
        </Pressable>
      </View>

      <MenuOverlay
        visible={open}
        sections={sections}
        activeKey={activeKey}
        onSelect={go}
        onClose={() => setOpen(false)}
      />
    </View>
  );
}

function MenuOverlay({
  visible,
  sections,
  activeKey,
  onSelect,
  onClose,
}: {
  visible: boolean;
  sections: MenuItem[];
  activeKey: string | null;
  onSelect: (item: MenuItem) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { scheme, colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const nextScheme = scheme === 'dark' ? 'light' : 'dark';
  const reducedMotion = useReducedMotion();

  // One animated value per row (sections + secondary links), staggered in.
  const anims = useRef(
    Array.from({ length: sections.length + MORE.length }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (!visible) return;
    if (reducedMotion) {
      anims.forEach((a) => a.setValue(1));
      return;
    }
    anims.forEach((a) => a.setValue(0));
    Animated.stagger(
      35,
      anims.map((a) =>
        Animated.timing(a, { toValue: 1, duration: 280, useNativeDriver: USE_NATIVE_DRIVER })
      )
    ).start();
  }, [visible, anims, reducedMotion]);

  const rowAnim = (i: number) => {
    const a = anims[i]!;
    return {
      opacity: a,
      transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) }],
    };
  };

  // Like Apple's menu, a chevron appears on the row being pressed / hovered.
  const showChevron = (state: PressableStateCallbackType) =>
    state.pressed || Boolean((state as { hovered?: boolean }).hovered);

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={[styles.menu, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.menuTop}>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Menü schliessen"
            hitSlop={12}
          >
            <Ionicons name="close-outline" size={30} color={colors.textPrimary} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.menuList}>
          {sections.map((item, i) => {
            const active = itemKey(item) === activeKey;
            return (
              <Animated.View key={itemKey(item)} style={rowAnim(i)}>
                <Pressable
                  onPress={() => onSelect(item)}
                  style={styles.item}
                  accessibilityRole="link"
                  accessibilityState={{ selected: active }}
                >
                  {(state) => (
                    <>
                      <Text style={[styles.itemText, active && styles.itemActive]}>
                        {item.label}
                      </Text>
                      {showChevron(state) && (
                        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                      )}
                    </>
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
        </ScrollView>

        {/* Footer: secondary links bottom-left, appearance toggle bottom-right. */}
        <View style={styles.menuFooter}>
          <View>
            {MORE.map((item, i) => (
              <Animated.View key={item.label} style={rowAnim(sections.length + i)}>
                <Pressable
                  onPress={() => onSelect(item)}
                  style={styles.moreItem}
                  accessibilityRole="link"
                >
                  {(state) => (
                    <>
                      <Text style={styles.moreText}>{item.label}</Text>
                      {showChevron(state) && (
                        <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                      )}
                    </>
                  )}
                </Pressable>
              </Animated.View>
            ))}
          </View>
          <Pressable
            onPress={() => setThemeMode(nextScheme)}
            style={({ pressed }) => [styles.themeToggle, pressed && styles.themeTogglePressed]}
            accessibilityRole="button"
            accessibilityLabel={
              nextScheme === 'light' ? 'Zum hellen Modus wechseln' : 'Zum dunklen Modus wechseln'
            }
          >
            <Ionicons
              name={nextScheme === 'light' ? 'sunny-outline' : 'moon-outline'}
              size={18}
              color={colors.textPrimary}
            />
            <Text style={styles.themeToggleText}>
              {nextScheme === 'light' ? 'Hell' : 'Dunkel'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    bar: {
      backgroundColor: colors.bgBase,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    row: {
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
    },
    brand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    brandText: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
    menu: { flex: 1, backgroundColor: colors.bgBase },
    menuTop: {
      height: 48,
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
    },
    menuList: { paddingHorizontal: spacing.xxl * 2, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 6,
    },
    itemText: {
      fontSize: 28,
      fontWeight: '600',
      letterSpacing: -0.3,
      color: colors.textPrimary,
    },
    itemActive: { color: colors.accent },
    moreItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: 4,
    },
    moreText: { fontSize: 17, fontWeight: '600', color: colors.textSecondary },
    menuFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingLeft: spacing.xxl * 2,
      paddingRight: spacing.lg,
      paddingVertical: spacing.lg,
    },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.bgSurface,
    },
    themeTogglePressed: { backgroundColor: colors.bgSurfaceAlt },
    themeToggleText: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  });
