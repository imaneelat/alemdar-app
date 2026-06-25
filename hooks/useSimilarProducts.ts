import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import type { NormalizedProduct } from '@/lib/api-types';
import { queryKeys } from './queryKeys';

type SimilarsResponse = { section: string; id: number; data: NormalizedProduct[] };

/** Related products for a given product, via the product_similars table. */
export function useSimilarProducts(section: string, id: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.similars(section, id ?? -1),
    queryFn: ({ signal }) =>
      apiGet<SimilarsResponse>('/similars', { section, id: id! }, signal),
    enabled: !!section && id != null && Number.isInteger(id),
  });
}
