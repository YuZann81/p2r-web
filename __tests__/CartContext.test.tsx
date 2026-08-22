import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "@/lib/cart/cart-context";
import type { Product } from "@/lib/api/types/product";

const mockProductA: Product = {
  id: "prod-1",
  name: "Cyber Lanyard",
  slug: "cyber-lanyard",
  description: "Cool lanyard",
  price: 25000,
};

const mockProductB: Product = {
  id: "prod-2",
  name: "Cyber Keychain",
  slug: "cyber-keychain",
  description: "Pixel keychain",
  price: 15000,
};

describe("CartContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds items and calculates totalItems and totalPrice", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);

    act(() => {
      result.current.addItem(mockProductA, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(50000);

    act(() => {
      result.current.addItem(mockProductB, 1);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(65000);
  });

  it("updates item quantity and removes item when quantity is 0", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    });

    act(() => {
      result.current.addItem(mockProductA, 2);
    });

    act(() => {
      result.current.updateQuantity("prod-1", 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.totalPrice).toBe(125000);

    act(() => {
      result.current.updateQuantity("prod-1", 0);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
  });

  it("removes items and clears the cart", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    });

    act(() => {
      result.current.addItem(mockProductA, 1);
      result.current.addItem(mockProductB, 1);
    });

    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.removeItem("prod-1");
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe("prod-2");

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
  });
});
