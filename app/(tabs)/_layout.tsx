 import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { StatusBar } from 'expo-status-bar'; // ✅ keep this import at the top

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      {/* ✅ StatusBar goes here, right after return ( */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} backgroundColor="#000" />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colorScheme === 'dark' ? '#808080' : '#000000',
          tabBarInactiveTintColor: colorScheme === 'dark' ? '#808080' : '#000000',
          headerShown: useClientOnlyValue(false, true),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            headerRight: () => (
              <Link href="/modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={25}
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
          name="two"
          options={{
            title: 'Search',
            tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          }}
        />
        <Tabs.Screen
          name="three"
          options={{
            title: 'Account',
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
  
