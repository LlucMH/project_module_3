import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function RecipePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [r, setR] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true); setError(null)
        const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single()
        if (error) throw error
        if (!alive) return
        setR(data)
      } catch (e) {
        if (!alive) return
        setError(e.message || 'Error')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [id])

  async function handleDelete() {
    if (!confirm('¿Eliminar esta receta?')) return
    const { error } = await supabase.from('recipes').delete().eq('id', id)
    if (error) return alert(error.message)
    navigate('/') 
  }

  if (loading) return <div style={{padding:16}}>Cargando…</div>
  if (error) return <div style={{padding:16, color:'crimson'}}>Error: {error}</div>
  if (!r) return <div style={{padding:16}}>No encontrada</div>

  return (
    <div style={{padding:16, maxWidth:800, margin:'0 auto'}}>
      <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:12}}>
        <Link to="/">← Volver</Link>
        <div style={{flex:1}}/>
        <button onClick={() => navigate(`/edit/${r.id}`)}>✏️ Editar</button>
        <button onClick={handleDelete} style={{color:'white', background:'#d33'}}>🗑️ Eliminar</button>
      </div>
      <h1>{r.title}</h1>
      {r.photo_url && <img src={r.photo_url} alt="" style={{width:'100%', maxHeight:320, objectFit:'cover', borderRadius:8}}/>}
      {r.description && <p style={{marginTop:12}}>{r.description}</p>}
      <p style={{opacity:.7}}>⏱️ {r.prep_time_minutes} min · 🍽️ {r.servings} raciones</p>

      {!!(r.instructions?.length) && (
        <>
          <h3>Instrucciones</h3>
          <ol>{r.instructions.map((s,i)=><li key={i}>{s}</li>)}</ol>
        </>
      )}
      {!!(r.ingredients?.length) && (
        <>
          <h3>Ingredientes</h3>
          <ul>{r.ingredients.map((it,i)=><li key={i}>{it.name ?? JSON.stringify(it)}</li>)}</ul>
        </>
      )}
    </div>
  )
}
