import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { BlurView } from 'expo-blur';

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === "dark" ? "#808080" : "#000000",
        tabBarInactiveTintColor: colorScheme === "dark" ? "#808080" : "#000000",
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      
         tabBarBackground: () => (
      <BlurView
        tint={colorScheme === "dark" ? "dark" : "light"} // frosted look
        intensity={50} // adjust blur strength (0–100)
        style={{ flex: 1 }}
      />
    ),

      }}
    >
     <Tabs.Screen
         name="index"
          options={{
         headerShown: false, // ww hides the default header bar
         tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,


  }}
/>

      <Tabs.Screen
        name="two"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />

      <Tabs.Screen
        name="three"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}  
