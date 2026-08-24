import { apiGet } from "@/lib/api/client";

export type OrderStatus = "paid" | "processing" | "completed" | "cancelled";

export interface OrderItem {
  id: string;
  product_name: string;
  product_slug: string;
  product_image_url?: string | null;
  product_category_name?: string | null;
  quantity: number;
  unit_price: string;
  subtotal: string;
  notes?: string | null;
  variant_snapshot?: string | null;
}

export interface OrderData {
  id: string;
  order_code: string;
  status: OrderStatus;
  subtotal: string;
  grand_total: string;
  total_items: number;
  total_quantity: number;
  customer_name?: string | null;
  customer_phone?: string | null;
  notes?: string | null;
  payment_method?: string | null;
  payment_status?: string | null;
  payment_proof_url?: string | null;
  receipt_number?: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export async function getOrders(token?: string | null): Promise<OrderData[]> {
  try {
    const res = await apiGet<OrderData[]>("/orders", { token });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getOrderById(id: string, token?: string | null): Promise<OrderData | null> {
  try {
    const res = await apiGet<OrderData>(`/orders/${id}`, { token });
    return res.data ?? null;
  } catch {
    return null;
  }
}
