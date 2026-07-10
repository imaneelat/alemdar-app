import SplashScreen from '@/components/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const WELCOME_SEEN_KEY = 'welcome:seen';

export default function SplashRoute() {
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const seen = await AsyncStorage.getItem(WELCOME_SEEN_KEY);
      if (!cancelled) setHasSeenWelcome(seen === 'true');
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleContinue = useCallback(async () => {
    await AsyncStorage.setItem(WELCOME_SEEN_KEY, 'true');
    router.replace('/(tabs)');
  }, []);

  if (hasSeenWelcome === null) return null;
  if (hasSeenWelcome) return <Redirect href="/(tabs)" />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SplashScreen onCTAPress={handleContinue} />
    </GestureHandlerRootView>
  );
}
