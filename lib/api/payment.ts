import { apiGet, apiPost, apiPostFormData, apiDelete } from "@/lib/api/client";

export type PaymentMethod = "qris" | "bank_transfer" | "cash";
export type PaymentStatus =
  | "waiting_payment"
  | "waiting_verification"
  | "approved"
  | "rejected"
  | "expired";

export interface ActiveQris {
  id: string;
  name: string;
  qr_image_path: string;
  qr_image_url: string;
  is_active: boolean;
}

export interface PaymentData {
  id: string;
  checkout_id?: string;
  checkout_code?: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  transfer_amount: string;
  proof_image?: string | null;
  rejection_reason?: string | null;
  verification_notes?: string | null;
  paid_at?: string | null;
  verified_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export async function getActiveQris(): Promise<ActiveQris | null> {
  try {
    const res = await apiGet<ActiveQris>("/payment/qris/active");
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function getPendingPayment(token?: string | null): Promise<PaymentData | null> {
  try {
    const res = await apiGet<PaymentData>("/payment", { token });
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function getPaymentById(id: string, token?: string | null): Promise<PaymentData | null> {
  const res = await apiGet<PaymentData>(`/payment/${id}`, { token });
  return res.data ?? null;
}

export async function createPayment(
  paymentMethod: PaymentMethod,
  token?: string | null,
): Promise<PaymentData> {
  const res = await apiPost<PaymentData>(
    "/payment",
    { payment_method: paymentMethod },
    { token },
  );
  if (!res.data) throw new Error(res.message || "Gagal membuat pembayaran.");
  return res.data;
}

export async function uploadPaymentProof(
  file: File,
  token?: string | null,
): Promise<PaymentData> {
  const formData = new FormData();
  formData.append("proof_image", file);

  const res = await apiPostFormData<PaymentData>("/payment/proof", formData, { token });
  if (!res.data) throw new Error(res.message || "Gagal mengunggah bukti transfer.");
  return res.data;
}

export async function cancelPayment(id: string, token?: string | null): Promise<PaymentData | null> {
  const res = await apiDelete<PaymentData>(`/payment/${id}`, { token });
  return res.data ?? null;
}
