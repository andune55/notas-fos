import { NotaProvisional, Nota } from './types/index';
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid';

type NotaState = {
    notas: Nota[]
    addNota: (nota: NotaProvisional) => void
    removeNota: (id:Nota['id']) => void
    editingId: Nota['id']
    getNotaById: (id:Nota['id']) => void

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
            getNotaById: (id:Nota['id']) => {    
                set((state) => ({             
                    editingId: id
                    //modal: true     
                }))
            }, 
        }
        ),
        {
            name: 'nota-storage'
            // storage: createJSONStorage (() => sessionStorage)
        }  
        )
    )
) 
