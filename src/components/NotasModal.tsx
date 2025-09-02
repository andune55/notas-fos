import { Fragment, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, Transition } from '@headlessui/react'
import { useNotaStore } from '../store'
import { Nota, NotaProvisional } from '../types'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"

export default function NotasModal() {
  // Accede a listas y listaActiva, no a 'notas'
  const { listas, listaActiva, modal, closeModal, addNota, editingId, updateNote } = useNotaStore()
  const notas = listas[listaActiva] ?? []

  const { register, handleSubmit, setValue, reset } = useForm<Nota>()

  useEffect(() => {
    if (editingId) {
      // Tipado explícito para evitar 'any'
      const activeNote: Nota | undefined = notas.find((nota: Nota) => nota.id === editingId)
      if (activeNote) setValue('txtNota', activeNote.txtNota)
    }
  }, [editingId, notas, setValue])

  const registerNota = (data: NotaProvisional) => {
    if (editingId) {
      updateNote(data)
    } else {
      addNota(data)
      toast.success('Nota añadida correctamente')
      closeModal()
    }
    reset()
  }

  return (
    <>
      <Transition appear show={modal} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={() => closeModal()}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-65" />
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
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <form className="space-y-5" onSubmit={handleSubmit(registerNota)}>
                    <div className="flex justify-between">
                      <label
                        htmlFor="expenseName"
                        className="text-xl"
                      >
                        {editingId ? 'Cambiar texto de la nota:' : 'Nueva nota'}
                      </label>
                      <button
                        className="cursor-pointer grow-0 shrink-0 size-8 bg-[#116D8B] ml-1.25 py-1 px-1 text-white uppercase font-bold rounded-3xl disabled:opacity-25"
                        onClick={closeModal}
                        type="button"
                      >X</button>
                    </div>
                    <div className="flex flex-col gap-2 border-t-3 border-[#116D8B]">
                      <textarea
                        id="txtNota"
                        className="w-full bg-white border border-gray-200 p-2 min-h-[90px] max-sm:min-h-[150px]"
                        placeholder="Aquí va el texto de la nota"
                        {...register('txtNota', {
                          required: 'El texto es necesario'
                        })}
                      />
                    </div>
                    <input
                      type="submit"
                      className="bg-[#116D8B] cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg mb-5"
                      value={editingId ? 'Guardar Cambios' : 'Añadir nueva nota'}
                    />
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}