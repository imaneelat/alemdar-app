import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import type { UniversalSearchItem } from '@/lib/api-types';
import { queryKeys } from './queryKeys';

type SearchResponse = {
  q: string;
  data: UniversalSearchItem[];
};

type Options = { section?: string; limit?: number; enabled?: boolean };

/**
 * Search products through the live website search backend.
 * Query is disabled until at least 1 character is entered.
 */
export function useSearchProducts(q: string, options: Options = {}) {
  const { section, limit = 20, enabled = true } = options;
  const term = q.trim();
  return useQuery({
    queryKey: queryKeys.searchProducts(term, section, limit),
    queryFn: ({ signal }) =>
      apiGet<SearchResponse>(
        '/products/search',
        { q: term, section, limit },
        signal,
        { noStore: true }
      ),
    enabled: enabled && term.length >= 1,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: true,
  });
}
