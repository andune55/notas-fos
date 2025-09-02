import { NotaProvisional, Nota } from './types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import {
  apiGetLists,
  apiCreateList,
  apiDeleteList,
  apiGetNotes,
  apiCreateNote,
  apiUpdateNote,
  apiDeleteNote,
  apiReorderNotes,
  apiReplaceListNotes
} from './helpers/api'

type NotasPorLista = {
  [nombreLista: string]: Nota[]
}

type NotaState = {
  listas: NotasPorLista
  listaActiva: string

  initFromServer: () => Promise<void>

  cambiarListaActiva: (nombre: string) => void
  crearLista: (nombre: string) => void
  eliminarLista: (nombre: string) => void
  importarLista: (nombre: string, notas: Nota[]) => void

  cambiarOrdenNotas: (notasnuevas: Nota[]) => void
  addNota: (nota: NotaProvisional) => void
  removeNota: (id: Nota['id']) => void
  editingId: Nota['id']
  editNotaById: (id: Nota['id']) => void
  updateNote: (data: NotaProvisional) => void
  modal: boolean
  openModal: () => void
  closeModal: () => void

  borrarId: string | null
  openDeleteModal: (id: string) => void
  closeDeleteModal: () => void

  mostrarNavegacion: () => void
}

export const useNotaStore = create<NotaState>()(
  devtools(
    persist(
      (set, get) => ({
        listas: { 'Mi lista': [] },
        listaActiva: 'Mi lista',

        // CARGA TODAS LAS LISTAS + NOTAS (no sobreescribe a una sola)
        initFromServer: async () => {
          try {
            const lists = await apiGetLists()
            if (!lists.length) return

            const pairs = await Promise.all(
              lists.map(async (l) => {
                const notasDTO = await apiGetNotes(l.key)
                const notas: Nota[] = notasDTO.map(n => ({ id: n.id, txtNota: n.txtNota }))
                return [l.key, notas] as const
              })
            )

            const listasObj = Object.fromEntries(pairs) as NotasPorLista
            const prevActiva = get().listaActiva
            const activa = prevActiva && listasObj[prevActiva] ? prevActiva : lists[0].key

            set({
              listas: listasObj,
              listaActiva: activa
            })
          } catch (e) {
            console.error('initFromServer error', e)
          }
        },

        cambiarListaActiva: (nombre) => {
          const state = get()
          set({ listaActiva: nombre })
          if (!state.listas[nombre]) {
            ;(async () => {
              try {
                const notasDTO = await apiGetNotes(nombre)
                const notas: Nota[] = notasDTO.map(n => ({ id: n.id, txtNota: n.txtNota }))
                set(s => ({ listas: { ...s.listas, [nombre]: notas } }))
              } catch (e) {
                console.error('cambiarListaActiva: error cargando notas', e)
              }
            })()
          }
        },

        crearLista: (nombre) => {
          set((state) => ({
            listas: {
              ...state.listas,
              [nombre]: []
            },
            listaActiva: nombre
          }))
          ;(async () => {
            try {
              await apiCreateList(nombre, nombre)
            } catch (e) {
              console.error('crearLista error', e)
            }
          })()
        },

        eliminarLista: (nombre) => {
          set((state) => {
            const nuevasListas = { ...state.listas }
            delete nuevasListas[nombre]
            let nuevaActiva = state.listaActiva
            if (nombre === state.listaActiva) {
              nuevaActiva = Object.keys(nuevasListas)[0] || ''
            }
            return {
              listas: nuevasListas,
              listaActiva: nuevaActiva
            }
          })
          ;(async () => {
            try {
              await apiDeleteList(nombre)
            } catch (e) {
              console.error('eliminarLista error', e)
            }
          })()
        },

        importarLista: (nombre, notas) => {
          set((state) => ({
            listas: {
              ...state.listas,
              [nombre]: notas
            },
            listaActiva: nombre
          }))
          ;(async () => {
            try {
              await apiReplaceListNotes(
                nombre,
                notas.map((n, idx) => ({ id: n.id, txtNota: n.txtNota, position: idx }))
              )
            } catch (e) {
              console.error('importarLista error', e)
            }
          })()
        },

        cambiarOrdenNotas: (notasnuevas: Nota[]) => {
          set((state) => ({
            listas: {
              ...state.listas,
              [state.listaActiva]: notasnuevas
            }
          }))
          ;(async () => {
            try {
              const key = get().listaActiva
              await apiReorderNotes(key, notasnuevas.map(n => n.id))
            } catch (e) {
              console.error('cambiarOrdenNotas error', e)
            }
          })()
        },

        addNota: (nota: NotaProvisional) => {
          ;(async () => {
            try {
              const key = get().listaActiva
              const created = await apiCreateNote(key, nota.txtNota)
              const nueva: Nota = { id: created.id, txtNota: created.txtNota }
              set((state) => ({
                listas: {
                  ...state.listas,
                  [key]: [...(state.listas[key] || []), nueva]
                }
              }))
            } catch (e) {
              console.error('addNota error', e)
            }
          })()
        },

        removeNota: (id) => {
          set((state) => ({
            listas: {
              ...state.listas,
              [state.listaActiva]: state.listas[state.listaActiva].filter(nota => nota.id !== id)
            }
          }))
          ;(async () => {
            try {
              await apiDeleteNote(id)
            } catch (e) {
              console.error('removeNota error', e)
            }
          })()
        },

        editingId: '',
        editNotaById: (id) => {
          set(() => ({
            editingId: id,
            modal: true
          }))
        },

        updateNote: (data) => {
          const id = get().editingId
          if (!id) return
          set((state) => ({
            listas: {
              ...state.listas,
              [state.listaActiva]: state.listas[state.listaActiva].map(nota =>
                nota.id === id ? { id, ...data } : nota
              )
            },
            editingId: '',
            modal: false
          }))
          ;(async () => {
            try {
              await apiUpdateNote(id, { text: data.txtNota })
            } catch (e) {
              console.error('updateNote error', e)
            }
          })()
        },

        modal: false,
        openModal: () => { set({ modal: true }) },
        closeModal: () => { set({ modal: false, editingId: '' }) },

        borrarId: null,
        openDeleteModal: (id) => set({ borrarId: id }),
        closeDeleteModal: () => set({ borrarId: null }),

        mostrarNavegacion: () => {
          let nav = document.getElementById('nav')
          nav?.classList.toggle('active')
        }
      }),
      {
        name: 'nota-remote-cache'
      }
    )
  )
)