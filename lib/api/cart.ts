import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types/api-response";

export type BackendCartItem = {
  id: string | number;
  product_id: string | number;
  product_name: string;
  product_slug: string;
  product_image_url?: string | null;
  product_category_name?: string | null;
  unit_price: string | number;
  quantity: number;
  subtotal: string | number;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type BackendCart = {
  id: string | number;
  status: string;
  subtotal: string | number;
  total_price: string | number;
  items: BackendCartItem[];
};

export async function fetchBackendCart(token?: string | null): Promise<ApiResponse<BackendCart>> {
  return apiGet<BackendCart>("/cart", { token: token || null });
}

export async function addBackendCartItem(
  payload: { product_id: string | number; quantity: number; notes?: string },
  token?: string | null,
): Promise<ApiResponse<BackendCart>> {
  return apiPost<BackendCart, { product_id: number; quantity: number; notes?: string }>(
    "/cart/items",
    {
      product_id: Number(payload.product_id),
      quantity: payload.quantity,
      notes: payload.notes,
    },
    { token: token || null },
  );
}

export async function updateBackendCartItem(
  itemId: string | number,
  payload: { quantity?: number; notes?: string },
  token?: string | null,
): Promise<ApiResponse<BackendCart>> {
  return apiPatch<BackendCart, { quantity?: number; notes?: string }>(
    `/cart/items/${itemId}`,
    payload,
    { token: token || null },
  );
}

export async function removeBackendCartItem(
  itemId: string | number,
  token?: string | null,
): Promise<ApiResponse<BackendCart>> {
  return apiDelete<BackendCart>(`/cart/items/${itemId}`, { token: token || null });
}

export async function clearBackendCart(token?: string | null): Promise<ApiResponse<BackendCart>> {
  return apiDelete<BackendCart>("/cart", { token: token || null });
}
