import { NotaProvisional, Nota } from './types/index'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

type NotasPorLista = {
    [nombreLista: string]: Nota[]
}

type NotaState = {
    listas: NotasPorLista
    listaActiva: string
    cambiarListaActiva: (nombre: string) => void
    crearLista: (nombre: string) => void
    eliminarLista: (nombre: string) => void
    importarLista: (nombre: string, notas: Nota[]) => void

    cambiarOrdenNotas: (notasnuevas: Nota[]) => void
    addNota: (nota: NotaProvisional) => void
    removeNota: (id:Nota['id']) => void
    editingId: Nota['id']
    editNotaById: (id:Nota['id']) => void
    updateNote: (data: NotaProvisional) => void
    modal: boolean
    openModal: () => void 
    closeModal: () => void 
}

const createNotaConId = (nota: NotaProvisional ) : Nota => ({
    ...nota,
    id: uuidv4()
})

export const useNotaStore = create<NotaState>()(
    devtools(
        persist( (set, get) => ({
            listas: { "Mi lista": [] },
            listaActiva: "Mi lista",

            cambiarListaActiva: (nombre) => {
                set({ listaActiva: nombre })
            },
            crearLista: (nombre) => {
                set((state) => ({
                    listas: {
                        ...state.listas,
                        [nombre]: []
                    },
                    listaActiva: nombre
                }))
            },
            eliminarLista: (nombre) => {
                set((state) => {
                    const nuevasListas = { ...state.listas }
                    delete nuevasListas[nombre]
                    // Si eliminas la activa, haz activa otra cualquiera
                    let nuevaActiva = state.listaActiva
                    if (nombre === state.listaActiva) {
                        nuevaActiva = Object.keys(nuevasListas)[0] || ""
                    }
                    return {
                        listas: nuevasListas,
                        listaActiva: nuevaActiva
                    }
                })
            },
            importarLista: (nombre, notas) => {
                set((state) => ({
                    listas: {
                        ...state.listas,
                        [nombre]: notas
                    },
                    listaActiva: nombre
                }))
            },
            cambiarOrdenNotas: (notasnuevas: Nota[]) => {
                set((state) => ({
                    listas: {
                        ...state.listas,
                        [state.listaActiva]: notasnuevas
                    }
                }))
            },
            addNota: (nota: NotaProvisional) => {
                const notaConId = createNotaConId(nota)
                set((state) => ({
                    listas: {
                        ...state.listas,
                        [state.listaActiva]: [
                            ...(state.listas[state.listaActiva] || []),
                            notaConId
                        ]
                    }
                }))
            },
            removeNota: (id) => {
                set((state) => ({
                    listas: {
                        ...state.listas,
                        [state.listaActiva]: state.listas[state.listaActiva].filter(nota => nota.id !== id)
                    }
                }))
            },
            editingId: '',  
            editNotaById: (id) => {    
                set(() => ({             
                    editingId: id,
                    modal: true     
                }))                
            },
            updateNote: (data) => {
                set((state) => ({
                    listas: {
                        ...state.listas,
                        [state.listaActiva]: state.listas[state.listaActiva].map(nota =>
                            nota.id === state.editingId ? { id: state.editingId, ...data } : nota
                        )
                    },
                    editingId: '',
                    modal: false
                }))
            },           
            modal: false,
            openModal: () => { set({ modal: true }) },
            closeModal: () => { set({ modal: false, editingId: '' }) }
        }),
        {
            name: 'nota-multilista-storage'
        })
    )
)