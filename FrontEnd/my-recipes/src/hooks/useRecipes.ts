import { useEffect, useState } from 'react'
import { listRecipes } from '../api/recipes'
import type { Recipe } from '../types/recipe'

export function useRecipes(q: string) {
  const [data, setData] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true); setError(null)
      try {
        const res = await listRecipes(q)
        if (!alive) return
        setData(res)
      } catch (e: any) {
        if (!alive) return
        setError(e?.message ?? 'Error')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [q])

  return { data, loading, error }
}
