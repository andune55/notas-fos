import { LeadingActions, SwipeableList, SwipeableListItem, SwipeAction, TrailingActions} from 'react-swipeable-list'
import { Nota } from '../types/index'
import { useNotaStore } from '../store'

import "react-swipeable-list/dist/styles.css"

type NotaDetailsProps = {
    nota : Nota
}

export default function NotaDetail({nota} : NotaDetailsProps) {

    const { removeNota , getNotaById } = useNotaStore()

    //const categoryInfo = useMemo(() => categories.filter(cat => cat.id === expense.category)[0],[expense])

    const leadingActions = () => (
        <LeadingActions>
            {/* <SwipeAction onClick={() => dispatch({type: "get-expense-by-id", payload: {id: expense.id}})}> */}
            <SwipeAction onClick={() => getNotaById(nota.id)}>
                Actualizar
            </SwipeAction>
        </LeadingActions>
    )
    const trailingActions = () => (
        <TrailingActions>
            <SwipeAction 
                onClick={() => removeNota(nota.id)}
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

            <div className="bg-white shadow-lg p-3 w-full border-b border-gray-200 flex gap-2 items-start">
                <div>
                    <img 
                        // src={`./icono_${categoryInfo.icon}.svg`} 
                        src="./ico-notas1.png"
                        alt="icono gasto"
                        className='w-10 shrink-0'
                        width="10"
                        height="10"
                    />
                </div>

                <div className='flex-1'>
                    <p className="text-sm font-bold uppercase text-slate-500">{`${nota.id} `}</p>
                    <p>{nota.txtNota}</p>
                    {/* <p className="text-slate-600 text-sm">{ formatDate( expense.date!.toString() ) }</p> */}
                </div>

                {/* <AmountDisplay
                    amount={expense.amount}
                /> */}
            </div>

        </SwipeableListItem>
    </SwipeableList>
    )
}
