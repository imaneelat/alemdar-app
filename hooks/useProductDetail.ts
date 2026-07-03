import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import type { NormalizedProduct } from '@/lib/api-types';
import { queryKeys } from './queryKeys';

export function useProductDetail(section: string, id: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.productDetail(section, id ?? -1),
    queryFn: ({ signal }) =>
      apiGet<NormalizedProduct>(`/products/${id}`, { section }, signal),
    enabled: !!section && id != null && Number.isInteger(id),
  });
}
