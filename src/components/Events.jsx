import { useEffect, useState } from 'react'

export default function Events({ token, role }){
  const [events, setEvents] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async ()=>{
    const r = await fetch(`${baseUrl}/events`).then(r=>r.json())
    setEvents(r.events||[])
  }
  useEffect(()=>{ load() },[])

  return (
    <section id="events" className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="text-xl font-semibold mb-2">Kommende events</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {events.map(ev => (
            <EventCard key={ev._id} ev={ev} token={token} />
          ))}
        </div>
      </div>

      {role === 'admin' && <AdminEventCreate onCreated={load} />}
    </section>
  )
}

function EventCard({ ev, token }){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const signup = async ()=>{
    const res = await fetch(`${baseUrl}/events/signup`, { method:'POST', headers:{'Content-Type':'application/json', Authorization: `Bearer ${token}`}, body: JSON.stringify({ event_id: ev._id }) })
    if(res.ok){ alert('Tilmeldt!') } else { alert('Login kræves') }
  }
  return (
    <div className="p-4 border border-white/10 rounded">
      <h4 className="font-semibold">{ev.title}</h4>
      <p className="text-white/70 text-sm">{ev.description}</p>
      <p className="text-white/60 text-sm mt-1">{new Date(ev.date).toLocaleString()}</p>
      <button onClick={signup} disabled={!token} className="mt-2 bg-[#17C178] text-[#072B1A] px-3 py-1 rounded font-semibold disabled:opacity-50">Tilmeld</button>
    </div>
  )
}

function AdminEventCreate({ onCreated }){
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [date, setDate] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const token = localStorage.getItem('token')

  const submit = async (e)=>{
    e.preventDefault()
    const res = await fetch(`${baseUrl}/admin/events`, {
      method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`},
      body: JSON.stringify({ title, description: desc, date: new Date(date).toISOString() })
    })
    if(res.ok){ setTitle(''); setDesc(''); setDate(''); onCreated?.() }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <h4 className="font-semibold mb-2">Admin: Opret event</h4>
      <form onSubmit={submit} className="grid sm:grid-cols-3 gap-2">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Titel" className="p-2 rounded text-[#072B1A]" required />
        <input value={date} onChange={e=>setDate(e.target.value)} type="datetime-local" className="p-2 rounded text-[#072B1A]" required />
        <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Beskrivelse" className="p-2 rounded text-[#072B1A] col-span-full" />
        <div className="col-span-full">
          <button className="bg-[#17C178] text-[#072B1A] px-4 py-2 rounded font-semibold">Gem</button>
        </div>
      </form>
    </div>
  )
}
