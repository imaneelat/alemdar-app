import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import type { MainProduct, Paginated } from '@/lib/api-types';
import { queryKeys } from './queryKeys';

export type ProductsFilters = {
  category?: string;
  sub_category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'id_asc' | 'id_desc';
  page?: number;
  limit?: number;
};

/** Paginated, filterable list from the master catalog (`main`). */
export function useProducts(filters: ProductsFilters = {}) {
  const params = {
    category: filters.category,
    sub_category: filters.sub_category,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    inStock: filters.inStock ? 1 : undefined,
    sort: filters.sort,
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
  };
  return useQuery({
    queryKey: queryKeys.products(params),
    queryFn: ({ signal }) => apiGet<Paginated<MainProduct>>('/products', params, signal),
  });
}
