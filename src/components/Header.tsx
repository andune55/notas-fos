import ListaSelector from "./ListaSelector"

export default function Header() {
  return (
    <header className="w-full bg-white shadow flex flex-col sm:flex-row items-center justify-between px-4 py-3 sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <img src="/ico-notas1.png" className="w-10 h-10" alt="logo" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight drop-shadow">2Dús</h1>
      </div>
      <div className="mt-3 sm:mt-0">
        <ListaSelector />
      </div>
    </header>
  )
}