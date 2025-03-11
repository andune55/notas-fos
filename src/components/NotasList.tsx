// import { useMemo } from "react"
import NotaDetail from "./NotaDetail"
import { useNotaStore } from '../store'

export default function NotasList() {

    const { notas } = useNotaStore()    
    //const filteredExpenses = currentCategory ? expenses.filter( expense => expense.category === currentCategory) : expenses
     //const isEmpty = useMemo(() => notas.length === 0, [notas])
    //const isEmpty = useMemo(() => filteredExpenses.length === 0, [filteredExpenses])

   
    
    return (
        <div className="bg-white shadow-lg rounded-lg p-5 mt-5 max-sm:p-1.25">
            {/* {isEmpty ? <p className="text-gray-600 text-xl font-bold text-center">No hay notas</p> : ( */}
                <>
                    <p className="text-gray-600 text-xl font-bold text-center">{(notas.length === 0) ? 'Graba alguna nota' : 'Listado de notas'}</p>
                    {/* {state.expenses.map( expense => ( */}
                    {notas.map( nota => (
                        <NotaDetail
                            key = {nota.id}
                            nota = {nota}
                        />
                    ))}
                </>
            {/* )} */}
        </div>
    )
}
