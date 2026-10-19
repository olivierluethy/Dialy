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
import { Icon, type IconName } from '@/components/Icon';
import type { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { useAppStore } from '@/state/store';
import { useT, type Dict } from '@/i18n';
import { USE_NATIVE_DRIVER, useReducedMotion } from '@/components/FadeIn';
import type { LoginStackParamList, RootTabParamList } from '@/navigation/types';

/**
 * Apple-style global navigation: a slim top bar with the Dialy mark on the
 * left and a two-line "hamburger" on the right. The hamburger opens a
 * full-screen menu: large section links in titled groups (staggered
 * fade-in) and a light/dark toggle pinned bottom-right. Replaces the bottom
 * tab bar.
 */

interface MenuItem {
  label: string;
  tab: keyof RootTabParamList;
  screen?: keyof LoginStackParamList;
  /** Overlay group: the app sections (default), account or information. */
  group?: 'account' | 'info';
}

/** Icon + title heading each overlay group. */
const groupTitle = (t: Dict, group: MenuItem['group']): { icon: IconName; label: string } => {
  if (group === 'account') return { icon: 'settings', label: t.nav.groupSettings };
  if (group === 'info') return { icon: 'info', label: t.nav.groupInfo };
  return { icon: 'brand', label: t.nav.groupDiabetes };
};

const itemKey = (item: MenuItem) => item.screen ?? item.tab;

export function AppHeader({ navigation, route }: BottomTabHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const user = useAppStore((s) => s.user);
  const t = useT();
  const [open, setOpen] = useState(false);

  // Section order is fixed (§3): Ratgeber, KH-Rechner, Tagebuch, Sport,
  // then Login, Kontakt, Datenschutz and Nutzungsbedingungen (all screens
  // of the Login stack).
  const sections: MenuItem[] = [
    { label: t.nav.ratgeber, tab: 'Ratgeber' },
    { label: t.nav.khrechner, tab: 'KHRechner' },
    { label: t.nav.tagebuch, tab: 'Tagebuch' },
    { label: t.nav.blutzucker, tab: 'Blutzucker' },
    { label: t.nav.sport, tab: 'Sport' },
    { label: user ? t.nav.settings : t.nav.login, tab: 'Login', screen: 'LoginHome', group: 'account' },
    { label: t.nav.contact, tab: 'Login', screen: 'Contact', group: 'info' },
    { label: t.nav.privacy, tab: 'Login', screen: 'Privacy', group: 'info' },
    { label: t.nav.terms, tab: 'Login', screen: 'Terms', group: 'info' },
  ];

  // Highlight the section matching the focused screen; within the Login stack
  // that's the matching link on its screen and Anmelden/Einstellungen
  // everywhere else.
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
          accessibilityLabel={t.nav.brandA11y}
          hitSlop={8}
        >
          <Icon name="brand" size={22} color={colors.accent} />
          <Text style={styles.brandText}>Dialy</Text>
        </Pressable>
        <Pressable
          onPress={() => setOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={t.nav.openMenu}
          hitSlop={12}
        >
          <Icon name="menu" size={28} color={colors.textPrimary} />
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
  const t = useT();
  const nextScheme = scheme === 'dark' ? 'light' : 'dark';
  const reducedMotion = useReducedMotion();

  // One animated value per section row, staggered in.
  const anims = useRef(
    Array.from({ length: sections.length }, () => new Animated.Value(0))
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
            accessibilityLabel={t.nav.closeMenu}
            hitSlop={12}
          >
            <Icon name="close" size={30} color={colors.textPrimary} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.menuList}>
          {sections.map((item, i) => {
            const active = itemKey(item) === activeKey;
            // An icon + title heads each group.
            const groupStart = i === 0 || sections[i - 1]!.group !== item.group;
            const title = groupTitle(t, item.group);
            return (
              <Animated.View key={itemKey(item)} style={rowAnim(i)}>
                {groupStart && (
                  <View
                    style={[styles.groupTitle, i > 0 && styles.groupTitleSpaced]}
                    accessibilityRole="header"
                  >
                    <Icon name={title.icon} size={20} color={colors.textPrimary} />
                    <Text style={styles.groupTitleText}>{title.label}</Text>
                  </View>
                )}
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
                        <Icon name="chevronRight" size={20} color={colors.textTertiary} />
                      )}
                    </>
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
        </ScrollView>

        {/* Footer: appearance toggle bottom-right. */}
        <View style={styles.menuFooter}>
          <Pressable
            onPress={() => setThemeMode(nextScheme)}
            style={({ pressed }) => [styles.themeToggle, pressed && styles.themeTogglePressed]}
            accessibilityRole="button"
            accessibilityLabel={nextScheme === 'light' ? t.nav.toLight : t.nav.toDark}
          >
            <Icon
              name={nextScheme === 'light' ? 'sun' : 'moon'}
              size={18}
              color={colors.textPrimary}
            />
            <Text style={styles.themeToggleText}>
              {nextScheme === 'light' ? t.theme.light : t.theme.dark}
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
    groupTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    groupTitleSpaced: { marginTop: spacing.xxl },
    groupTitleText: {
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colors.textPrimary,
    },
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
    menuFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: spacing.lg,
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
