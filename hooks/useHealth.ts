import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import type { HealthResponse } from '@/lib/api-types';
import { queryKeys } from './queryKeys';

/** Checks API + database connectivity. */
export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health(),
    queryFn: ({ signal }) => apiGet<HealthResponse>('/health', undefined, signal),
  });
}
