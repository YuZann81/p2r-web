export type KaryaCategory =
  | "website"
  | "software"
  | "game"
  | "hardware_robotics"
  | "digital_art"

export type KaryaDetail = {
  id: string
  title: string
  slug: string
  description: string | null
  creators: string | null
  category: string
  tech_stack: unknown[]
  media_urls: unknown[]
  live_url: string | null
  repo_url: string | null
  is_featured: boolean
  status: string
  votes_count: number
  created_at: string | null
  updated_at: string | null
  is_voted_by_me?: boolean | string | null
}

export type KaryaListParams = {
  category?: KaryaCategory
  sort?: "newest" | "votes"
  limit?: number
}
