import { LeadingActions, SwipeableList, SwipeableListItem, SwipeAction, TrailingActions} from 'react-swipeable-list'
import { Nota } from '../types/index'
import { useNotaStore } from '../store'
import "react-swipeable-list/dist/styles.css"
import { toast } from 'react-toastify'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities' 


type NotaDetailsProps = {
    nota : Nota
    id: string
}


export default function NotaDetail({nota,id} : NotaDetailsProps) {
    //console.log(id)

    // const { removeNota, editNotaById, tacharById } = useNotaStore()
    const { removeNota, editNotaById } = useNotaStore()

    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id})

    //const categoryInfo = useMemo(() => categories.filter(cat => cat.id === expense.category)[0],[expense])

    //let notaEditar = useMemo(() => notas.filter(nota => nota.id === editingId)[0],[editingId])

    // const handleTachar = (p:React.ChangeEvent<HTMLParagraphElement>) =>{
    //     tacharById(p)
    // }

    const handleEditar = (e:Nota['id']) =>{
        editNotaById(e)
        //toast.info(e)
    }
    
    const handleEliminar = (e1:Nota['id'],e2:Nota['txtNota']) =>{
        removeNota(e1)    
        toast.error('Nota eliminada:' + e2)
    }    

    const leadingActions = () => (
        <LeadingActions>
            {/* <SwipeAction onClick={() => dispatch({type: "get-expense-by-id", payload: {id: expense.id}})}> */}
            <SwipeAction onClick={() => handleEditar(nota.id)}>
                Actualizar
            </SwipeAction>
        </LeadingActions>
    )
    const trailingActions = () => (
        <TrailingActions>
            <SwipeAction 
                onClick={() => handleEliminar(nota.id,nota.txtNota)}
                destructive = {true}
            >
                Eliminar
            </SwipeAction>

        </TrailingActions>
    )

    const style={
        transition,
        transform: CSS.Transform.toString(transform)
    }
    return (

        <div style={style} ref={setNodeRef} {...attributes} {...listeners} className="zona-movible">   
            <SwipeableList>  
                <SwipeableListItem            
                    leadingActions = {leadingActions()}
                    trailingActions = {trailingActions()}
                >                    

                    <div className="contenedor-notas shadow-lg p-3 w-full flex gap-2 items-center">  
                        <svg 
                        className="size-10 w-8"
                        onClick={() => handleEditar(nota.id)} 
                        onDoubleClick={() => handleEditar(nota.id)} 
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>

                    <svg 
                        className="size-10 w-8"
                        onClick={() => handleEliminar(nota.id,nota.txtNota)} 
                        onDoubleClick={() => handleEliminar(nota.id,nota.txtNota)} 
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>

                        <img 
                            // src={`./icono_${categoryInfo.icon}.svg`} 
                            src="./ico-notas1.png"
                            alt="icono gasto"
                            className='w-9 shrink-0 ml-1.25'
                            width="10"
                            height="10"
                        />
                        
                        <div className='flex-1'>
                            {/* <p className="text-[16px] leading-4 text-slate-700" onClick={() => handleTachar(nota.txtNota)}>{nota.txtNota}</p> */}
                            <p className="text-[16px] leading-4 text-slate-700">{nota.txtNota}</p>
                            {/* <p className='text-[12px] text-neutral-400'>{`${nota.id} `}</p> */}                    
                        </div>
                    </div>

                    
                </SwipeableListItem>
            </SwipeableList>
        </div>
    )
}
