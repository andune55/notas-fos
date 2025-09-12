import { useUserStore } from "../storeUser"

export default function Logout() {
  const logout = useUserStore(s => s.logout)
  const usuario = useUserStore(s => s.usuario)
  return (
    <div style={{ position: "absolute", top: 15, right: 25 }}>
      <span>{usuario}</span>
      <button onClick={logout} style={{ marginLeft: 8 }}>Salir</button>
    </div>
  )
}