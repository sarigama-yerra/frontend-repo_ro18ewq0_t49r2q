import { useState } from 'react'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.detail || 'Login fejlede')
      }
      const data = await res.json()
      onLogin(data.access_token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#072B1A] text-white p-6 rounded-xl shadow-lg max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-4">Log ind</h2>
      <form onSubmit={submit} className="space-y-3">
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="E-mail" required className="w-full p-3 rounded text-[#072B1A]" />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Kodeord" required className="w-full p-3 rounded text-[#072B1A]" />
        {error && <p className="text-red-300 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-[#17C178] text-[#072B1A] font-semibold py-3 rounded disabled:opacity-50">
          {loading ? 'Logger ind...' : 'Log ind'}
        </button>
      </form>
      <p className="text-xs mt-3 opacity-80">Demo: admin@campus.dk / admin123 eller elev@campus.dk / elev123 (kør seed)</p>
    </div>
  )
}
