import { apiGet } from "@/lib/api/client"
import type { KaryaDetail, KaryaListParams } from "@/lib/api/types/karya"

export type { KaryaDetail, KaryaListParams } from "@/lib/api/types/karya"

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

export async function fetchGameKaryas(limit = 20): Promise<KaryaDetail[]> {
  const slugs = await fetchKaryaSlugs({ category: "game", limit })
  console.log("[p2r-api] Game karya slugs:", slugs)

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
}
