import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Config ───────────────────────────────────────────────────────
const AMBER    = '#f5a623';
const TAB_W    = 72; // width per tab slot
const BAR_H    = 62;
const H_PAD    = 12; // horizontal padding inside bar

const TABS = [
  { name: 'index',  icon: 'home-outline',   iconActive: 'home',   label: 'Home'     },
  { name: 'search', icon: 'search-outline', iconActive: 'search', label: 'Search'   },
  { name: 'three',  icon: 'heart-outline',  iconActive: 'heart',  label: 'Wishlist', badge: true },
  { name: 'four',   icon: 'person-outline', iconActive: 'person', label: 'Account'  },
] as const;

// ─── Sliding indicator ────────────────────────────────────────────
function Indicator({ activeIndex, isDark }: { activeIndex: number; isDark: boolean }) {
  const x = useRef(new Animated.Value(H_PAD + activeIndex * TAB_W + TAB_W / 2 - 14)).current;

  useEffect(() => {
    const target = H_PAD + activeIndex * TAB_W + TAB_W / 2 - 14;
    Animated.spring(x, {
      toValue: target,
      useNativeDriver: true,
      speed: 22,
      bounciness: 12,
    }).start();
  }, [activeIndex]);

  return (
    <Animated.View
      style={[
        styles.indicator,
        { transform: [{ translateX: x }] },
      ]}
    />
  );
}

// ─── Tab Button ───────────────────────────────────────────────────
function TabBtn({
  tab,
  isActive,
  onPress,
  isDark,
}: {
  tab: typeof TABS[number];
  isActive: boolean;
  onPress: () => void;
  isDark: boolean;
}) {
  const translateY = useRef(new Animated.Value(0)).current;
  const scale      = useRef(new Animated.Value(1)).current;
  const dotScale   = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const dotOp      = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: -4, useNativeDriver: true, speed: 28, bounciness: 14 }),
        Animated.spring(scale,      { toValue: 1.18, useNativeDriver: true, speed: 28, bounciness: 14 }),
        Animated.spring(dotScale,   { toValue: 1, useNativeDriver: true, speed: 28, bounciness: 16 }),
        Animated.timing(dotOp,      { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 28, bounciness: 8 }),
        Animated.spring(scale,      { toValue: 1, useNativeDriver: true, speed: 28, bounciness: 8 }),
        Animated.spring(dotScale,   { toValue: 0, useNativeDriver: true, speed: 28, bounciness: 8 }),
        Animated.timing(dotOp,      { toValue: 0, duration: 120, useNativeDriver: true }),
      ]).start();
    }
  }, [isActive]);

  const iconColor = isActive
    ? AMBER
    : isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.25)';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.tabBtn}
      accessibilityLabel={tab.label}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
    >
      {/* Icon lifts up when active */}
      <Animated.View style={{ transform: [{ translateY }, { scale }] }}>
        <Ionicons
          name={(isActive ? tab.iconActive : tab.icon) as any}
          size={22}
          color={iconColor}
        />
        {/* Notification badge */}
        {'badge' in tab && tab.badge && !isActive && (
          <View style={[
            styles.pip,
            { borderColor: isDark ? '#111520' : '#EEEEF6' },
          ]} />
        )}
      </Animated.View>

      {/* Dot below icon */}
      <Animated.View
        style={[
          styles.dot,
          { opacity: dotOp, transform: [{ scale: dotScale }] },
        ]}
      />
    </TouchableOpacity>
  );
}

// ─── Custom Tab Bar ───────────────────────────────────────────────
function CustomTabBar({ state, navigation }: any) {
  const scheme = useColorScheme();
  const isDark  = scheme === 'dark';
  const insets  = useSafeAreaInsets();

  const BAR_BG     = isDark ? '#111520' : '#EEEEF6';
  const BAR_BORDER = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';

  return (
    <View style={[styles.wrapper, { bottom: Math.max(insets.bottom + 10, 20) }]}>
      <View style={[styles.bar, { backgroundColor: BAR_BG, borderColor: BAR_BORDER }]}>

        {/* Sliding amber bar indicator */}
        <Indicator activeIndex={state.index} isDark={isDark} />

        {state.routes.map((route: any, index: number) => {
          const tab      = TABS[index];
          const isActive = state.index === index;

          const onPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isActive && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabBtn
              key={route.key}
              tab={tab}
              isActive={isActive}
              onPress={onPress}
              isDark={isDark}
            />
          );
        })}
      </View>
    </View>
  );
}

// ─── Root Layout ─────────────────────────────────────────────────
export default function TabLayout() {
  const scheme = useColorScheme();
  const isDark  = scheme === 'dark';

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor="transparent" translucent />
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index"  />
        <Tabs.Screen name="search" />
        <Tabs.Screen name="three"  />
        <Tabs.Screen name="four"   />
      </Tabs>
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: BAR_H,
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: H_PAD,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 18,
      },
      android: { elevation: 16 },
    }),
  },
  // sliding top bar
  indicator: {
    position: 'absolute',
    top: 0,
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: AMBER,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: BAR_H,
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: AMBER,
  },
  pip: {
    position: 'absolute',
    top: -2,
    right: -5,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: AMBER,
    borderWidth: 2,
  },
});
