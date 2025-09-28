import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const empty = {
  title: '',
  description: '',
  photo_url: '',
  prep_time_minutes: 20,
  servings: 2,
  instructionsText: ''
}

export default function EditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single()
        if (error) throw error
        if (!alive) return
        setForm({
          title: data.title ?? '',
          description: data.description ?? '',
          photo_url: data.photo_url ?? '',
          prep_time_minutes: data.prep_time_minutes ?? 20,
          servings: data.servings ?? 2,
          instructionsText: (data.instructions ?? []).join('\n')
        })
      } catch (e) {
        if (!alive) return
        setError(e.message || 'Error')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [id])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: name==='prep_time_minutes' || name==='servings' ? Number(value) : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      title: form.title.trim(),
      description: form.description || null,
      photo_url: form.photo_url || null,
      prep_time_minutes: form.prep_time_minutes || 1,
      servings: form.servings || 1,
      instructions: form.instructionsText
        .split('\n')
        .map(s=>s.trim())
        .filter(Boolean)
    }
    try {
      if (id) {
        const { error } = await supabase.from('recipes').update(payload).eq('id', id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('recipes').insert(payload).select().single()
        if (error) throw error
        return navigate(`/recipe/${data.id}`)
      }
      navigate(`/recipe/${id}`)
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <div style={{padding:16}}>Cargando…</div>
  if (error) return <div style={{padding:16, color:'crimson'}}>Error: {error}</div>

  return (
    <div style={{padding:16, maxWidth:720, margin:'0 auto'}}>
      <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:12}}>
        <Link to="/">← Volver</Link>
        <h2 style={{marginLeft:8}}>{id ? 'Editar receta' : 'Nueva receta'}</h2>
      </div>

      <form onSubmit={handleSubmit} style={{display:'grid', gap:12}}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Título" required />
        <input name="photo_url" value={form.photo_url} onChange={handleChange} placeholder="URL de foto (opcional)" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción" rows={3} />
        <div style={{display:'flex', gap:12}}>
          <input type="number" name="prep_time_minutes" value={form.prep_time_minutes} onChange={handleChange} min={1} placeholder="Minutos" />
          <input type="number" name="servings" value={form.servings} onChange={handleChange} min={1} placeholder="Raciones" />
        </div>
        <textarea
          name="instructionsText"
          value={form.instructionsText}
          onChange={handleChange}
          placeholder="Instrucciones (una por línea)"
          rows={6}
          required
        />
        <div style={{display:'flex', gap:8}}>
          <button type="submit">{id ? 'Guardar cambios' : 'Crear'}</button>
          <button type="button" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
