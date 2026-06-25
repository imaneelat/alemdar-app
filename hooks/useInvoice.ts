import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import type { InvoiceWithItems } from '@/lib/api-types';
import { queryKeys } from './queryKeys';

/** A single invoice with its line items. */
export function useInvoice(id: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.invoice(id ?? -1),
    queryFn: ({ signal }) => apiGet<InvoiceWithItems>(`/invoices/${id}`, undefined, signal),
    enabled: id != null && Number.isInteger(id),
  });
}
