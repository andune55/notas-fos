import { useMemo, useState, useEffect } from "react"
import NotaDetail from "./NotaDetail"
import { useNotaStore } from '../store'
import {
    DndContext,
    closestCorners,
    TouchSensor,
    MouseSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'


export default function NotasList() {
    const { listas, listaActiva, cambiarOrdenNotas } = useNotaStore()
    const notas = listas[listaActiva] ?? []

    const isEmpty = useMemo(() => notas.length === 0, [notas])
    const [posicionNotas, setPosicionNotas] = useState(notas)
    const [activeId, setActiveId] = useState<string | null>(null)

    useEffect(() => setPosicionNotas(notas), [notas])
    useEffect(() => cambiarOrdenNotas(posicionNotas), [posicionNotas])

    const getNotePosition = (id: string) => notas.findIndex(notas => notas.id === id)
    const handleDragStart = (event: { active: any }) => {
        setActiveId(event.active.id);
    }
    const handleDragEnd = (event: { active: any; over: any }) => {
        setActiveId(null);
        const { active, over } = event
        if (!over || active.id === over.id) return
        setPosicionNotas((posicionNotas) => {
            const originalPos = getNotePosition(active.id)
            const newPos = getNotePosition(over.id)
            return arrayMove(posicionNotas, originalPos, newPos)
        })
    }

    const mouseSensor = useSensor(MouseSensor)
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 150,
            tolerance: 5
        }
    })
    const sensors = useSensors(mouseSensor, touchSensor)

    const activeNota = posicionNotas.find(nota => nota.id === activeId)

    return (
        <div className="z-4 w-[98%] max-w-[1440px] max-sm:w-full mx-auto py-5 mt-0 max-sm:pt-[350px] max-md:pt-[250px]">
            <p className="mb-3.5 text-gray-600 text-xl font-bold text-center">
                {isEmpty ? 'Graba alguna nota' : 'Listado de notas'}
            </p>
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                collisionDetection={closestCorners}
            >
                <SortableContext items={notas} strategy={verticalListSortingStrategy}>
                    {posicionNotas.map(nota => (
                        <NotaDetail
                            key={nota.id}
                            nota={nota}
                            id={nota.id}
                        />
                    ))}
                </SortableContext>
                <DragOverlay>
                    {activeNota ? (
                        <NotaDetail nota={activeNota} id={activeNota.id} isOverlay />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    )
}