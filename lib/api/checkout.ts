import { apiPost } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types/api-response";
import type { CheckoutPayload, OrderResult } from "@/lib/api/types/checkout";

export type {
  CartItem,
  CheckoutItemPayload,
  CheckoutPayload,
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
