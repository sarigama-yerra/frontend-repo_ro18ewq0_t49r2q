import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false)

  const role = user?.role

  return (
    <header className="bg-[#072B1A] text-white sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            <Menu />
          </button>
          <span className="font-bold text-lg">Campusportalen</span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <a href="#meals" className="hover:underline">Kantine</a>
          <a href="#events" className="hover:underline">Events</a>
          <a href="#news" className="hover:underline">Nyheder</a>
          <a href="#stats" className="hover:underline">Statistik</a>
          {role === 'admin' && (
            <a href="#admin" className="bg-[#17C178] text-[#072B1A] px-3 py-1 rounded font-semibold">Admin</a>
          )}
          {user ? (
            <button onClick={onLogout} className="ml-2 text-sm underline">Log ud</button>
          ) : null}
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10">
          <nav className="max-w-5xl mx-auto px-4 py-2 flex flex-col gap-2">
            <a href="#meals" className="py-2">Kantine</a>
            <a href="#events" className="py-2">Events</a>
            <a href="#news" className="py-2">Nyheder</a>
            <a href="#stats" className="py-2">Statistik</a>
            {role === 'admin' && (
              <a href="#admin" className="py-2">Admin</a>
            )}
            {user ? (
              <button onClick={onLogout} className="py-2 text-left">Log ud</button>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  )
}
