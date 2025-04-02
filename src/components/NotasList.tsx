import { useMemo, useState } from "react"
import NotaDetail from "./NotaDetail"
import { useNotaStore } from '../store'
import { closestCorners, DndContext } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
//import { Nota } from "../types"

export default function NotasList() {

    const { notas } = useNotaStore()    
    // const { notas, cambiarOrdenNotas } = useNotaStore()    
    const isEmpty = useMemo(() => notas.length === 0, [notas])
    
    //nuevo state local introducido para esto del orden
    const [posicionNotas,setPosicionNotas] = useState(notas)    
    
    //esto es para que cada vez que cambie notas (porque hemos grabado una) actualice el state posicionNotas 
    // que es el que utilizo para mapear abajo NotaDetail.tsx
    useMemo(() => setPosicionNotas(notas), [notas])
    useMemo(() => setPosicionNotas(posicionNotas), [notas])

    //intento cambiar el state global de mi store con mi fcn del store "cambiarOrdenNotas" cada vez que cambie el state local
    //useEffect(() => cambiarOrdenNotas(notas), [posicionNotas])
    
    //fcn para obtener, en el handleDragEnd, la posición de la nota que arrastro (y las over)
    const getNotePosition = (id: string) => notas.findIndex(notas => notas.id === id) 

    const handleDragEnd = (event: { active: any; over: any }) => {
        const {active, over} = event

        if(active.id === over.id) return
        else{
            setPosicionNotas( (posicionNotas) => {                
                const originalPos = getNotePosition(active.id)    
                console.log(originalPos)       
                const newPos = getNotePosition(over.id)    
                console.log(newPos)           
                console.log(posicionNotas)                
                return arrayMove(posicionNotas, originalPos, newPos)                
                //cambiarOrdenNotas(posicionNotas)
            })
            //cambiarOrdenNotas(notas)
        }

        // setPosicionNotas(posicionNotas)
        // setPosicionNotas(notas)        
    }

    return (
        <div className="w-[90%] max-w-[1440px] max-sm:w-full mx-auto py-5 mt-5">           
            <>
                <p className="mb-3.5 text-gray-600 text-xl font-bold text-center">{isEmpty ? 'Graba alguna nota' : 'Listado de notas'}</p>                
                
                {/* <DndContext collisionDetection={closestCorners}> */}
                <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                    <SortableContext items={notas} strategy={verticalListSortingStrategy}>
                        
                        {/* {posicionNotas.map( nota => ( */}
                        {notas.map( nota => (
                            <NotaDetail
                                key = {nota.id}
                                nota = {nota}
                                id = {nota.id}
                            />
                        ))}

                    </SortableContext>
                </DndContext>                
            </>
        </div>
    )
}
