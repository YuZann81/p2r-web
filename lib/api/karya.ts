import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api/client"
import type { ApiResponse } from "@/lib/api/types/api-response"
import type {
  KaryaDetail,
  KaryaListParams,
  StoreKaryaPayload,
} from "@/lib/api/types/karya"

export type {
  KaryaDetail,
  KaryaListParams,
  KaryaCategory,
  StoreKaryaPayload,
  Distribution,
  DistributionPlatform,
  DistributionType,
} from "@/lib/api/types/karya"

export type VoteResult = {
  votes_count: number
  is_voted_by_me: boolean | string
}

export async function fetchKaryas(
  params: KaryaListParams = {},
): Promise<KaryaDetail[]> {
  try {
    const payload = await apiGet<KaryaDetail[]>("/karyas", {
      searchParams: {
        category: params.category,
        sort: params.sort,
        limit: params.limit,
      },
    })

    return Array.isArray(payload.data) ? payload.data : []
  } catch (error) {
    console.error("[p2r-api] Failed to fetch karyas:", error)
    return []
  }
}

export async function fetchKaryaSlugs(
  params: KaryaListParams = {},
): Promise<string[]> {
  try {
    const karyas = await fetchKaryas(params)
    return karyas.map((k) => k.slug).filter((slug): slug is string => Boolean(slug))
  } catch (error) {
    console.error("[p2r-api] Failed to fetch karya slugs:", error)
    return []
  }
}

export async function fetchKaryaBySlug(
  slug: string,
  token?: string | null,
): Promise<KaryaDetail | null> {
  try {
    const payload = await apiGet<KaryaDetail>(
      `/karyas/${encodeURIComponent(slug)}`,
      { token },
    )
    return payload.data || null
  } catch (error) {
    console.error("[p2r-api] Failed to fetch karya by slug:", slug, error)
    return null
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

// ── Admin Karya Endpoints ──────────────────────────────────────────

export async function fetchAdminKaryas(
  token?: string | null,
): Promise<ApiResponse<KaryaDetail[]>> {
  return apiGet<KaryaDetail[]>("/admin/karyas", { token })
}

export async function fetchAdminKaryaById(
  id: string,
  token?: string | null,
): Promise<ApiResponse<KaryaDetail>> {
  return apiGet<KaryaDetail>(`/admin/karyas/${encodeURIComponent(id)}`, {
    token,
  })
}

export async function createAdminKarya(
  payload: StoreKaryaPayload,
  token?: string | null,
): Promise<ApiResponse<KaryaDetail>> {
  return apiPost<KaryaDetail, StoreKaryaPayload>("/admin/karyas", payload, {
    token,
  })
}

export async function updateAdminKarya(
  id: string,
  payload: Partial<StoreKaryaPayload>,
  token?: string | null,
): Promise<ApiResponse<KaryaDetail>> {
  return apiPut<KaryaDetail, Partial<StoreKaryaPayload>>(
    `/admin/karyas/${encodeURIComponent(id)}`,
    payload,
    { token },
  )
}

export async function deleteAdminKarya(
  id: string,
  token?: string | null,
): Promise<ApiResponse<null>> {
  return apiDelete<null>(`/admin/karyas/${encodeURIComponent(id)}`, {
    token,
  })
}
