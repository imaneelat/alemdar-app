import { useCallback, useEffect, useRef } from 'react';
import { Alert, AppState, type AppStateStatus } from 'react-native';
import * as Updates from 'expo-updates';

const UPDATE_CHECK_MIN_INTERVAL_MS = 10 * 60 * 1000;

export function EasUpdateAlert() {
  const isCheckingRef = useRef(false);
  const alertVisibleRef = useRef(false);
  const lastCheckAtRef = useRef(0);

  const applyUpdate = useCallback(async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch {
      alertVisibleRef.current = false;
      Alert.alert('Update failed', 'Please close and reopen the app to try again.', [
        { text: 'OK' },
      ]);
    }
  }, []);

  const checkForUpdate = useCallback(async () => {
    if (!Updates.isEnabled || isCheckingRef.current || alertVisibleRef.current) {
      return;
    }

    const now = Date.now();
    if (now - lastCheckAtRef.current < UPDATE_CHECK_MIN_INTERVAL_MS) {
      return;
    }

    isCheckingRef.current = true;
    lastCheckAtRef.current = now;

    try {
      const update = await Updates.checkForUpdateAsync();
      if (!update.isAvailable) {
        return;
      }

      alertVisibleRef.current = true;
      Alert.alert(
        'New update available',
        'A new app update is ready. Update now to get the latest fixes.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              alertVisibleRef.current = false;
            },
          },
          {
            text: 'Update',
            onPress: () => {
              void applyUpdate();
            },
          },
        ],
      );
    } catch {
      // Release builds can fail this check offline or if EAS Update is unavailable.
    } finally {
      isCheckingRef.current = false;
    }
  }, [applyUpdate]);

  useEffect(() => {
    void checkForUpdate();

    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        void checkForUpdate();
      }
    });

    return () => subscription.remove();
  }, [checkForUpdate]);

  return null;
}
