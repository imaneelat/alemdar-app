import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/components/useColorScheme';
import { useState, useEffect } from 'react';
import Svg, { Path } from 'react-native-svg';
import { NAVBAR_V2_STYLE, NavbarV2Background } from '@/components/NavbarV2';
import PrivacySheet from '@/components/PrivacySheet';
import LanguageSheet from '@/components/LanguageSheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

let _set: ((s: string|null) => void)|null = null;
export const openSheet = (s: string) => _set?.(s);
export const closeSheets = () => _set?.(null);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [sheet, setSheet] = useState<string|null>(null);
  useEffect(() => { _set = setSheet; }, []);

  const ACTIVE_COLOR = '#FF6B00';
  const INACTIVE_DARK = '#8A8A9A';
  const INACTIVE_LIGHT = '#6B6B80';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor="transparent" translucent />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: ACTIVE_COLOR,
          tabBarInactiveTintColor: isDark ? INACTIVE_DARK : INACTIVE_LIGHT,
          tabBarShowLabel: false,
          tabBarBackground: NavbarV2Background(isDark ? 'dark' : 'light'),
          tabBarStyle: {
            ...NAVBAR_V2_STYLE,
            backgroundColor: 'transparent',
          },
          tabBarIconStyle: {
            marginTop: 8,
          },
          tabBarItemStyle: {
            borderRadius: 34,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <Svg width={30} height={35} viewBox="0 0 32 32">
                <Path d="M9.8 11.6l1.3-8.4h-6.6l-2.8 7.2c-0.1 0.3-0.1 0.5-0.1 0.8 0 1.8 1.8 3.2 4.1 3.2 2.1 0 3.8-1.2 4.1-2.8zM16 14.4c2.3 0 4.1-1.4 4.1-3.2 0-0.1 0-0.1 0-0.2l-0.8-7.8h-6.6l-0.8 7.8c0 0.1 0 0.1 0 0.2 0 1.8 1.8 3.2 4.1 3.2zM24 16.1v6.3h-16v-6.3c-0.7 0.3-1.5 0.4-2.3 0.4-0.3 0-0.6 0-0.9-0.1v10.2c0 1.2 1 2.2 2.2 2.2h18c1.2 0 2.2-1 2.2-2.2v-10.2c-0.3 0-0.6 0.1-0.9 0.1-0.8 0-1.6-0.1-2.3-0.4zM30.3 10.4l-2.8-7.2h-6.6l1.3 8.4c0.2 1.6 2 2.8 4.1 2.8 2.3 0 4.1-1.4 4.1-3.2 0-0.3 0-0.5-0.1-0.8z" fill={color} />
              </Svg>
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color }) => (
              <Svg width={30} height={35} viewBox="0 0 32 32">
                <Path d="M24 9.6a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0ZM15.5 4.1A3.2 3.2 0 0 1 17.8 3.2l7.8 0.1a3.2 3.2 0 0 1 3.2 3.1l0 8a3.2 3.2 0 0 1-0.9 2.2l-0.6 0.6a7.2 7.2 0 0 0-1.1-1.1l0.6-0.6a1.6 1.6 0 0 0 0.4-1.1l0-8a1.6 1.6 0 0 0-1.6-1.6L17.8 4.8a1.6 1.6 0 0 0-1.1 0.5L6 15.9a1.6 1.6 0 0 0 0 2.3l7.9 7.9a1.6 1.6 0 0 0 2.2 0.1c0.3 0.4 0.7 0.8 1.1 1.1a3.2 3.2 0 0 1-4.5-0.1L4.8 19.3a3.2 3.2 0 0 1 0-4.5l10.7-10.7Zm10.6 20.9a5.6 5.6 0 1 0-1.1 1.1l4 4.1a0.8 0.8 0 1 0 1.2-1.2l-4.1-4ZM25.6 21.6a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" fill={color} />
              </Svg>
            ),
          }}
        />
        <Tabs.Screen
          name="three"
          options={{
            title: 'Wishlist',
            tabBarIcon: ({ color }) => (
              <Svg width={30} height={35} viewBox="0 0 30.65625 30.65625">
                <Path d="M30.1 32H15.4a0.4 0.4 0 0 1-0.4-0.4v-0.1 0l0.8-17.2a0.4 0.4 0 0 1 0.5-0.4h13c0.2 0 0.4 0.2 0.4 0.4v0l0.9 17.2c0 0 0 0.1 0 0.1v0a0.4 0.4 0 0 1-0.5 0.4h0z m-12.1-14.5c0 0.6 0.4 1.1 1 1.3l0 0c0.5 2.2 2 3.8 3.9 3.9s3.4-1.6 3.8-3.9a1.4 1.4 0 1 0-1.2-0.2l0 0c-0.3 1.6-1.4 2.8-2.6 2.8s-2.3-1.2-2.7-2.8a1.4 1.4 0 1 0-2.2-1.1v0zM0.4 30.3a0.4 0.4 0 0 1-0.4-0.5v0L1.2 5.8a0.4 0.4 0 0 1 0.4-0.4h3C5.5 2.2 8 0 10.8 0s5.3 2.2 6.3 5.4h2.6c0.2 0 0.4 0.2 0.4 0.4v0l0.4 7h-4.2c-0.8 0-1.5 0.6-1.6 1.4v0l-0.8 16.1zM14.6 7.6a1.9 1.9 0 0 0 1 3.5 1.9 1.9 0 0 0 0.7-3.7l0 0C16 3.8 13.7 1.1 10.8 1.1S5.6 3.8 5.3 7.4a1.9 1.9 0 1 0 1.7 0.2l0 0c0.2-2.7 1.8-4.7 3.8-4.8s3.6 2.1 3.8 4.8zM8.7 5.4h4.2a2.5 2.5 0 0 0-2.1-1.5l0 0c-0.9 0.1-1.7 0.7-2 1.5l-0.1 0z m17.1 12.1a0.5 0.5 0 1 1 1 0 0.5 0.5 0 0 1-1 0z m-7 0a0.5 0.5 0 1 1 0.6 0.5 0.5 0.5 0 0 1-0.6-0.5z m-3.9-8.2a0.8 0.8 0 1 1 1.5 0 0.8 0.8 0 0 1-1.5 0z m-9.7 0a0.8 0.8 0 1 1 1.6 0 0.8 0.8 0 0 1-1.6 0z" fill={color} />
              </Svg>
            ),
          }}
        />
        <Tabs.Screen
          name="four"
          options={{
            title: 'Account',
            tabBarIcon: ({ color }) => (
              <Svg width={30} height={35} viewBox="0 0 32 32">
                <Path d="M14.4 3.2a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 0 0 0-12.8ZM9.6 9.6a4.8 4.8 0 1 1 9.6 0 4.8 4.8 0 0 1-9.6 0Zm-3.2 8A3.2 3.2 0 0 0 3.2 20.8c0 2.7 1.3 4.7 3.4 6.1C8.7 28.2 11.4 28.8 14.4 28.8h0.1a4 4 0 0 1-0.1-0.8V27.2c-2.8 0-5.2-0.6-6.9-1.7C5.8 24.5 4.8 22.9 4.8 20.8c0-0.9 0.7-1.6 1.6-1.6h8.8a4 4 0 0 1 2.5-1.5A4.5 4.5 0 0 1 17.7 17.6H6.4Zm12.8 0.8v0.8h-0.8a2.4 2.4 0 0 0-2.4 2.4v6.4a2.4 2.4 0 0 0 2.4 2.4h9.6a2.4 2.4 0 0 0 2.4-2.4v-6.4a2.4 2.4 0 0 0-2.4-2.4H27.2v-0.8a2.4 2.4 0 0 0-2.4-2.4h-3.2a2.4 2.4 0 0 0-2.4 2.4Zm2.4-0.8h3.2a0.8 0.8 0 0 1 0.8 0.8v0.8h-4.8v-0.8a0.8 0.8 0 0 1 0.8-0.8Z" fill={color} />
              </Svg>
            ),
          }}
        />
      </Tabs>
      <PrivacySheet visible={sheet === 'privacy'} onClose={closeSheets} />
      <LanguageSheet visible={sheet === 'language'} onClose={closeSheets} />
    </GestureHandlerRootView  >
  );
}
