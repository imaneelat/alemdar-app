import type { CartItem } from '@/context/CartContext';

export function formatCartItemsForOrder(items: CartItem[]): string {
  return items
    .map((item) => {
      const unit = parseFloat(`${item.price}.${item.dec}`);
      const lineTotal = (unit * item.quantity).toFixed(2);
      return `${item.name} × ${item.quantity} — ${lineTotal} TL`;
    })
    .join('\n');
}
