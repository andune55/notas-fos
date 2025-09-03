
const BASE = import.meta.env.VITE_API_BASE_URL as string
const API_KEY = import.meta.env.VITE_API_KEY as string | undefined

function getToken() {
  try {
    const raw = localStorage.getItem('user-store')
    if (!raw) return null
    const state = JSON.parse(raw).state
    return state.token || null
  } catch {
    return null
  }
}

function headers() {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (API_KEY) h['X-API-Key'] = API_KEY
  const token = getToken()
  if (token) h['Authorization'] = 'Bearer ' + token
  return h
}

export type ListDTO = { id: string; key: string; name: string; createdAt: string; noteCount: number }
export type NoteDTO = { id: string; listKey: string; txtNota: string; position: number }

export async function apiGetLists(): Promise<ListDTO[]> {
  const r = await fetch(`${BASE}/lists`, { headers: headers() })
  if (!r.ok) throw new Error('Error obteniendo listas')
  const j = await r.json()
  return j.lists as ListDTO[]
}

export async function apiCreateList(key: string, name: string) {
  const r = await fetch(`${BASE}/lists`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ key, name })
  })
  if (!r.ok) throw new Error('Error creando lista')
  return r.json() as Promise<{ id: string; key: string; name: string }>
}

export async function apiDeleteList(key: string) {
  const r = await fetch(`${BASE}/lists/${encodeURIComponent(key)}`, {
    method: 'DELETE',
    headers: headers()
  })
  if (!r.ok && r.status !== 204) throw new Error('Error eliminando lista')
}

export async function apiGetNotes(key: string): Promise<NoteDTO[]> {
  const r = await fetch(`${BASE}/lists/${encodeURIComponent(key)}/notes`, { headers: headers() })
  if (!r.ok) throw new Error('Error obteniendo notas')
  const j = await r.json()
  return j.notes as NoteDTO[]
}

export async function apiCreateNote(key: string, text: string): Promise<NoteDTO> {
  const r = await fetch(`${BASE}/lists/${encodeURIComponent(key)}/notes`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ text })
  })
  if (!r.ok) throw new Error('Error creando nota')
  return r.json() as Promise<NoteDTO>
}

export async function apiUpdateNote(id: string, patch: Partial<{ text: string; position: number; listKey: string }>): Promise<NoteDTO> {
  const r = await fetch(`${BASE}/notes/${id}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify(patch)
  })
  if (!r.ok) throw new Error('Error actualizando nota')
  return r.json() as Promise<NoteDTO>
}

export async function apiDeleteNote(id: string) {
  const r = await fetch(`${BASE}/notes/${id}`, { method: 'DELETE', headers: headers() })
  if (!r.ok && r.status !== 204) throw new Error('Error eliminando nota')
}

export async function apiReorderNotes(listKey: string, orderIds: string[]) {
  const r = await fetch(`${BASE}/lists/${encodeURIComponent(listKey)}/notes/reorder`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ order: orderIds })
  })
  if (!r.ok) throw new Error('Error reordenando notas')
  return r.json()
}

// Utilidad para reemplazar todas las notas de una lista (para tu importarLista)
export async function apiReplaceListNotes(listKey: string, notes: Array<{ id?: string; txtNota: string; position?: number }>) {
  // Usamos el endpoint /import para una sola lista
  const r = await fetch(`${BASE}/import`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      lists: [
        {
          key: listKey,
          name: listKey,
          notes
        }
      ]
    })
  })
  if (!r.ok) throw new Error('Error importando notas')
  return r.json()
}