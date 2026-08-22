"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/lib/api/types/product";
import type { CartItem } from "@/lib/api/types/checkout";

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "p2r_cart_items";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore parsing errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage when items change (after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items, isLoaded]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    if (quantity <= 0) return;

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => String(item.product.id) === String(product.id),
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [...prev, { product, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string | number) => {
    setItems((prev) =>
      prev.filter((item) => String(item.product.id) !== String(productId)),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string | number, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          String(item.product.id) === String(productId)
            ? { ...item, quantity }
            : item,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(CART_KEY);
    } catch {}
  }, []);

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () =>
      items.reduce((total, item) => {
        const price =
          typeof item.product.price === "number" && item.product.price > 0
            ? item.product.price
            : 0;
        return total + price * item.quantity;
      }, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

const defaultCartContext: CartContextType = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
};

export function useCart() {
  const context = useContext(CartContext);
  return context || defaultCartContext;
}
