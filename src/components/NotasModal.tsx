import { Fragment, useEffect } from 'react'
// import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { useForm } from 'react-hook-form'
import { Dialog, Transition } from '@headlessui/react'
import { useNotaStore } from '../store'
import { Nota, NotaProvisional } from '../types'

export default function NotasModal() {

  const { notas, modal, closeModal, editingId, updateNote } = useNotaStore()
  const { register, handleSubmit, setValue, reset} = useForm<Nota>()

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
                
                <form className="space-y-5" onSubmit={handleSubmit(registerNota)}>
                  <div className="flex justify-between">
                    
                    <label 
                      htmlFor="expenseName"
                      className="text-xl">
                      Cambiar texto de la nota:
                    </label>
                    <button 
                      className="cursor-pointer grow-0 shrink-0 size-8 bg-[#116D8B] ml-1.25 py-1 px-1 text-white uppercase font-bold rounded-3xl disabled:opacity-25" 
                      onClick={closeModal}
                      >X</button>
                  </div>

                  {/* {error && <ErrorMessage>{error}</ErrorMessage>} */}

                  <div className="flex flex-col gap-2">
                    
                    <textarea 
                      id="txtNota"                      
                      className="w-full bg-white border border-gray-200 p-2 min-h-[90px]"
                      placeholder="Aquí va el texto de la nota" 
                      {...register('txtNota', {
                        required: 'El texto es necesario'
                      })}
                    />
                   
                    {/* <input
                      id="txtNota"
                      type="text"
                      className="w-full bg-white border border-gray-200 p-2"
                      placeholder="Aquí va el texto de la nota" 
                      {...register('txtNota', {
                        required: 'El texto es necesario'
                      })}                                         
                    /> */}
                  </div> 
              
                  <input 
                    type="submit" 
                    className="bg-[#116D8B] cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
                    value='Guardar cambios'
                  />
                  <legend
                      className="grow uppercase text-center text-sm text-gray-500 border-t-3 border-[#116D8B]"
                    // >{editingId ? 'Guardar Cambios' : 'Nuevo gasto'}</legend>
                    >Editando nota {editingId}
                    </legend>
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