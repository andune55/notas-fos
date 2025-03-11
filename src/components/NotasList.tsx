import { useMemo } from "react"
import NotaDetail from "./NotaDetail"
import { useNotaStore } from '../store'

export default function NotasList() {

    const { notas } = useNotaStore()    
    const isEmpty = useMemo(() => notas.length === 0, [notas])

    return (
        <div className="w-[90%] max-w-[1440px] max-sm:w-full mx-auto py-5 mt-5">           
            <>
                <p className="mb-3.5 text-gray-600 text-xl font-bold text-center">{isEmpty ? 'Graba alguna nota' : 'Listado de notas'}</p>                
                {notas.map( nota => (
                    <NotaDetail
                        key = {nota.id}
                        nota = {nota}
                    />
                ))}
            </>
        </div>
    )
}
