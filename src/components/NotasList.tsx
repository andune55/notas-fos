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
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'

export default function NotasList() {
  const { listas, listaActiva, cambiarOrdenNotas } = useNotaStore()
  const notas = listas[listaActiva] ?? []

  const isEmpty = useMemo(() => notas.length === 0, [notas])
  const [posicionNotas, setPosicionNotas] = useState(notas)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => setPosicionNotas(notas), [notas])

  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 5 }
  })
  const sensors = useSensors(mouseSensor, touchSensor)

  const handleDragStart = (event: { active: any }) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: { active: any; over: any }) => {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) return

    setPosicionNotas((current) => {
      const originalPos = current.findIndex(n => n.id === active.id)
      const newPos = current.findIndex(n => n.id === over.id)
      const moved = arrayMove(current, originalPos, newPos)
      // Persistir orden
      cambiarOrdenNotas(moved)
      return moved
    })
  }

  const activeNota = posicionNotas.find(nota => nota.id === activeId)

  return (
    <div className="z-4 w-[98%] max-w-[1440px] max-sm:w-full mx-auto py-5 mt-0 max-sm:pt-[295px] max-md:pt-[250px]">
      <p className="mb-3.5 text-gray-600 text-xl font-bold text-center">
        {isEmpty ? 'Graba alguna nota' : 'Listado de notas'}
      </p>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <SortableContext
          items={posicionNotas.map(n => n.id)}
          strategy={verticalListSortingStrategy}
        >
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