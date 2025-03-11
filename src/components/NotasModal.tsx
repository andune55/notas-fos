//ExpenseModal.tsx
import { Fragment, useEffect } from 'react'
// import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { useForm } from 'react-hook-form'
import { Dialog, Transition } from '@headlessui/react'
import { useNotaStore } from '../store'
import { Nota, NotaProvisional } from '../types'

export default function NotasModal() {

  const { notas, modal, closeModal, editingId, updateNote } = useNotaStore()
  const { register, handleSubmit, setValue, reset} = useForm<Nota>()

  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()

  //   //actualizar nota
  //   if(editingId){
  //     //editNotaById({id: editingId, ...expense})
  //     console.log('nota a editar '+ editingId)
  //   }
  // }

  useEffect(() => {
    if(editingId) {
        const activeNote = notas.filter( nota => nota.id === editingId)[0]
        //console.log(activeNote.txtNota)
        setValue('txtNota', activeNote.txtNota)        
    } 
  }, [editingId])

  const registerNota = (data: NotaProvisional) => {
    if(editingId) {
      updateNote(data)
    }
    reset()
  }

  // const handleActualiza = () => {
  //event?.preventDefault
  //   handleSubmit(registerNota)
  //   closeModal()
  //   toast.info('Nota actualizada')
  // }

  return (
    <>
      {/* <div className="fixed right-5 bottom-5 flex items-center justify-center">
        <button
          type="button"
          onClick={() => openModal()}
          className='cursor-pointer'
        >
          <PlusCircleIcon className='w-16 h-16 text-blue-600 rounded-full' />
        </button>
      </div> */}

      <Transition appear show={modal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => closeModal() }>
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
                
                {/* <div className="flex justify-end">
                  <button 
                    className="false shrink-0 max-w-[40px] bg-[#116D8B] max-sm:w-full ml-1.25 py-2 px-3.5 text-white uppercase font-bold rounded-3xl disabled:opacity-25" 
                    onClick={closeModal}
                    >X</button>
                </div>                 */}

                <form className="space-y-5" onSubmit={handleSubmit(registerNota)}>
                  <div className="flex justify-between">
                    <legend
                      className="uppercase text-center text-lg text-gray-500 border-b-4 border-[#116D8B] py-2"
                    // >{editingId ? 'Guardar Cambios' : 'Nuevo gasto'}</legend>
                    >Editando nota {editingId}
                    </legend>
                    <button 
                      className="false shrink-0 max-w-[40px] bg-[#116D8B] max-sm:w-full ml-1.25 py-2 px-3.5 text-white uppercase font-bold rounded-3xl disabled:opacity-25" 
                      onClick={closeModal}
                      >X</button>
                  </div>

                  {/* {error && <ErrorMessage>{error}</ErrorMessage>} */}

                  <div className="flex flex-col gap-2">
                    <label 
                      htmlFor="expenseName"
                      className="text-xl">
                      Texto de la nota:
                    </label>
                    <input
                      id="txtNota"
                      type="text"
                      className="w-full bg-white border border-gray-200 p-2"
                      placeholder="Aquí va el texto de la nota" 
                      {...register('txtNota', {
                        required: 'El texto es necesario'
                      })}                                         
                    />
                  </div> 
              
                  <input 
                    type="submit" 
                    className="bg-[#116D8B] cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
                    value='Guardar cambios'
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
