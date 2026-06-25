import { useColorScheme } from '@/components/useColorScheme';
import { CartProvider } from '@/context/CartContext';
import { createQueryClient, persistOptions } from '@/lib/query-client';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

export {
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      <CartProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
          <Stack.Screen name="(tabs)"         options={{ headerShown: false }} />
          <Stack.Screen name="product-detail" options={{ headerShown: false }} />
          <Stack.Screen name="cart"           options={{ headerShown: false }} />
          <Stack.Screen name="help-center"    options={{ headerShown: false }} />
          <Stack.Screen name="help/faq"       options={{ headerShown: false }} />
          <Stack.Screen name="address-edit"   options={{ headerShown: false }} />
          <Stack.Screen name="modal"          options={{ presentation: 'modal' }} />
          </Stack>
        </ThemeProvider>
      </CartProvider>
    </PersistQueryClientProvider>
  );
}
