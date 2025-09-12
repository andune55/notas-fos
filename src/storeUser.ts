import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
      login: (token, usuario) => set({ token, usuario }),
      logout: () => set({ token: null, usuario: null })
    }),
    { name: 'user-store' }
  )
)