
import { useEffect } from 'react'
import { useNotaStore } from './store'
import VoiceToText from "./components/VoiceToText"
import NotasModal from "./components/NotasModal"

import ConfirmDeleteModal from "./components/ConfirmDeleteModal"

function App() {
   const initFromServer = useNotaStore(s => s.initFromServer)
    useEffect(() => {
    initFromServer()
  }, [initFromServer])

  return (
    <>
      {/* <TextToVoice/> */}
       
      <VoiceToText/>      
      <NotasModal/>
      <ConfirmDeleteModal />

    </>
  )
}

export default App
