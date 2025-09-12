import React, { useState } from "react"
import { useUserStore } from "../storeUser"

export default function Login() {
  const login = useUserStore(s => s.login)
  const [usuario, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      })
      const data = await res.json()
      if (res.ok) {
        login(data.token, data.usuario)
      } else {
        setError(data.error || data.message || "Login incorrecto")
      }
    } catch (err) {
      setError("Hubo un problema con la conexión. Inténtalo de nuevo.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-100 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/symphony.png')]">
      <div className="bg-white rounded-2xl shadow-xl px-8 py-8 w-full max-w-md flex flex-col items-center">
        {/* Icono/Logo */}
        <div className="mb-2 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center mb-2">
            {/* Icono de usuario */}
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.252 2.252 0 013.182 3.182l-9.78 9.78a2 2 0 01-.83.48l-3.02.806a.5.5 0 01-.606-.606l.805-3.02a2 2 0 01.48-.83l9.769-9.782z"/>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l3 3"/>
  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h8"/>
</svg>
          </div>
          <h2 className="font-semibold text-lg text-gray-800">App de Notas FOS</h2>
          <p className="text-sm text-gray-400">Lógate con tu cuenta</p>
        </div>
        <h3 className="text-2xl font-bold text-blue-800 mb-4 text-center">Iniciar Sesión para poder gestionar notas</h3>

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="usuario"
            value={usuario}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
              tabIndex={-1}
              onClick={() => setShowPass(v => !v)}
            >
              {/* Icono mostrar/ocultar */}
              {showPass ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4.03-9-9 0-1.17.213-2.29.6-3.325M3.6 7.675l16.8 8.65"/>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.035.12-.075.237-.12.352"/>
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 13V7a5 5 0 00-10 0v6M12 17v2m-6-2h12"/>
            </svg>
            Entrar
          </button>
          {error && <div className="text-red-600 text-center mt-2">{error}</div>}
        </form>
      </div>
    </div>
  )
}