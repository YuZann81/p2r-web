import { apiGet } from "@/lib/api/client"
import type { Product } from "@/lib/api/types/product"

export type { Product } from "@/lib/api/types/product"

export function getProviderLabel(item: Product): string {
  if (item.source_type === "game" && item.game?.title) {
    return `Made by ${item.game.title}`
  }
  return "Made by Committee"
}

export function getAcquisitionInstruction(item: Product): string {
  if (item.source_type === "game" && item.game?.title) {
    return `Get by playing ${item.game.title}`
  }
  return "Redeem at the committee booth"
}

interface RawMerchandisePayload {
  data?: unknown
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const payload = await apiGet<RawMerchandisePayload | Product[]>("/merchandises")

    let rawList: unknown[] = []
    if (Array.isArray(payload.data)) {
      rawList = payload.data
    } else if (
      payload.data &&
      typeof payload.data === "object" &&
      "data" in payload.data &&
      Array.isArray((payload.data as { data: unknown[] }).data)
    ) {
      rawList = (payload.data as { data: unknown[] }).data
    }

    return rawList.map((item) => {
      const p = item as Record<string, unknown>
      const images = Array.isArray(p.images) ? (p.images as string[]) : null
      const firstImage = (images && images[0]) || (typeof p.image_url === "string" ? p.image_url : null)
      const coinPrice = typeof p.coin_price === "number" ? p.coin_price : typeof p.price === "number" ? p.price : 0

      return {
        id: String(p.id ?? ""),
        name: String(p.name ?? "Merchandise"),
        slug: String(p.slug ?? ""),
        description: typeof p.description === "string" ? p.description : null,
        price: coinPrice,
        coin_price: coinPrice,
        stock: typeof p.stock === "number" ? p.stock : 0,
        image_url: firstImage,
        images,
        source_type: (p.source_type === "game" ? "game" : "organizer") as "organizer" | "game",
        game_id: typeof p.game_id === "string" ? p.game_id : null,
        game: p.game && typeof p.game === "object" ? (p.game as Product["game"]) : null,
        status: typeof p.status === "string" ? p.status : "published",
        created_at: typeof p.created_at === "string" ? p.created_at : null,
        updated_at: typeof p.updated_at === "string" ? p.updated_at : null,
      }
    })
  } catch (error) {
    console.error("[p2r-api] Failed to fetch merchandises:", error)
    return []
  }
}
