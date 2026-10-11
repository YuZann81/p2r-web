import { apiDelete, apiGet, apiPost } from "@/lib/api/client"
import type { ApiResponse } from "@/lib/api/types/api-response"
import type { KaryaDetail, KaryaListParams } from "@/lib/api/types/karya"

export type { KaryaDetail, KaryaListParams, KaryaCategory } from "@/lib/api/types/karya"

export type VoteResult = {
  votes_count: number
  is_voted_by_me: boolean | string
}

export async function fetchKaryaSlugs(
  params: KaryaListParams = {},
): Promise<string[]> {
  try {
    const payload = await apiGet<Array<string | { slug: string }>>("/karyas", {
      searchParams: {
        category: params.category,
        sort: params.sort,
        limit: params.limit,
      },
    })

    const data = payload.data
    if (!Array.isArray(data)) {
      return []
    }

    return data
      .map((item) => (typeof item === "string" ? item : item?.slug))
      .filter((slug): slug is string => typeof slug === "string")
  } catch (error) {
    console.error("[p2r-api] Failed to fetch karya slugs:", error)
    return []
  }
}

export async function fetchKaryaBySlug(slug: string): Promise<KaryaDetail | null> {
  try {
    const payload = await apiGet<KaryaDetail>(`/karyas/${encodeURIComponent(slug)}`)
    return payload.data || null
  } catch (error) {
    console.error("[p2r-api] Failed to fetch karya by slug:", slug, error)
    return null
  }
}

export async function fetchKaryas(
  params: KaryaListParams = {},
): Promise<KaryaDetail[]> {
  try {
    // 1. Fetch list from /karyas
    const payload = await apiGet<Array<KaryaDetail | string | { slug: string }>>("/karyas", {
      searchParams: {
        category: params.category,
        sort: params.sort,
        limit: params.limit,
      },
    })

    const rawList = payload.data
    if (!Array.isArray(rawList) || rawList.length === 0) {
      return []
    }

    // If items are already full KaryaDetail objects with title (backend behavior), return directly
    if (typeof rawList[0] === "object" && rawList[0] !== null && "title" in rawList[0]) {
      return rawList as KaryaDetail[]
    }

    // If list endpoint returns slugs/strings, fetch details per slug (test-suite compatibility)
    const slugs = rawList
      .map((item) => (typeof item === "string" ? item : (item as { slug?: string })?.slug))
      .filter((slug): slug is string => typeof slug === "string")

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

export async function voteKarya(
  slug: string,
  token?: string | null,
): Promise<ApiResponse<VoteResult>> {
  return apiPost<VoteResult, Record<string, never>>(
    `/karyas/${encodeURIComponent(slug)}/vote`,
    {},
    { token },
  )
}

export async function unvoteKarya(
  slug: string,
  token?: string | null,
): Promise<ApiResponse<VoteResult>> {
  return apiDelete<VoteResult>(
    `/karyas/${encodeURIComponent(slug)}/vote`,
    { token },
  )
}
