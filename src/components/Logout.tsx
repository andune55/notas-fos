import { useUserStore } from "../storeUser"

export default function Logout() {
  const logout = useUserStore(s => s.logout)
  const email = useUserStore(s => s.email)
  return (
    <div style={{ position: "absolute", top: 15, right: 25 }}>
      <span>{email}</span>
      <button onClick={logout} style={{ marginLeft: 8 }}>Salir</button>
    </div>
  )
}