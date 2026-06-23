import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  Text,
} from 'react-native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Config ───────────────────────────────────────────────────────
const AMBER = '#f5a623';

const TABS = [
  { name: 'index',  icon: 'home-outline',   iconActive: 'home',    label: 'Home'     },
  { name: 'search', icon: 'search-outline', iconActive: 'search',  label: 'Search'   },
  { name: 'three',  icon: 'heart-outline',  iconActive: 'heart',   label: 'Wishlist', badge: true },
  { name: 'four',   icon: 'person-outline', iconActive: 'person',  label: 'Account'  },
] as const;

// ─── Single Tab Button ────────────────────────────────────────────
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
  // pill width: expands from 44 → 110 when active
  const pillW   = useRef(new Animated.Value(isActive ? 110 : 44)).current;
  const pillOp  = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const labelOp = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const scale   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.spring(pillW,  { toValue: 110, useNativeDriver: false, speed: 26, bounciness: 10 }),
        Animated.timing(pillOp, { toValue: 1, duration: 200, useNativeDriver: false }),
        Animated.timing(labelOp,{ toValue: 1, duration: 220, delay: 80, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(scale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
          Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 14 }),
        ]),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(pillW,  { toValue: 44, useNativeDriver: false, speed: 26, bounciness: 8 }),
        Animated.timing(pillOp, { toValue: 0, duration: 160, useNativeDriver: false }),
        Animated.timing(labelOp,{ toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  }, [isActive]);

  const iconColor = isActive
    ? '#0C0E14'
    : isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.28)';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.tabOuter}
      accessibilityLabel={tab.label}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
    >
      {/* Expanding amber pill */}
      <Animated.View
        style={[
          styles.pill,
          {
            width: pillW,
            backgroundColor: pillOp.interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(245,166,35,0)', AMBER],
            }),
          },
        ]}
      >
        {/* Icon */}
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons
            name={(isActive ? tab.iconActive : tab.icon) as any}
            size={20}
            color={iconColor}
          />
          {/* Badge pip */}
          {'badge' in tab && tab.badge && !isActive && (
            <View style={[
              styles.pip,
              { borderColor: isDark ? '#111520' : '#EEEEF6' }
            ]} />
          )}
        </Animated.View>

        {/* Label — fades in alongside pill */}
        <Animated.Text
          style={[styles.label, { opacity: labelOp }]}
          numberOfLines={1}
        >
          {tab.label}
        </Animated.Text>
      </Animated.View>
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
    <View
      style={[
        styles.barWrapper,
        { bottom: Math.max(insets.bottom + 10, 20) },
      ]}
    >
      <View
        style={[
          styles.bar,
          { backgroundColor: BAR_BG, borderColor: BAR_BORDER },
        ]}
      >
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
  barWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 62,
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
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
  tabOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 62,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 20,
    gap: 6,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0C0E14',
    letterSpacing: 0.2,
  },
  pip: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: AMBER,
    borderWidth: 2,
  },
});
