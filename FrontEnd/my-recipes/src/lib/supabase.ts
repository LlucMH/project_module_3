import { createClient } from '@supabase/supabase-js'

const url  = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url?.startsWith('http')) {
  throw new Error(`Bad VITE_SUPABASE_URL: "${url}"`)
}
if (!anon) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(url, anon)
export const SUPABASE_URL = url // útil para /health
