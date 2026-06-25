import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import type { MainProduct } from '@/lib/api-types';
import { queryKeys } from './queryKeys';

/** A single product from the master catalog (`main`) by id. */
export function useProduct(id: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.product(id ?? -1),
    queryFn: ({ signal }) => apiGet<MainProduct>(`/products/${id}`, undefined, signal),
    enabled: id != null && Number.isInteger(id),
  });
}
