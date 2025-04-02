import { NotaProvisional, Nota } from './types/index'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'



type NotaState = {
    notas: Nota[]
    cambiarOrdenNotas: (notas: Nota) => void
    addNota: (nota: NotaProvisional) => void
    removeNota: (id:Nota['id']) => void
    editingId: Nota['id']
    editNotaById: (id:Nota['id']) => void
    updateNote: (data: NotaProvisional) => void
    modal: boolean
    openModal: () => void 
    closeModal: () => void 
}

const createNotaConId = (nota: NotaProvisional ) : Nota => {
    return {
        ...nota,
        id: uuidv4()
    }
}

export const useNotaStore = create<NotaState>()(
    devtools(
        persist( (set) => ({
        //(set) => ({
            notas: [],   
            cambiarOrdenNotas: (notas:Nota) => {                     
                set((state) => ({
                    notas: [...state.notas,notas]
                    //modal: false             
                }))
            },                                         
            addNota: (nota: NotaProvisional) => {    
                const notaConId = createNotaConId(nota)                     
                set((state) => ({
                    notas: [...state.notas,notaConId]
                    //modal: false             
                }))
            },
            removeNota: (id:Nota['id']) => {    
                set((state) => ({             
                    ...state.notas,
                    notas: state.notas.filter( nota => nota.id !== id)                               
                }))                
            },
            editingId: '',  
            editNotaById: (id:Nota['id']) => {    
                set(() => ({             
                    editingId: id,
                    modal: true     
                }))                
            },
            updateNote: (data:NotaProvisional) => {
                set((state) => ({
                    notas: state.notas.map( nota => nota.id === state.editingId ? {id: state.editingId, ...data } : nota),
                    editingId: '',
                    modal: false
                }))
                
  //   toast.info('Nota actualizada')
            },
            modal: false,
            openModal: () => {
                set(() => ({
                    modal: true
                }))
            },
            closeModal: () => {
                set(() => ({
                    modal: false
                }))
            }
        }
        ),
        {
            name: 'nota-storage'
            // storage: createJSONStorage (() => sessionStorage)
        }  
        )
    )
) 
