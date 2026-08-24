import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import OrdersPage from "@/app/orders/page";
import { useAuth } from "@/lib/auth/auth-context";
import { getOrders } from "@/lib/api/orders";

jest.mock("@/lib/auth/auth-context", () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/lib/api/orders", () => ({
  getOrders: jest.fn(),
  getOrderById: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockedGetOrders = getOrders as jest.MockedFunction<typeof getOrders>;

describe("OrdersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders order list for authenticated user", async () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 1, name: "Sultan", email: "sultan@p2r.local" },
      token: "valid-token",
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    mockedGetOrders.mockResolvedValue([
      {
        id: "ord_1",
        order_code: "ORD-20260824-000001",
        status: "paid",
        subtotal: "150000.00",
        grand_total: "150000.00",
        total_items: 1,
        total_quantity: 1,
        customer_name: "Sultan",
        created_at: "2026-08-24T06:00:00Z",
        updated_at: "2026-08-24T06:00:00Z",
        items: [
          {
            id: "item_1",
            product_name: "T-Shirt P2R Cyber",
            product_slug: "t-shirt-p2r-cyber",
            quantity: 1,
            unit_price: "150000.00",
            subtotal: "150000.00",
          },
        ],
      },
    ]);

    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText("Daftar Pesanan Merchandise")).toBeInTheDocument();
      expect(screen.getByText("ORD-20260824-000001")).toBeInTheDocument();
      expect(screen.getAllByText("Sudah Dibayar").length).toBeGreaterThanOrEqual(1);
    });
  });
});
