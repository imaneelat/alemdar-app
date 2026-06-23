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
  { name: 'index',  icon: 'home-outline',   iconActive: 'home',   label: 'Home'     },
  { name: 'search', icon: 'search-outline', iconActive: 'search', label: 'Search'   },
  { name: 'three',  icon: 'heart-outline',  iconActive: 'heart',  label: 'Wishlist', badge: true },
  { name: 'four',   icon: 'person-outline', iconActive: 'person', label: 'Account'  },
] as const;

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
  const labelOp    = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const labelY     = useRef(new Animated.Value(isActive ? 0 : 6)).current;
  const iconScale  = useRef(new Animated.Value(isActive ? 1 : 1)).current;
  const iconY      = useRef(new Animated.Value(isActive ? -4 : 4)).current;
  const dotOp      = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        // icon slides up
        Animated.spring(iconY,    { toValue: -4, useNativeDriver: true, speed: 26, bounciness: 10 }),
        Animated.spring(iconScale,{ toValue: 1.08, useNativeDriver: true, speed: 26, bounciness: 10 }),
        // label fades + slides up into view
        Animated.spring(labelY,   { toValue: 0, useNativeDriver: true, speed: 26, bounciness: 10 }),
        Animated.timing(labelOp,  { toValue: 1, duration: 200, useNativeDriver: true }),
        // amber dot under label
        Animated.timing(dotOp,    { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(iconY,    { toValue: 4, useNativeDriver: true, speed: 26, bounciness: 8 }),
        Animated.spring(iconScale,{ toValue: 1, useNativeDriver: true, speed: 26, bounciness: 8 }),
        Animated.spring(labelY,   { toValue: 6, useNativeDriver: true, speed: 26, bounciness: 8 }),
        Animated.timing(labelOp,  { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.timing(dotOp,    { toValue: 0, duration: 120, useNativeDriver: true }),
      ]).start();
    }
  }, [isActive]);

  const iconColor = isActive ? '#ffffff' : 'rgba(255,255,255,0.38)';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.tabBtn}
      accessibilityLabel={tab.label}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
    >
      {/* Icon */}
      <Animated.View style={{ transform: [{ translateY: iconY }, { scale: iconScale }] }}>
        <Ionicons
          name={(isActive ? tab.iconActive : tab.icon) as any}
          size={24}
          color={iconColor}
        />
        {'badge' in tab && tab.badge && !isActive && (
          <View style={styles.pip} />
        )}
      </Animated.View>

      {/* Label — always rendered, fades in/out like Netflix */}
      <Animated.Text
        style={[
          styles.label,
          {
            opacity: labelOp,
            color: isActive ? '#ffffff' : 'rgba(255,255,255,0.38)',
            transform: [{ translateY: labelY }],
          },
        ]}
        numberOfLines={1}
      >
        {tab.label}
      </Animated.Text>

      {/* Amber dot at very bottom */}
      <Animated.View style={[styles.dot, { opacity: dotOp }]} />
    </TouchableOpacity>
  );
}

// ─── Custom Tab Bar ───────────────────────────────────────────────
function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {/* Top hairline border */}
      <View style={styles.topLine} />

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
            isDark={true}
          />
        );
      })}
    </View>
  );
}

// ─── Root Layout ─────────────────────────────────────────────────
export default function TabLayout() {
  const scheme = useColorScheme();
  const isDark  = scheme === 'dark';

  return (
    <>
      <StatusBar style="light" backgroundColor="transparent" translucent />
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
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    backgroundColor: '#000000',
    paddingTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
      },
      android: { elevation: 20 },
    }),
  },
  topLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
    height: 54,
    gap: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  dot: {
    position: 'absolute',
    bottom: 0,
    width: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: AMBER,
  },
  pip: {
    position: 'absolute',
    top: -1,
    right: -5,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: AMBER,
    borderWidth: 2,
    borderColor: '#000',
  },
});
