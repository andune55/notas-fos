import { NotaProvisional } from "../types"
import { useState, useEffect, FormEvent} from "react"
import { useNotaStore } from "../store"
import { useVoiceToText } from "react-speakup"
import NotasList from "./NotasList"
import ListaSelector from "./ListaSelector"


import { toast, Bounce, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
  
const VoiceToText = () => {
    //props de la librería
    const { startListening, transcript, reset } = useVoiceToText({lang:'es-ES', continuous: false})
    
    //state local
    const [nota, setNota] = useState<NotaProvisional>({
        txtNota: ''
    })

    //fcn de mi store para añadir la nota
    const { addNota, openModal } = useNotaStore()

    //fcn lanzada desde el boton grabar nota para poner a cero transcript y empezar a escuchar
    const handleGrabar = () =>{
        reset()
        startListening()        
    }
    //adema de resetear el transcript queremos inicializar el state local
    const handleBorrar = () => {
        reset()
        setNota({
            txtNota: ''
        })
    }

    //En cuanto cambie el value del transcript si es !=0 guardarlo en el state local
    useEffect(() => {
        if(transcript!='') {
            //console.log(transcript)
            setNota({txtNota: transcript})
        }
    }, [transcript])  

    //Si el valor del input.value!='' llamamos a addNota pasandole la nota (en el store se genera un id)   
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const { elements } = event.currentTarget // los controles de formulario        
        const input = elements.namedItem('nota')
        const isInput = input instanceof HTMLInputElement
        if (!isInput || input === null) return
        
        if(input.value!=''){
            addNota(nota) 
            toast.success('Nota añadida correctamente') 
            reset()
            setNota({
                txtNota: ''
            })
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

            <header className="z-5 sticky top-0 text-center flex flex-col w-[98%] max-w-[1440px] max-sm:w-full mx-auto bg-white shadow-lg rounded-lg p-5 max-sm:p-1.25">
                
                <h1 className='font-bold text-xl text-center mb-1.25 bg-[#301934] text-white flex justify-center items-center p-1.25 cursor '>
                    <p>2Dús</p>
                    <img className="ml-2.5" src="./ico-notas1.png" width="50" height="50" alt="icono notas" />                    
                </h1>    

                <ListaSelector />            
            
                <div className="flex max-sm:flex-col align-middle justify-start bg-white">
                    
                    <div className="flex shrink-0 max-sm:flex-col">
                        <button 
                            className="cursor-pointer bg-amber-600 max-sm:w-full mt-3 py-2 pl-5 pr-6 text-white uppercase font-bold rounded-lg shrink-0" 
                            onClick={handleGrabar}
                            aria-label="Botón para grabar nota de voz"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline size-6 mr-1 sm:max-lg:mr-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                            </svg>
                            <span className="sm:max-lg:hidden">Grabar nota</span>
                        </button>
                        <button 
                            className="cursor-pointer bg-blue-800 max-sm:w-full ml-3 mt-3 max-sm:ml-0 py-2 px-6 text-white uppercase font-bold rounded-lg shrink-0" 
                            onClick={openModal}
                            aria-label="botón para añadir nota nueva escribiendo"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline size-6 mr-1.5 sm:max-lg:mr-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            <span className="sm:max-lg:hidden">Escribir nota</span>
                        </button>
                        {/* <button 
                            className="cursor-pointer bg-amber-600 max-sm:w-full mt-3 ml-3 py-2 px-4 text-white uppercase font-bold rounded-lg shrink-0" 
                            onClick={stopListening}
                        >
                            Parar de grabar 
                        </button> */}
                    </div>

                       

                    <div className="ml-2.5 max-sm:ml-0 mt-3 w-full">
                        {/* <div className="p-2.5 min-w-[250px] border-1 border-neutral-200 rounded-xl">{transcript}</div> */}
                        <form className="flex gap-2 items-center" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                className="nota w-full bg-white border border-gray-200 p-2"
                                placeholder="Previsualiza la nota de voz antes de guardar"                        
                                name="nota"
                                value={transcript}  
                                onChange={()=>{}}  
                                readOnly
                                // onFocus={()=>{}}                    
                            />
                            
                            <button 
                                className={`${transcript!='' && `cursor-pointer`} ml-2.5 disabled:opacity-25 shrink-0`}
                                type="submit"
                                disabled={transcript===''}
                                aria-label="Guardar nota de voz"
                            >
                                <img src="./ico-guardar.png" width="40" height="40" className="mx-auto" alt="icono guardar nota de voz" />
                            </button>

                            <button 
                                className={`${transcript!='' && `cursor-pointer`} shrink-0 max-w-[40px] bg-red-600 max-sm:w-full ml-1.25 py-2 px-3.5 text-white uppercase font-bold rounded-3xl disabled:opacity-25`}
                                onClick={handleBorrar}
                                disabled={transcript===''}
                                aria-label="borrar nota de voz"
                            >
                                X
                            </button>
                        </form>
                    </div>
                </div>  

                
            </header> 


            <NotasList
                // reset={reset}
            />             

        </div>
    )
}

export default VoiceToText 