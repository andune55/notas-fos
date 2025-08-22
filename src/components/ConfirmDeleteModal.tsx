import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useNotaStore } from '../store'
import { toast } from 'react-toastify'

export default function ConfirmDeleteModal() {
    const { borrarId, closeDeleteModal, removeNota, listas, listaActiva } = useNotaStore()
    if (!borrarId) return null

    // Busca la nota a borrar para mostrar el texto
    const notas = listas[listaActiva] ?? []
    const nota = notas.find(n => n.id === borrarId)

    const handleConfirm = () => {
        removeNota(borrarId)
        toast.error('Nota eliminada: ' + (nota?.txtNota || ''))
        closeDeleteModal()
    }
    return (
        <Transition appear show={!!borrarId} as={Fragment}>
            <Dialog as="div" className="relative z-30" onClose={closeDeleteModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-40" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                                <Dialog.Title className="text-xl font-bold text-red-700 mb-2">
                                    Confirmar borrado
                                </Dialog.Title>
                                <p className="mb-4 text-gray-700">
                                    ¿Seguro que quieres borrar esta nota?
                                </p>
                                <div className="bg-gray-100 rounded p-3 mb-4 text-gray-800">{nota?.txtNota}</div>
                                <div className="flex justify-center gap-3">
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                        onClick={handleConfirm}
                                    >
                                        Borrar
                                    </button>
                                    <button
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                                        onClick={closeDeleteModal}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}