 import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { StatusBar } from 'expo-status-bar'; //  keep this import at the top
import { Ionicons } from '@expo/vector-icons';

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
  headerShown: false,

  tabBarActiveTintColor:
    colorScheme === "dark" ? "#18008da5" : "#18008da5",

  tabBarInactiveTintColor:
    colorScheme === "dark" ? "#FFFFFF" : "#555555",

  tabBarStyle: {
    position: "absolute",
     marginBottom: 30,
     marginHorizontal :10,
     borderTopWidth:0,
     left: 40,
     right: 40,
     height: 70,
     backgroundColor:
      colorScheme === "dark"
      ? "#3A3A3A"   // Dark grey
      : "#D9D9D9",  // Light grey
    borderRadius: 30,
     elevation: 0, // android shadow
     shadowColor: '#000', // ios shadow
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 5,


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
        name="search"  // Changed from "two" to "search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
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
  
