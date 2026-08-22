import { apiGet } from "@/lib/api/client"
import type { KaryaDetail, KaryaListParams } from "@/lib/api/types/karya"

export type { KaryaDetail, KaryaListParams, KaryaCategory } from "@/lib/api/types/karya"

export async function fetchKaryaSlugs(
  params: KaryaListParams = {},
): Promise<string[]> {
  const payload = await apiGet<string[]>("/karyas", {
    searchParams: {
      category: params.category,
      sort: params.sort,
      limit: params.limit,
    },
  })

  return payload.data
}

export async function fetchKaryaBySlug(slug: string): Promise<KaryaDetail> {
  const payload = await apiGet<KaryaDetail>(`/karyas/${encodeURIComponent(slug)}`)
  return payload.data
}

export async function fetchKaryas(
  params: KaryaListParams = {},
): Promise<KaryaDetail[]> {
  try {
    const slugs = await fetchKaryaSlugs(params)
    if (!slugs || slugs.length === 0) {
      return []
    }

    const details = await Promise.all(
      slugs.map(async (slug) => {
        try {
          return await fetchKaryaBySlug(slug)
        } catch (error) {
          console.error("[p2r-api] Failed to load karya detail:", slug, error)
          return null
        }
      }),
    )

    return details.filter((karya): karya is KaryaDetail => karya !== null)
  } catch (error) {
    console.error("[p2r-api] Failed to fetch karyas:", error)
    return []
  }
}

export async function fetchGameKaryas(limit = 20): Promise<KaryaDetail[]> {
  return fetchKaryas({ category: "game", limit })
}
