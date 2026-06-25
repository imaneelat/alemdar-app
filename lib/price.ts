/**
 * Helpers to bridge the API's single `price` string (e.g. "5", "464.89")
 * to the UI/Cart's split `{ price, dec }` representation.
 */

export function splitPrice(value: string | number | null | undefined): { whole: string; dec: string } {
  if (value == null || value === '') return { whole: '0', dec: '00' };
  const num = typeof value === 'number' ? value : parseFloat(value);
  if (!Number.isFinite(num)) return { whole: '0', dec: '00' };
  const [whole, dec = '00'] = num.toFixed(2).split('.');
  return { whole, dec };
}

/** Format a price as a display string, e.g. "464.89 TL". */
export function formatTL(value: string | number | null | undefined): string {
  const { whole, dec } = splitPrice(value);
  return `${whole}.${dec} TL`;
}
