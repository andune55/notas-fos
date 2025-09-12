import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// IMPORTANTE: importa tu store de notas
import { useNotaStore } from './store' // Ajusta la ruta si tu archivo se llama diferente

type UserState = {
  token: string | null
  usuario: string | null
  login: (token: string, usuario: string) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      login: (token, usuario) => {
        // Limpiar la caché de notas al cambiar de usuario (y al iniciar sesión)
        if (useNotaStore.persist?.clearStorage) {
          useNotaStore.persist.clearStorage()
        }
        // Además, resetea el estado de notas en memoria
        useNotaStore.setState({ listas: { 'Mi lista': [] }, listaActiva: 'Mi lista' })
        set({ token, usuario })
      },
      logout: () => {
        if (useNotaStore.persist?.clearStorage) {
          useNotaStore.persist.clearStorage()
        }
        useNotaStore.setState({ listas: { 'Mi lista': [] }, listaActiva: 'Mi lista' })
        set({ token: null, usuario: null })
      }
    }),
    { name: 'user-store' }
  )
)