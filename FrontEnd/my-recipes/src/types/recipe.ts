
export type Recipe = {
  id: string
  title: string
  description?: string | null
  tags?: string[] | null
  ingredients?: Array<{ qty?: number; unit?: string; name: string }> | null
  notes?: string | null
  rating?: number | null
  photo_url?: string | null
  instructions: string[]
  prep_time_minutes: number
  servings: number
  created_at?: string
  updated_at?: string
}
