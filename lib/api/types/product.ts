export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number | null
  stock?: number | null
  image_url?: string | null
  category?: string | null
  status?: string
  created_at?: string | null
  updated_at?: string | null
}
