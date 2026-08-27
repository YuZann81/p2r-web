export type KaryaCategory =
  | "website"
  | "software"
  | "game"
  | "hardware_robotics"
  | "digital_art"

export type DistributionPlatform =
  | "web"
  | "android"
  | "windows"
  | "linux"
  | "macos"
  | "other"

export type DistributionType =
  | "p2r_arcade"
  | "web_external"
  | "download"

export interface Distribution {
  platform: DistributionPlatform
  type: DistributionType
  url?: string | null
}

export type KaryaCapabilities = {
  scores?: boolean
  leaderboard?: boolean
  p2r_arcade?: boolean
}

export type KaryaDetail = {
  id: string
  title: string
  slug: string
  version?: string | null
  description: string | null
  creators: string | null
  category: string
  tech_stack: unknown[]
  media_urls: unknown[]
  live_url: string | null
  repo_url: string | null
  distributions?: Distribution[] | null
  capabilities?: KaryaCapabilities | null
  is_featured: boolean
  status: string
  votes_count: number
  created_at: string | null
  updated_at: string | null
  is_voted_by_me?: boolean | string | null
}

export type StoreKaryaPayload = {
  title: string
  slug?: string
  version?: string | null
  description?: string | null
  creators?: string | null
  category: KaryaCategory
  tech_stack?: string[]
  media_urls?: string[]
  live_url?: string | null
  repo_url?: string | null
  distributions?: Distribution[] | null
  is_featured?: boolean
  status?: "draft" | "published"
}

export type KaryaListParams = {
  category?: KaryaCategory
  sort?: "newest" | "votes"
  limit?: number
}
