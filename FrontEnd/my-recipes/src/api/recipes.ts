// src/api/recipes.ts
import { supabase } from '../lib/supabase'
import type { Recipe } from '../types/recipe'

// LIST
export async function listRecipes(q?: string): Promise<Recipe[]> {
  let query = supabase.from('recipes').select('*').order('created_at', { ascending: false })
  if (q && q.trim()) query = query.ilike('title', `%${q}%`)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as Recipe[]
}

// GET
export async function getRecipe(id: string): Promise<Recipe> {
  const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data as Recipe
}

// CREATE
export async function createRecipe(values: Partial<Recipe>): Promise<Recipe> {
  const { data, error } = await supabase.from('recipes').insert(values).select().single()
  if (error) throw new Error(error.message)
  return data as Recipe
}

// UPDATE
export async function updateRecipe(id: string, values: Partial<Recipe>): Promise<Recipe> {
  const { data, error } = await supabase.from('recipes').update(values).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return data as Recipe
}

// DELETE
export async function deleteRecipe(id: string): Promise<void> {
  const { error } = await supabase.from('recipes').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
