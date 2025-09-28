import { supabase } from "@/lib/supabase"

export type Recipe = {
  id: string
  title: string
  description?: string | null
  tags: string[]
  ingredients?: any
  notes?: string | null
  rating?: number | null
  photo_url?: string | null
  instructions: string[]
  prep_time_minutes: number
  servings: number
  created_at?: string
  updated_at?: string
}

export async function listRecipes({
  q = "",
  tags = [],
  page = 1,
  pageSize = 12,
}: { q?: string; tags?: string[]; page?: number; pageSize?: number }) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from("recipes")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .order("title", { ascending: true })
    .range(from, to)

  if (q.trim()) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
  }
  if (tags.length) {
    query = query.contains("tags", tags)
  }

  const { data, error, count } = await query
  if (error) throw new Error(error.message)
  return { rows: (data ?? []) as Recipe[], count: count ?? 0 }
}

export async function getAllTags(): Promise<string[]> {
  const { data, error } = await supabase.from("recipes").select("tags")
  if (error) throw new Error(error.message)
  const s = new Set<string>()
  ;(data ?? []).forEach((r: any) => r?.tags?.forEach((t: string) => s.add(t)))
  return Array.from(s).sort((a, b) => a.localeCompare(b))
}

export async function deleteRecipe(id: string) {
  const { error } = await supabase.from("recipes").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

export async function upsertRecipe(payload: Partial<Recipe> & { id?: string }) {
  if (payload.id) {
    const { error } = await supabase.from("recipes").update(payload).eq("id", payload.id)
    if (error) throw new Error(error.message)
    return payload.id
  } else {
    const { data, error } = await supabase.from("recipes").insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data!.id as string
  }
}
