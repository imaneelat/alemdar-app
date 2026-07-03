import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { apiGet } from '@/lib/api-client';
import type { MainProduct, NormalizedProduct } from '@/lib/api-types';
import { queryKeys } from './queryKeys';

type SearchResponse = {
  q: string;
  section?: string;
  data: MainProduct[] | NormalizedProduct[];
};

type Options = { section?: string; limit?: number; enabled?: boolean };

/**
 * Search products by name/barcode.
 * Defaults to the master catalog; pass `section` to search a specific section.
 * Query is disabled until at least 2 characters are entered.
 * Debounced by 350ms so it doesn't fire a new request on every keystroke.
 */
export function useSearchProducts(q: string, options: Options = {}) {
  const { section, limit = 20, enabled = true } = options;
  const term = q.trim();

  const [debouncedTerm] = useDebounce(term, 350);

  return useQuery({
    queryKey: queryKeys.searchProducts(debouncedTerm, section, limit),
    queryFn: ({ signal }) =>
      apiGet<SearchResponse>('/products/search', { q: debouncedTerm, section, limit }, signal),
    enabled: enabled && debouncedTerm.length >= 2,
  });
}
