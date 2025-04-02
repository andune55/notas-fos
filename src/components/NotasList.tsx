import { useMemo, useState } from "react"
import NotaDetail from "./NotaDetail"
import { useNotaStore } from '../store'
import { closestCorners, DndContext } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Nota } from "../types"

export default function NotasList() {

    const { notas, cambiarOrdenNotas } = useNotaStore()    
    const isEmpty = useMemo(() => notas.length === 0, [notas])
    
    //nuevo state local introducido para esto del orden
    const [posicionNotas,setPosicionNotas] = useState(notas)    
    
    //esto es para que cada vez que cambie notas porqeu hemos grabado una, actualice el state posicionNotas que es el que utilizo para mapear abajo
    useMemo(() => setPosicionNotas(notas), [notas])
    
    //fcn para obtener, handleDragEnd, la posición de la nota que arrastro (y las over)
    const getNotePosition = (id: string) => notas.findIndex(notas => notas.id === id)
     

    //console.log(getNotePosition)

    const handleDragEnd = (event: { active: any; over: any }) => {
        const {active, over} = event

        //console.log(posicionNotas)
       // console.log(active)
        //console.log(over)        

        if(active.id === over.id) return
        else{
            setPosicionNotas( (posicionNotas) => {
                console.log(posicionNotas)
                const originalPos = getNotePosition(active.id)    
                console.log(originalPos)       
                const newPos = getNotePosition(over.id)    
                console.log(newPos)           
                return arrayMove(posicionNotas, originalPos, newPos)
                //cambiarOrdenNotas(posicionNotas)
            })

            //cambiarOrdenNotas(posicionNotas)
        }

        
        
    }

    return (
        <div className="w-[90%] max-w-[1440px] max-sm:w-full mx-auto py-5 mt-5">           
            <>
                <p className="mb-3.5 text-gray-600 text-xl font-bold text-center">{isEmpty ? 'Graba alguna nota' : 'Listado de notas'}</p>                
                
                {/* <DndContext collisionDetection={closestCorners}> */}
                <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                    <SortableContext items={notas} strategy={verticalListSortingStrategy}>
                        
                        {posicionNotas.map( nota => (
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
