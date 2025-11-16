import { useEffect, useState } from 'react'

export default function Meals({ token, role }) {
  const [today, setToday] = useState(null)
  const [surplus, setSurplus] = useState([])
  const [qty, setQty] = useState(1)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const fetchData = async () => {
    const a = await fetch(`${baseUrl}/meals/today`).then(r=>r.json())
    setToday(a.meal)
    const b = await fetch(`${baseUrl}/meals/surplus`).then(r=>r.json())
    setSurplus(b.meals||[])
  }
  useEffect(()=>{ fetchData() },[])

  const order = async () => {
    if(!today) return
    const res = await fetch(`${baseUrl}/orders`, {
      method:'POST',
      headers:{'Content-Type':'application/json', Authorization: `Bearer ${token}`},
      body: JSON.stringify({ meal_id: today._id, quantity: qty })
    })
    if(res.ok){ alert('Ordre oprettet! (demo)') } else { alert('Kunne ikke oprette ordre') }
  }

  return (
    <section id="meals" className="space-y-4">
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5">
        <h3 className="text-xl font-semibold mb-2">Dagens Ret</h3>
        {today ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-medium">{today.name}</p>
              <p className="text-white/70 text-sm">{today.description}</p>
              <p className="mt-1 text-[#17C178] font-semibold">{today.price} kr</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" min={1} value={qty} onChange={(e)=>setQty(parseInt(e.target.value)||1)} className="w-16 p-2 rounded text-[#072B1A]" />
              <button onClick={order} disabled={!token} className="bg-[#17C178] text-[#072B1A] px-4 py-2 rounded font-semibold disabled:opacity-50">Forudbestil</button>
            </div>
          </div>
        ) : (
          <p className="text-white/70">Ingen dagens ret oprettet endnu.</p>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5">
        <h3 className="text-xl font-semibold mb-2">Overskudsmad – tilbud</h3>
        {surplus.length ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {surplus.map(m => (
              <div key={m._id} className="p-3 border border-white/10 rounded">
                <p className="font-medium">{m.name}</p>
                <p className="text-white/70 text-sm">{m.description}</p>
                <p className="mt-1 text-[#17C178] font-semibold">{m.price} kr</p>
              </div>
            ))}
          </div>
        ) : <p className="text-white/70">Ingen tilbud lige nu.</p>}
      </div>

      {role === 'admin' && (
        <AdminMealCreate onCreated={fetchData} />
      )}
    </section>
  )
}

function AdminMealCreate({ onCreated }){
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [desc, setDesc] = useState('')
  const [today, setToday] = useState(true)
  const [surplus, setSurplus] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const token = localStorage.getItem('token')

  const submit = async (e)=>{
    e.preventDefault()
    const day = new Date().toISOString().slice(0,10)
    const res = await fetch(`${baseUrl}/admin/meals`, {
      method:'POST', headers:{'Content-Type':'application/json', Authorization: `Bearer ${token}`},
      body: JSON.stringify({ name, price: parseFloat(price), description: desc, day, is_today_special: today, is_surplus_offer: surplus })
    })
    if(res.ok){ onCreated?.(); setName(''); setPrice(''); setDesc(''); setSurplus(false) }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <h4 className="font-semibold mb-2">Admin: Opret dagens ret</h4>
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Navn" className="p-2 rounded text-[#072B1A]" required />
        <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Pris" type="number" step="0.5" className="p-2 rounded text-[#072B1A]" required />
        <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Beskrivelse" className="p-2 rounded text-[#072B1A] col-span-full" />
        <label className="flex items-center gap-2"><input type="checkbox" checked={today} onChange={e=>setToday(e.target.checked)} /> Dagens ret</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={surplus} onChange={e=>setSurplus(e.target.checked)} /> Overskudstilbud</label>
        <div className="col-span-full">
          <button className="bg-[#17C178] text-[#072B1A] px-4 py-2 rounded font-semibold">Gem</button>
        </div>
      </form>
    </div>
  )
}
