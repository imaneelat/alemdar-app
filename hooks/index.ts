/**
 * Data hooks for the frontend.
 *
 * The frontend should only ever consume these hooks -- never call the API or
 * database directly. Each hook wraps a single GET endpoint via TanStack Query.
 */
export { useHealth } from './useHealth';
export { useSections } from './useSections';
export { useSectionProducts } from './useSectionProducts';
export { useProducts, type ProductsFilters } from './useProducts';
export { useProduct } from './useProduct';
export { useProductDetail } from './useProductDetail';
export { useSearchProducts } from './useSearchProducts';
export { useCategories } from './useCategories';
export { useSectionCategories } from './useSectionCategories';
export { useSimilarProducts } from './useSimilarProducts';
export { useInvoices, type InvoicesFilters } from './useInvoices';
export { useInvoice } from './useInvoice';
export { usePrefetchImages } from './usePrefetchImages';

export { queryKeys } from './queryKeys';
export * from '@/lib/api-types';
