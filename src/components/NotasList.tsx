import { useMemo, useState, useEffect } from "react"
import NotaDetail from "./NotaDetail"
import { useNotaStore } from '../store'
import { closestCorners, DndContext } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { formatDate } from "../helpers" 

export default function NotasList() {

    const { notas, cambiarOrdenNotas } = useNotaStore()    
    // const { notas, cambiarOrdenNotas } = useNotaStore()    
    const isEmpty = useMemo(() => notas.length === 0, [notas])
    
    //nuevo state local introducido para esto del orden
    const [posicionNotas,setPosicionNotas] = useState(notas)    
    
    //Cada vez que cambie notas (porque hemos grabado una o añadido con txt) actualice el state local posicionNotas 
    // que es el que utilizo para mapear abajo NotaDetail.tsx
    useEffect(() => setPosicionNotas(notas), [notas])

    //Cada vez que cambie 'posicionNotas' uso nueva función del store 'cambiarOrdenNotas' para cambiar el state notas con el nuevo orden indicado en 'posicionNotas'
    useEffect(() => cambiarOrdenNotas(posicionNotas), [posicionNotas])
    
    //fcn para obtener, en el handleDragEnd, la posición de la nota que arrastro (y las over)
    const getNotePosition = (id: string) => notas.findIndex(notas => notas.id === id) 

    const handleDragEnd = (event: { active: any; over: any }) => {
        const {active, over} = event

        if(active.id === over.id) return
        else{
            setPosicionNotas( (posicionNotas) => {                
                const originalPos = getNotePosition(active.id)    
                //console.log(originalPos)       
                const newPos = getNotePosition(over.id)    
                //console.log(newPos)           
                //console.log(posicionNotas)                
                //console.log(notas)                
                return arrayMove(posicionNotas, originalPos, newPos)                
            })
        }   
    }


    const fecha = new Date()
    let fechaFormateada = formatDate(fecha)

    const guardarLista = () => {
        //https://spin.atomicobject.com/create-export-react-frontend/
        //const fileData = JSON.stringify(notas);
        
        const textoNotas = notas.map((nota)=>(
            `${nota.txtNota}\n`
        ))
        const exportado = `${fechaFormateada}: \n${textoNotas.join('')}`

        const blob = new Blob([exportado], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "notas.txt";
        link.href = url;
        link.click();
      }      
      

    return (
        <div className="z-4 w-[90%] max-w-[1440px] max-sm:w-full mx-auto py-5 mt-0">           
            <>
                <p className="mb-3.5 text-gray-600 text-xl font-bold text-center">{isEmpty ? 'Graba alguna nota' : 'Listado de notas'} - <button id="link-descarga" className="underline" onClick={guardarLista}>Guardar Lista</button></p>                
                
                {/* <DndContext collisionDetection={closestCorners}> */}
                <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                    <SortableContext items={notas} strategy={verticalListSortingStrategy}>                        
                          {/* {notas.map( nota => ( */}
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
