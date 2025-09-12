import { NotaProvisional } from "../types"
import { useState, useEffect, FormEvent, useRef } from "react"
import { useNotaStore } from "../store"
import { useVoiceToText } from "react-speakup"
import NotasList from "./NotasList"
import ListaSelector from "./ListaSelector"

import { toast, Bounce, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"

const VoiceToText = () => {
  // props de la librería
  const { startListening, transcript, reset } = useVoiceToText({ lang: 'es-ES', continuous: false })

  // state local
  const [nota, setNota] = useState<NotaProvisional>({ txtNota: '' })

  // store
  const { addNota, openModal, initFromServer } = useNotaStore()

  // Cargar datos desde backend al arrancar (si ya lo hacías en App, puedes quitar esto)
  useEffect(() => {
    if (initFromServer) initFromServer()
  }, [initFromServer])

  // Header sticky: expone --app-header-h con su altura real
  const headerRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const setVar = () => {
      const h = Math.ceil(el.getBoundingClientRect().height)
      document.documentElement.style.setProperty("--app-header-h", `${h}px`)
    }
    setVar()
    const ro = new ResizeObserver(setVar)
    ro.observe(el)
    window.addEventListener("resize", setVar)
    window.addEventListener("orientationchange", setVar)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", setVar)
      window.removeEventListener("orientationchange", setVar)
    }
  }, [])

  // Botones
  const handleGrabar = () => {
    reset()
    startListening()
  }
  const handleBorrar = () => {
    reset()
    setNota({ txtNota: '' })
  }

  // Transcript -> state local
  useEffect(() => {
    if (transcript !== '') {
      setNota({ txtNota: transcript })
    }
  }, [transcript])

  // Guardar
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { elements } = event.currentTarget
    const input = elements.namedItem('nota')
    const isInput = input instanceof HTMLInputElement
    if (!isInput || input === null) return

    if (input.value !== '') {
      addNota(nota)
      toast.success('Nota añadida correctamente')
      reset()
      setNota({ txtNota: '' })
    }
  }

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={1200}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <header
        ref={headerRef}
        className="z-30 sticky top-0 text-center flex flex-col w-[98%] max-w-[1440px] max-sm:w-full mx-auto bg-white shadow-lg rounded-lg p-5 max-sm:p-1.25"
      >
        <h1 className='font-bold text-xl text-center mb-1.25 bg-[#301934] text-white flex justify-center items-center p-1.25'>
          <p>2Dús</p>
          <img className="ml-2.5" src="./ico-notas1.png" width="50" height="50" alt="icono notas" />
        </h1>

        <ListaSelector />

        <div className="flex max-sm:flex-col align-middle justify-start bg-white">
          <div className="flex shrink-0 max-lg:gap-1">
            <button
              className="cursor-pointer bg-amber-600 max-sm:w-[50%] mt-3 py-2 pl-5 pr-6 text-white uppercase font-bold rounded-lg shrink-0"
              onClick={handleGrabar}
              aria-label="Botón para grabar nota de voz"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline size-6 mr-1 sm:max-lg:mr-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
              <span className="lg:hidden">nota</span>
              <span className="max-lg:hidden">Grabar nota</span>
            </button>
            <button
              className="cursor-pointer bg-blue-800 max-sm:w-[50%] ml-3 mt-3 max-sm:ml-0 py-2 px-6 text-white uppercase font-bold rounded-lg shrink-0"
              onClick={openModal}
              aria-label="botón para añadir nota nueva escribiendo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline size-6 mr-1.5 sm:max-lg:mr-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              <span className="lg:hidden">nota</span>
              <span className="max-lg:hidden">Escribir nota</span>
            </button>
          </div>

          <div className="ml-2.5 max-sm:ml-0 mt-3 w-full">
            <form className="flex gap-2 items-center" onSubmit={handleSubmit}>
              <input
                type="text"
                className="nota w-full bg-white border border-gray-200 p-2"
                placeholder="Previsualiza la nota de voz antes de guardar"
                name="nota"
                value={transcript}
                onChange={() => { }}
                readOnly
              />
              <button
                className={`${transcript !== '' && `cursor-pointer`} ml-2.5 disabled:opacity-25 shrink-0`}
                type="submit"
                disabled={transcript === ''}
                aria-label="Guardar nota de voz"
              >
                <img src="./ico-guardar.png" width="40" height="40" className="mx-auto" alt="icono guardar nota de voz" />
              </button>
              <button
                className={`${transcript !== '' && `cursor-pointer`} shrink-0 max-w-[40px] bg-red-600 max-sm:w-full ml-1.25 py-2 px-3.5 text-white uppercase font-bold rounded-3xl disabled:opacity-25`}
                onClick={handleBorrar}
                disabled={transcript === ''}
                aria-label="borrar nota de voz"
                type="button"
              >
                X
              </button>
            </form>
          </div>
        </div>
      </header>

      <NotasList />
    </div>
  )
}

export default VoiceToText