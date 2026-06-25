import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import type { CategoryCount } from '@/lib/api-types';
import { queryKeys } from './queryKeys';

type CategoriesResponse = { data: CategoryCount[]; total: number };

/** Distinct top-level categories from the master catalog with product counts. */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: ({ signal }) => apiGet<CategoriesResponse>('/categories', undefined, signal),
  });
}
