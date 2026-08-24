import { apiGet } from "@/lib/api/client";

export interface ReceiptItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export interface ReceiptData {
  id: string;
  receipt_number: string;
  issued_at: string;
  order: {
    order_code: string;
    status: string;
    customer_name: string;
    customer_phone: string;
    subtotal: string;
    grand_total: string;
    items: ReceiptItem[];
  };
}

export async function getReceipts(token?: string | null): Promise<ReceiptData[]> {
  try {
    const res = await apiGet<ReceiptData[]>("/receipts", { token });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getReceiptById(id: string, token?: string | null): Promise<ReceiptData | null> {
  try {
    const res = await apiGet<ReceiptData>(`/receipts/${id}`, { token });
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function getReceiptByOrder(orderId: string, token?: string | null): Promise<ReceiptData | null> {
  try {
    const res = await apiGet<ReceiptData>(`/orders/${orderId}/receipt`, { token });
    return res.data ?? null;
  } catch {
    return null;
  }
}

export const getOrderReceipt = getReceiptByOrder;
