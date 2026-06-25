import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import type { SectionCount } from '@/lib/api-types';
import { queryKeys } from './queryKeys';

type SectionsResponse = { data: SectionCount[]; total: number };

/** Lists all product sections with their row counts. */
export function useSections() {
  return useQuery({
    queryKey: queryKeys.sections(),
    queryFn: ({ signal }) => apiGet<SectionsResponse>('/sections', undefined, signal),
  });
}
