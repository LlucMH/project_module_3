export async function probeHealth(): Promise<'ok'|'down'> {
  try {
    const r = await fetch('/api/health')
    if (!r.ok) return 'down'
    const j = await r.json()
    return j?.status === 'ok' ? 'ok' : 'down'
  } catch { return 'down' }
}
