import { useMemo, useState, useEffect } from "react"
import NotaDetail from "./NotaDetail"
import { useNotaStore } from '../store'
import { closestCorners, DndContext } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { formatDate } from "../helpers" 

export default function NotasList() {
    const { listas, listaActiva, cambiarOrdenNotas } = useNotaStore()
    const notas = listas[listaActiva] ?? []

    const isEmpty = useMemo(() => notas.length === 0, [notas])
    const [posicionNotas, setPosicionNotas] = useState(notas)

    useEffect(() => setPosicionNotas(notas), [notas])
    useEffect(() => cambiarOrdenNotas(posicionNotas), [posicionNotas])

    const getNotePosition = (id: string) => notas.findIndex(notas => notas.id === id)
    const handleDragEnd = (event: { active: any; over: any }) => {
        const {active, over} = event
        if (active.id === over.id) return
        else {
            setPosicionNotas((posicionNotas) => {
                const originalPos = getNotePosition(active.id)
                const newPos = getNotePosition(over.id)
                return arrayMove(posicionNotas, originalPos, newPos)
            })
        }
    }

    return (
        <div className="z-4 w-[90%] max-w-[1440px] max-sm:w-full mx-auto py-5 mt-0">
            <p className="mb-3.5 text-gray-600 text-xl font-bold text-center">
                {isEmpty ? 'Graba alguna nota' : 'Listado de notas'}
            </p>
            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                <SortableContext items={notas} strategy={verticalListSortingStrategy}>
                    {posicionNotas.map(nota => (
                        <NotaDetail
                            key={nota.id}
                            nota={nota}
                            id={nota.id}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    )
}