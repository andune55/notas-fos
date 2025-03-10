import { useVoiceToText } from "react-speakup"
import { useState, useEffect} from "react"
import { FormEvent } from "react"
import { NotaProvisional } from "../types"
import { useNotaStore } from "../store"
  
const VoiceToText = () => {

    //props de la librería
    const { startListening, transcript, reset } = useVoiceToText({lang:'ES', continuous:false})
    
    //state local
    const [nota, setNota] = useState<NotaProvisional>({
        txtNota: ''
    })

    //fcn de mi store para añadir la nota
    const { addNota } = useNotaStore()

    //fcn lanzada desde el boton grabar nota para poner a cero transcript y empezar a escuchar
    const handleGrabar = () =>{
        reset()
        startListening()        
    }

    //En cuanto cambie el value del transcript si es !=0 sacarlo en consola y guardarlo en el state local
    useEffect(() => {
        if(transcript!='') {
            console.log(transcript)
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
        
        if(input.value!='')
            addNota(nota)  
    }

    //   useEffect(() => { //cada vez que cambie el state de nota individual, añadala al state global de Zustand que contiene las notas         
    //     addNota(nota)
    //     }
    //   , [nota.txtNota])

    //   const handleParar = (event: FormEvent<HTMLFormElement>) => {
    //     stopListening
    //     const { elements } = event.currentTarget
    //     const input = elements.namedItem('nota')        
    //     input.value=transcript
    //   }

  return (
    <div>
        <div className="text-center flex flex-col w-[95%] max-sm:w-[100%] mx-auto bg-white shadow-lg rounded-lg p-5 max-sm:p-1.25">
            <h1 className='font-bold text-xl text-center mb-1.25 bg-amber-700 text-white'>App notas FOS</h1>
        
            <div className="flex align-middle justify-start">
                <button 
                    className="cursor-pointer bg-amber-600 max-sm:w-full mt-3 py-2 px-4 text-white uppercase font-bold rounded-lg shrink-0" 
                    onClick={handleGrabar}
                >
                    Grabar nota
                </button>
                {/* <button 
                    className="cursor-pointer bg-amber-600 max-sm:w-full mt-3 ml-3 py-2 px-4 text-white uppercase font-bold rounded-lg shrink-0" 
                    onClick={stopListening}
                >
                    Parar de grabar 
                </button> */}
                <div className="ml-2.5 mt-3">
                    {/* <div className="p-2.5 min-w-[250px] border-1 border-neutral-200 rounded-xl">{transcript}</div> */}
                    <form className="flex gap-2" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="w-full bg-white border border-gray-200 p-2"
                            placeholder="Aquí va el texto de la nota"                        
                            name="nota"
                            value={transcript}  
                            onChange={()=>{}}                      
                        />
                        
                        <button 
                            className="ml-2.5 cursor-pointer disabled:opacity-25" 
                            type="submit"
                            disabled={false}
                        >
                            <img src="/ico-notas1.png" width="64" height="64" className="mx-auto" alt="icono notas" />
                        </button>

                        <button 
                            className="bg-red-600 max-sm:w-full mt-3 ml-1.25 py-2 px-4 text-white uppercase font-bold rounded-3xl cursor-pointer" 
                            onClick={reset}
                        >
                            X
                        </button>
                    </form>
                </div>
            </div>           
        
        </div> 
    </div>
  )
}

export default VoiceToText 