import { useEffect, useRef } from "react"
import ListaSelector from "./ListaSelector"

export default function Header() {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const setVar = () => {
      const h = Math.ceil(el.getBoundingClientRect().height)
      // expone la altura del header para usarla debajo
      document.documentElement.style.setProperty("--app-header-h", `${h}px`)
    }

    setVar()

    // Recalcula si el header cambia de tamaño (responsive, fuentes, etc.)
    const ro = new ResizeObserver(setVar)
    ro.observe(el)

    // Por si acaso en móviles
    window.addEventListener("resize", setVar)
    window.addEventListener("orientationchange", setVar)

    return () => {
      ro.disconnect()
      window.removeEventListener("resize", setVar)
      window.removeEventListener("orientationchange", setVar)
    }
  }, [])

  return (
    <header
      ref={ref}
      className="w-full bg-white shadow flex flex-col sm:flex-row items-center justify-between px-4 py-3 sticky top-0 z-30"
    >
      <div className="flex items-center space-x-3">
        <img src="/ico-notas1.png" className="w-10 h-10" alt="logo" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight drop-shadow">
          2Dús
        </h1>
      </div>
      <div className="mt-3 sm:mt-0">
        <ListaSelector />
      </div>
    </header>
  )
}