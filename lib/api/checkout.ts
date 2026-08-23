import { apiGet, apiPost } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types/api-response";
import type { CheckoutPayload, OrderResult } from "@/lib/api/types/checkout";

export type {
  CartItem,
  CheckoutItemPayload,
  CheckoutPayload,
  CheckoutCustomer,
  CheckoutItem,
  CheckoutItemProduct,
  OrderResult,
} from "@/lib/api/types/checkout";

export async function submitCheckout(
  payload: CheckoutPayload,
  token?: string | null,
): Promise<ApiResponse<OrderResult>> {
  return apiPost<OrderResult, CheckoutPayload>("/checkout", payload, {
    token: token || null,
  });
}

export async function fetchActiveCheckout(
  token: string,
): Promise<ApiResponse<OrderResult | null>> {
  return apiGet<OrderResult | null>("/checkout", {
    token,
  });
}

export async function fetchCheckoutById(
  checkoutId: string,
  token: string,
): Promise<ApiResponse<OrderResult>> {
  return apiGet<OrderResult>(`/checkout/${encodeURIComponent(checkoutId)}`, {
    token,
  });
}
