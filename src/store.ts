import { NotaProvisional, Nota } from './types/index'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

type NotaState = {
    notas: Nota[]
    cambiarOrdenNotas: (notasnuevas: Nota[]) => void
    addNota: (nota: NotaProvisional) => void
    removeNota: (id:Nota['id']) => void
    editingId: Nota['id']
    editNotaById: (id:Nota['id']) => void
    updateNote: (data: NotaProvisional) => void
    tacharById: (p:React.ChangeEvent<HTMLParagraphElement>) => void
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
            cambiarOrdenNotas: (notasnuevas: Nota[]) => {                     
                set((state) => ({
                    ...state.notas,
                    notas: notasnuevas          
                }))
            },                                           
            addNota: (nota: NotaProvisional) => {    
                const notaConId = createNotaConId(nota)                     
                set((state) => ({
                    notas: [...state.notas,notaConId]
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
                //toast.info('Nota actualizada')
            },           
            tacharById: (p: React.ChangeEvent<HTMLParagraphElement>) => {
                console.log(p)
                
                p.target.style.textDecoration =
                p.target.style.textDecoration === "line-through" ? "" : "line-through";
              

                // const el = document.getElementsByClassName("contenedor-notas")
                // console.log(el)
                // if (el) {
                //     el.style.display = el.style.display === 'none' ? 'block' : 'none';                                   
                // }

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
