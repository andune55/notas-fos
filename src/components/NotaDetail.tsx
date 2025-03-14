import { LeadingActions, SwipeableList, SwipeableListItem, SwipeAction, TrailingActions} from 'react-swipeable-list'
import { Nota } from '../types/index'
import { useNotaStore } from '../store'
import "react-swipeable-list/dist/styles.css"
import { toast } from 'react-toastify';


type NotaDetailsProps = {
    nota : Nota
}

export default function NotaDetail({nota} : NotaDetailsProps) {

    const { removeNota, editNotaById } = useNotaStore()

    //const categoryInfo = useMemo(() => categories.filter(cat => cat.id === expense.category)[0],[expense])

    //let notaEditar = useMemo(() => notas.filter(nota => nota.id === editingId)[0],[editingId])

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

    return (
     <SwipeableList>  
        <SwipeableListItem            
            leadingActions = {leadingActions()}
            trailingActions = {trailingActions()}
        >

            <div className="contenedor-notas shadow-lg p-3 w-full flex gap-2 items-center">
                
                <img 
                    // src={`./icono_${categoryInfo.icon}.svg`} 
                    src="./ico-notas1.png"
                    alt="icono gasto"
                    className='w-9 shrink-0 ml-1.25'
                    width="10"
                    height="10"
                />
                
                <div className='flex-1'>
                    <p className="text-[16px] leading-4 text-slate-700">{nota.txtNota}</p>
                    {/* <p className='text-[12px] text-neutral-400'>{`${nota.id} `}</p> */}                    
                </div>


                {/* <AmountDisplay
                    amount={expense.amount}
                /> */}
            </div>

        </SwipeableListItem>
    </SwipeableList>
    )
}
