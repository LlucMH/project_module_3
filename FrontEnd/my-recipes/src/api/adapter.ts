// src/api/adapter.ts
import type { Recipe } from '../types/recipe'

type MockRecipe = {
  id: string
  title: string
  description?: string
  tags?: string[]
  ingredients?: string[]         // <-- en mock
  notes?: string                 // <-- contiene pasos numerados
  rating?: number
  photo?: string                 // <-- en mock
  createdAt?: Date
  updatedAt?: Date
}

export function mockToDb(r: MockRecipe): Partial<Recipe> {
  // 1) instrucciones: partir notes en líneas numeradas (1., 2., ...)
  const instructions =
    r.notes
      ?.split(/\n+/)
      .map(s => s.replace(/^\s*\d+\.\s*/, '').trim())
      .filter(Boolean) ?? ['Paso 1', 'Paso 2']

  // 2) ingredients: pasar de string[] a objetos básicos (name)
  const ingredients =
    r.ingredients?.map(name => ({ name })) ?? null

  return {
    title: r.title,
    description: r.description ?? null,
    tags: r.tags ?? null,
    ingredients,
    notes: r.notes ?? null,
    rating: r.rating ?? null,
    photo_url: r.photo ?? null,
    instructions,                 // requerido
    prep_time_minutes: 20,        // default razonable si no lo tienes
    servings: 2                   // default razonable
  }
}
