import { apiGet } from "@/lib/api/client"
import type { Product } from "@/lib/api/types/product"

export type { Product } from "@/lib/api/types/product"

export async function fetchProducts(): Promise<Product[]> {
  try {
    const payload = await apiGet<Product[]>("/products")
    return payload.data ?? []
  } catch (error) {
    console.error("[p2r-api] Failed to fetch products:", error)
    return []
  }
}
