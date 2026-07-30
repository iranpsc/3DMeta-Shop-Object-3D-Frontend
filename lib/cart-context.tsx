"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchCart } from "@/lib/cart-api";

type CartContextValue = {
  count: number;
  setCount: (count: number) => void;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const cart = await fetchCart();
      setCount(cart.count);
    } catch {
      setCount(0);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchCart()
      .then((cart) => {
        if (!cancelled) setCount(cart.count);
      })
      .catch(() => {
        if (!cancelled) setCount(0);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({ count, setCount, refresh }), [count, refresh]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
