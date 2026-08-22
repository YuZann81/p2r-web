import type { Product } from "@/lib/api/types/product";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CheckoutItemPayload = {
  product_id: string | number;
  quantity: number;
};

export type CheckoutPayload = {
  customer_name: string;
  customer_phone: string;
  customer_class?: string;
  customer_major?: string;
  notes?: string;
  items: CheckoutItemPayload[];
};

export type OrderResult = {
  id: string | number;
  order_number?: string;
  customer_name: string;
  customer_phone?: string;
  total_amount?: number;
  status?: string;
  created_at?: string;
};
