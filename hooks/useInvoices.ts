import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import type { Invoice, Paginated } from '@/lib/api-types';
import { queryKeys } from './queryKeys';

export type InvoicesFilters = {
  status?: string;
  from?: string; // ISO date
  to?: string; // ISO date
  includeUndone?: boolean;
  page?: number;
  limit?: number;
};

/** Paginated invoices with optional status/date filters. */
export function useInvoices(filters: InvoicesFilters = {}) {
  const params = {
    status: filters.status,
    from: filters.from,
    to: filters.to,
    includeUndone: filters.includeUndone ? 1 : undefined,
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
  };
  return useQuery({
    queryKey: queryKeys.invoices(params),
    queryFn: ({ signal }) => apiGet<Paginated<Invoice>>('/invoices', params, signal),
  });
}
