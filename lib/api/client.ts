import { getApiBaseUrl } from "@/lib/api/config"
import type { ApiResponse } from "@/lib/api/types/api-response"

type ApiGetOptions = {
  searchParams?: Record<string, string | number | undefined>
}

function buildApiUrl(path: string, searchParams?: ApiGetOptions["searchParams"]): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const url = new URL(`${getApiBaseUrl()}${normalizedPath}`)

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  return url.toString()
}

export async function apiGet<T>(
  path: string,
  options: ApiGetOptions = {},
): Promise<ApiResponse<T>> {
  const url = buildApiUrl(path, options.searchParams)
  console.log("[p2r-api] GET", url)

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    console.error("[p2r-api] Request failed:", response.status, url)
    throw new Error(`API request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as ApiResponse<T>
  console.log("[p2r-api] Response:", payload.message)

  if (!payload.success) {
    console.error("[p2r-api] Unsuccessful payload:", payload.message)
    throw new Error(payload.message || "API request was not successful")
  }

  return payload
}
