import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // === THEME TOKENS ===
  const ACTIVE_COLOR   = '#FF6B00';   // orange 
  const INACTIVE_DARK  = '#8A8A9A';   // muted grey for dark mode
  const INACTIVE_LIGHT = '#6B6B80';   // slightly darker for light mode readability

  const BAR_BG_DARK    = '#0B1525';   // deep navy 
  const BAR_BG_LIGHT   = '#F0F0F5';   // soft off-white for light mode

  const SHADOW_DARK    = '#000000';
  const SHADOW_LIGHT   = '#AAAACC';

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor="transparent" translucent />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: ACTIVE_COLOR,
          tabBarInactiveTintColor: isDark ? INACTIVE_DARK : INACTIVE_LIGHT,

          tabBarStyle: {
           position: 'absolute',
           bottom: 28,
            left: 24,
            right: 24,
            height: 58,
            borderRadius: 29,
             
            
            backgroundColor: isDark ? BAR_BG_DARK : BAR_BG_LIGHT,

             borderWidth: 1,
            
            borderColor: isDark ? '#737390' : '#737390',

            // Shadow
            shadowColor: isDark ? SHADOW_DARK : SHADOW_LIGHT,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.5 : 0.2,
            shadowRadius: 16,
            elevation: 12, // Android
          },

          tabBarLabelStyle: {
  fontSize: 11,
  fontWeight: '500',
  marginBottom: 2,
},

          tabBarIconStyle: {
  marginTop: 2,
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
              <Ionicons name="home" size={22} color={color} />
            ),
            headerRight: () => (
              <Link href="/modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={22}
                      color={Colors[colorScheme ?? 'light'].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />

        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color }) => (
              <Ionicons name="search" size={22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="three"
          options={{
            title: 'Wishlist',
            tabBarIcon: ({ color }) => (
              <Ionicons name="heart-outline" size={22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="four"
          options={{
            title: 'Account',
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-outline" size={22} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
  
