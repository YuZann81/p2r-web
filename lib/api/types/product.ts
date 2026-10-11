export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price?: number | null
  coin_price: number
  stock?: number | null
  image_url?: string | null
  images?: string[] | null
  source_type: "organizer" | "game"
  game_id?: string | null
  game?: {
    id: string
    title: string
    slug: string
  } | null
  category?: string | null
  status?: string
  created_at?: string | null
  updated_at?: string | null
}
