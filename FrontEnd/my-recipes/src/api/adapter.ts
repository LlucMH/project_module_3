import type { Recipe } from '../types/recipe'

type MockRecipe = {
  id: string
  title: string
  description?: string
  tags?: string[]
  ingredients?: string[]
  notes?: string 
  rating?: number
  photo_url?: string
  createdAt?: Date
  updatedAt?: Date
}

export function mockToDb(r: MockRecipe): Partial<Recipe> {
  const instructions =
    r.notes
      ?.split(/\n+/)
      .map(s => s.replace(/^\s*\d+\.\s*/, '').trim())
      .filter(Boolean) ?? ['Paso 1', 'Paso 2']

  const ingredients =
    r.ingredients?.map(name => ({ name })) ?? null

  return {
    title: r.title,
    description: r.description ?? null,
    tags: r.tags ?? null,
    ingredients,
    notes: r.notes ?? null,
    rating: r.rating ?? null,
    photo_url: r.photo_url ?? null,
    instructions,
    prep_time_minutes: 20,
    servings: 2  
  }
}
