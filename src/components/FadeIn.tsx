import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Platform,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

// Animated's native driver isn't available on web.
export const USE_NATIVE_DRIVER = Platform.OS !== 'web';

// Last known OS "reduce motion" setting, shared so new components start with it.
let reducedMotionCache = false;

/** True when the user asked the OS to reduce motion (animations then skip). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(reducedMotionCache);
  useEffect(() => {
    let active = true;
    const update = (v: boolean) => {
      reducedMotionCache = v;
      if (active) setReduced(v);
    };
    AccessibilityInfo.isReduceMotionEnabled().then(update).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', update);
    return () => {
      active = false;
      sub?.remove();
    };
  }, []);
  return reduced;
}

/** Delay for the n-th item of a staggered list; capped so long lists don't lag. */
export const staggerDelay = (index: number): number => Math.min(index, 8) * 50;

/**
 * Fades its children in while sliding them up a little, once on mount.
 * Give it a `key` to replay the animation for new content. Renders statically
 * when reduce motion is on.
 */
export function FadeIn({
  children,
  delay = 0,
  distance = 12,
  duration = 320,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(reduced ? 1 : 0)).current;

  useEffect(() => {
    if (reduced) {
      progress.setValue(1);
      return;
    }
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: USE_NATIVE_DRIVER,
    });
    anim.start();
    return () => anim.stop();
  }, [progress, delay, duration, reduced]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
