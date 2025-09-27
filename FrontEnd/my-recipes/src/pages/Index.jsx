import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Index() {
  const [recipes, setRecipes] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true); setError(null)
        let query = supabase.from('recipes').select('*').order('created_at', { ascending: false })
        if (q.trim()) query = query.ilike('title', `%${q}%`)
        const { data, error } = await query
        if (error) throw error
        if (!alive) return
        setRecipes(data ?? [])
      } catch (e) {
        if (!alive) return
        setError(e.message || 'Error cargando recetas')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [q])

  const list = useMemo(() => recipes ?? [], [recipes])

  return (
    <div style={{ padding: 16 }}>
      <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:12}}>
        <h1 style={{margin:0, flex:1}}>Recetas</h1>
        <button onClick={() => navigate('/new')}>➕ Añadir</button>
      </div>

      <input
        placeholder="Buscar por título…"
        value={q}
        onChange={e => setQ(e.target.value)}
        style={{ padding: 8, width: '100%', maxWidth: 420, marginBottom: 16 }}
      />

      {loading && <p>Cargando…</p>}
      {error && <p style={{ color:'crimson' }}>Error: {error}</p>}
      {!loading && !error && !list.length && <p>No hay recetas.</p>}

      <ul style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:16, listStyle:'none', padding:0}}>
        {list.map(r => (
          <li key={r.id} style={{border:'1px solid #eee', borderRadius:12, padding:12}}>
            <Link to={`/recipe/${r.id}`} style={{textDecoration:'none', color:'inherit', display:'block'}}>
              {r.photo_url && <img src={r.photo_url} alt={r.title} style={{width:'100%', height:160, objectFit:'cover', borderRadius:8, marginBottom:8}} />}
              <h3 style={{margin:'6px 0'}}>{r.title}</h3>
              {r.description && <p style={{opacity:0.8}}>{r.description}</p>}
              <div style={{fontSize:12, opacity:0.7, marginTop:8}}>
                {r.prep_time_minutes ? `⏱️ ${r.prep_time_minutes} min` : null}
                {r.servings ? ` · 🍽️ ${r.servings} raciones` : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
