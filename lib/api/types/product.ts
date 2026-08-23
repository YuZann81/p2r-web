export type ProductCategory = {
  name: string
  slug: string
}

export type Product = {
  id: number | string
  name: string
  slug: string
  description?: string | null
  price: number | string | null
  stock?: number | null
  image_url?: string | null
  category?: ProductCategory | string | null
  status?: string | null
  featured?: boolean
  created_at?: string | null
  updated_at?: string | null
}
