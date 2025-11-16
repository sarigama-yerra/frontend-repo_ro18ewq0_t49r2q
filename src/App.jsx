import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Meals from './components/Meals'
import Events from './components/Events'
import News from './components/News'
import Stats from './components/Stats'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  useEffect(()=>{
    if(!token){ setUser(null); return }
    // decode role and name from JWT (header.payload.signature) without verifying for UI only
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUser({ role: payload.role, name: payload.name, email: payload.email })
    } catch {
      setUser(null)
    }
  }, [token])

  const logout = () => { localStorage.removeItem('token'); setToken(null) }
  const onLogin = (t) => { localStorage.setItem('token', t); setToken(t) }

  return (
    <div className="min-h-screen bg-[#072B1A] text-white">
      <Navbar user={user} onLogout={logout} />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {!user && (
          <div className="flex justify-center">
            <Login onLogin={onLogin} />
          </div>
        )}

        <Meals token={token} role={user?.role} />
        <Events token={token} role={user?.role} />
        <News role={user?.role} />
        <Stats />

        <footer className="text-center text-white/60 text-sm pt-8">
          Campusportalen – bygget til gymnasier. Grøn profil, store knapper, mobilvenlig.
        </footer>
      </main>
    </div>
  )
}

export default App
