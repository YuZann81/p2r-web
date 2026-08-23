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
import { useAuth } from "@/lib/auth/auth-context";
import {
  fetchBackendCart,
  addBackendCartItem,
  removeBackendCartItem,
  clearBackendCart,
} from "@/lib/api/cart";

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  syncWithBackend: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "p2r_cart_items";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuth();
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

  const tokenRef = React.useRef(token);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  // Sync with backend active cart if authenticated
  const syncWithBackend = useCallback(async () => {
    const currentToken = tokenRef.current;
    if (!currentToken) return;
    try {
      const res = await fetchBackendCart(currentToken);
      if (res.data && Array.isArray(res.data.items)) {
        if (res.data.items.length > 0) {
          const backendItems: CartItem[] = res.data.items.map((bi) => ({
            product: {
              id: bi.product_id,
              name: bi.product_name,
              slug: bi.product_slug,
              price: bi.unit_price,
              image_url: bi.product_image_url,
              category: bi.product_category_name || null,
            },
            quantity: bi.quantity,
            backendItemId: bi.id,
            notes: bi.notes,
          }));

          setItems(backendItems);
        } else {
          setItems([]);
        }
      }
    } catch {
      // Benign sync error
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && token) {
      syncWithBackend();
    }
  }, [isAuthenticated, token, syncWithBackend]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    const cleanQty = Math.max(1, Math.floor(quantity));
    if (isNaN(cleanQty) || cleanQty <= 0 || !product || product.id === undefined) return;

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => String(item.product.id) === String(product.id),
      );

      const maxStock =
        typeof product.stock === "number" && product.stock > 0
          ? product.stock
          : Infinity;

      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const finalQty = Math.min(currentQty + quantity, maxStock);
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: finalQty,
        };
        return updated;
      }

      const initialQty = Math.min(quantity, maxStock);
      return [...prev, { product, quantity: initialQty }];
    });

    // Synchronize with backend if authenticated
    const currentToken = tokenRef.current;
    if (currentToken) {
      addBackendCartItem(
        { product_id: product.id, quantity },
        currentToken,
      ).catch(() => {});
    }
  }, []);

  const removeItem = useCallback((productId: string | number) => {
    setItems((prev) => {
      const targetItem = prev.find(
        (item) => String(item.product.id) === String(productId),
      );

      const currentToken = tokenRef.current;
      if (currentToken) {
        if (targetItem?.backendItemId) {
          removeBackendCartItem(targetItem.backendItemId, currentToken).catch(() => {});
        } else {
          fetchBackendCart(currentToken)
            .then((res) => {
              const found = res.data?.items.find(
                (bi) => String(bi.product_id) === String(productId),
              );
              if (found) {
                removeBackendCartItem(found.id, currentToken).catch(() => {});
              }
            })
            .catch(() => {});
        }
      }

      return prev.filter((item) => String(item.product.id) !== String(productId));
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string | number, quantity: number) => {
      const cleanQty = Math.floor(quantity);
      if (isNaN(cleanQty) || cleanQty <= 0) {
        removeItem(productId);
        return;
      }

      setItems((prev) =>
        prev.map((item) => {
          if (String(item.product.id) === String(productId)) {
            const maxStock =
              typeof item.product.stock === "number" && item.product.stock > 0
                ? item.product.stock
                : Infinity;
            return {
              ...item,
              quantity: Math.min(cleanQty, maxStock),
            };
          }
          return item;
        }),
      );

      const currentToken = tokenRef.current;
      if (currentToken) {
        addBackendCartItem({ product_id: productId, quantity: cleanQty }, currentToken).catch(() => {});
      }
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(CART_KEY);
    } catch {}

    const currentToken = tokenRef.current;
    if (currentToken) {
      clearBackendCart(currentToken).catch(() => {});
    }
  }, []);

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () =>
      items.reduce((total, item) => {
        const rawPrice = item.product?.price;
        const numPrice = typeof rawPrice === "string" ? parseFloat(rawPrice) : rawPrice;
        const price =
          typeof numPrice === "number" && !isNaN(numPrice) && numPrice > 0
            ? numPrice
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
        syncWithBackend,
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
  syncWithBackend: async () => {},
};

export function useCart() {
  const context = useContext(CartContext);
  return context || defaultCartContext;
}
