import type { Product } from "@/lib/api/types/product";

export type CartItem = {
  product: Product;
  quantity: number;
  notes?: string | null;
  backendItemId?: string | number;
};

export type CheckoutItemPayload = {
  product_id: string | number;
  quantity: number;
  notes?: string;
};

export type CheckoutPayload = {
  customer_name: string;
  customer_phone: string;
  customer_class?: string;
  customer_major?: string;
  notes?: string;
  items?: CheckoutItemPayload[];
};

export type CheckoutCustomer = {
  name: string;
  phone: string;
  notes?: string | null;
};

export type CheckoutItem = {
  id: string | number;
  product_name: string;
  product_slug: string;
  product_image_url?: string | null;
  product_category_name?: string | null;
  unit_price: string | number;
  quantity: number;
  subtotal: string | number;
  notes?: string | null;
};

export type OrderResult = {
  id: string | number;
  checkout_code?: string;
  status?: string;
  customer?: CheckoutCustomer;
  items?: CheckoutItem[];
  subtotal?: string | number;
  grand_total?: string | number;
  total_items?: number;
  total_quantity?: number;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
  // Aliases for compatibility
  order_number?: string;
  customer_name?: string;
  customer_phone?: string;
  total_amount?: number | string;
};
