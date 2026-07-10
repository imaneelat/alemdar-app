import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CART_STORAGE_KEY = 'cart:items';

export type CartItem = {
  id: string;
  name: string;
  price: string;
  dec: string;
  categoryId: string;
  categoryTitle: string;
  image?: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string, categoryId: string) => void;
  updateQty: (id: string, categoryId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as CartItem;
  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'string' &&
    typeof item.dec === 'string' &&
    typeof item.categoryId === 'string' &&
    typeof item.categoryTitle === 'string' &&
    typeof item.quantity === 'number' &&
    item.quantity > 0 &&
    (item.image === undefined || typeof item.image === 'string')
  );
}

function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartItem);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (cancelled) return;
        setItems(parseStoredCart(stored));
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const key = `${product.categoryId}-${product.id}`;
      const existing = prev.find(i => `${i.categoryId}-${i.id}` === key);
      if (existing) {
        return prev.map(i =>
          `${i.categoryId}-${i.id}` === key
            ? {
                ...i,
                quantity: i.quantity + 1,
                ...(product.image ? { image: product.image } : {}),
              }
            : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string, categoryId: string) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.categoryId === categoryId)));
  }, []);

  const updateQty = useCallback((id: string, categoryId: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => !(i.id === id && i.categoryId === categoryId)));
    } else {
      setItems(prev =>
        prev.map(i => (i.id === id && i.categoryId === categoryId ? { ...i, quantity: qty } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => {
    const p = parseFloat(`${i.price}.${i.dec}`);
    return s + p * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
