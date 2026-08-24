import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ReceiptsPage from "@/app/receipts/page";
import { useAuth } from "@/lib/auth/auth-context";
import { getReceipts } from "@/lib/api/receipts";

jest.mock("@/lib/auth/auth-context", () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/lib/api/receipts", () => ({
  getReceipts: jest.fn(),
  getReceiptById: jest.fn(),
  getReceiptByOrder: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockedGetReceipts = getReceipts as jest.MockedFunction<typeof getReceipts>;

describe("ReceiptsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty state when no receipts are available", async () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 1, name: "Sultan", email: "sultan@p2r.local" },
      token: "valid-token",
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    mockedGetReceipts.mockResolvedValue([]);

    render(<ReceiptsPage />);

    await waitFor(() => {
      expect(screen.getByText("Receipt belum tersedia.")).toBeInTheDocument();
    });
  });

  it("renders receipts when available", async () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 1, name: "Sultan", email: "sultan@p2r.local" },
      token: "valid-token",
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    mockedGetReceipts.mockResolvedValue([
      {
        id: "rct_1",
        receipt_number: "RCT-20260824-000001",
        issued_at: "2026-08-24T06:00:00Z",
        order: {
          order_code: "ORD-20260824-000001",
          status: "paid",
          customer_name: "Sultan",
          customer_phone: "08123456789",
          subtotal: "150000.00",
          grand_total: "150000.00",
          items: [
            {
              id: "item_1",
              product_name: "T-Shirt P2R Cyber",
              quantity: 1,
              unit_price: "150000.00",
              subtotal: "150000.00",
            },
          ],
        },
      },
    ]);

    render(<ReceiptsPage />);

    await waitFor(() => {
      expect(screen.getByText("RCT-20260824-000001")).toBeInTheDocument();
      expect(screen.getByText("LUNAS")).toBeInTheDocument();
      expect(screen.getByText("Buka Receipt")).toBeInTheDocument();
    });
  });
});
