import { createClient } from '@supabase/supabase-js'

const rawUrl  = (import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const rawAnon = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

const url =
  rawUrl.startsWith('http')
    ? rawUrl
    : 'https://ztfucpqgulghmlfufiwe.supabase.co'

const anon =
  rawAnon.length > 20
    ? rawAnon
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0ZnVjcHFndWxnaG1sZnVmaXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MzE5NTMsImV4cCI6MjA3NDMwNzk1M30.I_rsvL42yJUa0XM2OdYN5Rv3uQOCeBts7x4wQVATV-8' 

export const SUPABASE_URL = url

console.log('[Supabase ENV]', { url, hasAnon: anon.length > 20 })

export const supabase = createClient(url, anon)
