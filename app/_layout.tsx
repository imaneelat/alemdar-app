import { useColorScheme } from "@/components/useColorScheme";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LanguageProvider } from "@/lib/i18n";
import { createQueryClient, persistOptions } from "@/lib/query-client";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [queryClient] = useState(createQueryClient);
  const isDark = colorScheme === "dark";
  const appBackground = isDark ? "#0d0d0d" : "#ffffff";
  const navigationTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: appBackground }}>
      <LanguageProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={persistOptions}
        >
          <WishlistProvider>
            <CartProvider>
              <ThemeProvider
                value={{
                  ...navigationTheme,
                  colors: {
                    ...navigationTheme.colors,
                    background: appBackground,
                    card: appBackground,
                  },
                }}
              >
                <Stack
                  screenOptions={{
                    contentStyle: { backgroundColor: appBackground },
                  }}
                >
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="product-detail"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="cart" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="help-center"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="help/faq"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="address-edit"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="modal"
                    options={{ presentation: "modal" }}
                  />
                  <Stack.Screen
                    name="notifications"
                    options={{ headerShown: false }}
                  />
                </Stack>
              </ThemeProvider>
            </CartProvider>
          </WishlistProvider>
        </PersistQueryClientProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
