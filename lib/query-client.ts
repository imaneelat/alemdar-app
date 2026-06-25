import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import type { PersistQueryClientOptions } from '@tanstack/react-query-persist-client';

/** How long persisted cache entries stay valid on disk (30 days). */
export const CACHE_MAX_AGE = 1000 * 60 * 60 * 24 * 30;

/**
 * Bump this string whenever the cached data shape changes; it invalidates any
 * previously persisted cache on the next app launch.
 */
const CACHE_BUSTER = 'v1';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Heavy caching: treat data as fresh for a day, keep it on disk for 30.
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: CACHE_MAX_AGE,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
    },
  });
}

/**
 * AsyncStorage-backed persister so the query cache survives app restarts /
 * offline. AsyncStorage works in Expo Go (no custom dev client required).
 */
export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'alemdar-react-query-cache',
  throttleTime: 1000,
});

export const persistOptions: Omit<PersistQueryClientOptions, 'queryClient'> = {
  persister: queryPersister,
  maxAge: CACHE_MAX_AGE,
  buster: CACHE_BUSTER,
  dehydrateOptions: {
    // Only persist successful queries.
    shouldDehydrateQuery: (query) => query.state.status === 'success',
  },
};
