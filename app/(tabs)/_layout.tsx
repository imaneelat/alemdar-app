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
  headerShown: useClientOnlyValue(false, true),

  tabBarActiveTintColor:
    colorScheme === "dark" ? "#18008da5" : "#18008da5",

  tabBarInactiveTintColor:
    colorScheme === "dark" ? "#FFFFFF" : "#555555",

  tabBarStyle: {
    position: "absolute",
     marginBottom: 0,
     marginHorizontal :10,
     borderTopWidth:0,
    left: 20,
    right: 20,
    height: 70,
     // Background color
  backgroundColor:
    colorScheme === "dark"
      ? "#3A3A3A"   // Dark grey
      : "#D9D9D9",  // Light grey
    borderRadius: 30,
    
    elevation: 0,
  },

  tabBarLabelStyle: {
    fontSize: 14,
    fontWeight: "600",
  },
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
  
