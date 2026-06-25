import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import type { CategoryCount } from '@/lib/api-types';
import { queryKeys } from './queryKeys';

type SectionCategoriesResponse = { section: string; data: CategoryCount[]; total: number };

/** Distinct categories (with counts) within a single section. */
export function useSectionCategories(section: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.sectionCategories(section ?? ''),
    queryFn: ({ signal }) =>
      apiGet<SectionCategoriesResponse>('/categories', { section: section! }, signal),
    enabled: !!section,
  });
}
