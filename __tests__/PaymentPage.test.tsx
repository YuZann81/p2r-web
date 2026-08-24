import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import PaymentPage from "@/app/payment/page";
import { useAuth } from "@/lib/auth/auth-context";
import { getPendingPayment, getActiveQris } from "@/lib/api/payment";

jest.mock("@/lib/auth/auth-context", () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/lib/api/payment", () => ({
  getPendingPayment: jest.fn(),
  getActiveQris: jest.fn(),
  createPayment: jest.fn(),
  uploadPaymentProof: jest.fn(),
  cancelPayment: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockedGetPendingPayment = getPendingPayment as jest.MockedFunction<typeof getPendingPayment>;
const mockedGetActiveQris = getActiveQris as jest.MockedFunction<typeof getActiveQris>;

describe("PaymentPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders active payment with QRIS image and nominal", async () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 1, name: "Sultan", email: "sultan@p2r.local" },
      token: "valid-token",
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    mockedGetPendingPayment.mockResolvedValue({
      id: "pay_123",
      checkout_code: "P2R-20260824-000001",
      payment_method: "qris",
      payment_status: "waiting_payment",
      transfer_amount: "150000.00",
    });

    mockedGetActiveQris.mockResolvedValue({
      id: "qris_1",
      name: "QRIS Utama P2R",
      qr_image_path: "qris/qris.png",
      qr_image_url: "https://api.razzan.site/storage/qris/qris.png",
      is_active: true,
    });

    render(<PaymentPage />);

    await waitFor(() => {
      expect(screen.getByText("Pembayaran & Konfirmasi QRIS")).toBeInTheDocument();
      expect(screen.getByText("QRIS Utama P2R")).toBeInTheDocument();
      expect(screen.getByText("P2R-20260824-000001")).toBeInTheDocument();
      expect(screen.getByText("Belum Dibayar")).toBeInTheDocument();
    });
  });

  it("renders rejection reason when payment is rejected", async () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 1, name: "Sultan", email: "sultan@p2r.local" },
      token: "valid-token",
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    mockedGetPendingPayment.mockResolvedValue({
      id: "pay_123",
      checkout_code: "P2R-20260824-000001",
      payment_method: "qris",
      payment_status: "rejected",
      transfer_amount: "150000.00",
      rejection_reason: "Bukti transfer buram.",
    });

    mockedGetActiveQris.mockResolvedValue(null);

    render(<PaymentPage />);

    await waitFor(() => {
      expect(screen.getByText("Pembayaran Ditolak oleh Admin")).toBeInTheDocument();
      expect(screen.getByText("Bukti transfer buram.")).toBeInTheDocument();
    });
  });
});
