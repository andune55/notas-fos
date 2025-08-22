import { useNotaStore } from '../store'
import { useRef } from 'react'
import { toast } from 'react-toastify'

export default function ListaSelector() {
    const {
        listas, listaActiva, cambiarListaActiva, crearLista, eliminarLista, importarLista, mostrarNavegacion
    } = useNotaStore()

    // NUEVO: exportar todas o solo la activa
    const exportarLista = (nombre: string) => {
        const notas = listas[nombre] || []
        const blob = new Blob([JSON.stringify(notas, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.download = `notas_${nombre}.json`
        link.href = url
        link.click()
    }
    const exportarTodo = () => {
        const blob = new Blob([JSON.stringify(listas, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.download = "todas_las_listas.json"
        link.href = url
        link.click()
    }

    // Importar desde JSON (una lista o todas)
    const inputFileRef = useRef<HTMLInputElement | null>(null)
    const importar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (evt) => {
            try {
                const data = JSON.parse(evt.target?.result as string)
                // Si es objeto con muchas listas
                if (typeof data === "object" && !Array.isArray(data)) {
                    Object.entries(data).forEach(([nombre, notas]) => {
                        if (Array.isArray(notas)) {
                            importarLista(nombre, notas as any)
                        }
                    })
                    toast.success("Listas importadas")
                }
                // Si es array de notas => lista única
                else if (Array.isArray(data)) {
                    const nombre = prompt("Nombre para la lista importada:", "Lista importada")
                    if (nombre) {
                        importarLista(nombre, data)
                        toast.success("Lista importada")
                    }
                }
                else {
                    throw new Error()
                }
            } catch {
                toast.error("Archivo inválido")
            }
        }
        reader.readAsText(file)
        e.target.value = ""
    }

    // Crear nueva lista
    const crearHandler = () => {
        const nombre = prompt("Nombre para la nueva lista:")
        if (nombre && !listas[nombre]) {
            crearLista(nombre)
            toast.success("Lista creada")
        } else if (nombre) {
            toast.error("Ya existe una lista con ese nombre")
        }
    }
    // Eliminar lista activa
    const eliminarHandler = () => {
        if (Object.keys(listas).length <= 1) {
            toast.error("No puedes eliminar la única lista")
            return
        }
        if (window.confirm(`¿Seguro que quieres borrar la lista "${listaActiva}"?`)) {
            eliminarLista(listaActiva)
            toast.success("Lista eliminada")
        }
    }   

    return (
        <div className="flex flex-col flex-wrap gap-2 my-2 w-full">
            
            <div className="flex items-center">
                <label className="font-bold mr-2">Lista:</label>
                <select
                    className="border px-2 py-1 rounded"
                    value={listaActiva}
                    onChange={e => cambiarListaActiva(e.target.value)}
                >
                    {Object.keys(listas).map(nombre => (
                        <option key={nombre} value={nombre}>{nombre}</option>
                    ))}
                </select>
                    
                
                <input id='show0' type='checkbox'/>
                <div className='menu-button-container ml-2' id='show-menu' onClick={mostrarNavegacion}>
                    <div className='menu-button'/>
                </div>

                <div className="navEscritorio start">
                    <button className="bg-blue-700 text-white px-2 ml-1 py-1 rounded" onClick={crearHandler}>
                        Nueva
                    </button>
                    <button className="bg-red-700 text-white px-2 ml-1 py-1 rounded" onClick={eliminarHandler}>
                        Eliminar
                    </button>
                    <button className="bg-orange-600 text-white px-2 ml-1 py-1 rounded" onClick={() => exportarLista(listaActiva)}>
                        Exportar
                    </button>
                    <button className="bg-orange-600 text-white px-2 ml-1 py-1 rounded" onClick={exportarTodo}>
                        Exportar todas
                    </button>
                    <button className="bg-green-700 text-white px-2 ml-1 py-1 rounded" onClick={() => inputFileRef.current?.click()}>
                        Importar
                    </button>
                </div>    


                <div id='nav' className='navigation'>
                    <div className='navigation__inner'>
                
                    <ul id='main-menu-nav' role='menubar'>
                        <li id="xCerrar" className='pointer text-end' onClick={mostrarNavegacion}>
                        <span className='mr-5 text-3xl text-white'>X</span>
                        </li>
                            <li><button className="bg-blue-700 text-white px-3 py-1 rounded" onClick={crearHandler}>
                                Nueva lista
                            </button></li>
                            <li><button className="bg-red-700 text-white px-3 py-1 rounded" onClick={eliminarHandler}>
                                Eliminar lista
                            </button></li>
                            <li><button className="bg-orange-600 text-white px-3 py-1 rounded" onClick={() => exportarLista(listaActiva)}>
                                Exportar activa
                            </button></li>
                            <li><button className="bg-orange-600 text-white px-3 py-1 rounded" onClick={exportarTodo}>
                                Exportar todas
                            </button></li>
                            <li><button className="bg-green-700 text-white px-3 py-1 rounded" onClick={() => inputFileRef.current?.click()}>
                                Importar
                            </button></li>
                            <input
                                type="file"
                                accept=".json,application/json"
                                ref={inputFileRef}
                                onChange={importar}
                                style={{ display: "none" }}
                            />
                        </ul>
                    </div>
                </div>
            </div>


            




            
        </div>
    )
}