import { useEffect } from 'react'
import { useNotaStore } from './store'
import { useUserStore } from './storeUser'
import VoiceToText from "./components/VoiceToText"
import NotasModal from "./components/NotasModal"
import ConfirmDeleteModal from "./components/ConfirmDeleteModal"
import Login from "./components/Login"
import Logout from "./components/Logout"

function App() {
  const initFromServer = useNotaStore(s => s.initFromServer)
  const token = useUserStore(s => s.token)

  useEffect(() => {
    if (token) {
      initFromServer()
    }
  }, [initFromServer, token])

  if (!token) {
    return <Login />
  }

  return (
    <>
      <Logout/>
      <VoiceToText/>
      <NotasModal/>
      <ConfirmDeleteModal />
    </>
  )
}

export default App