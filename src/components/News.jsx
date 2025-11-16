import { useEffect, useState } from 'react'

export default function News({ role }){
  const [items, setItems] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async ()=>{
    const r = await fetch(`${baseUrl}/news`).then(r=>r.json())
    setItems(r.news||[])
  }
  useEffect(()=>{ load() },[])

  return (
    <section id="news" className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="text-xl font-semibold mb-2">Nyheder & opslag</h3>
        <div className="space-y-3">
          {items.map(n => (
            <div key={n._id} className="p-4 border border-white/10 rounded">
              <h4 className="font-semibold">{n.title}</h4>
              <p className="text-white/70 text-sm">{n.text}</p>
              {n.image_url && <img src={n.image_url} alt="" className="mt-2 rounded max-h-40 object-cover" />}
            </div>
          ))}
        </div>
      </div>

      {role === 'admin' && <AdminNewsCreate onCreated={load} />}
    </section>
  )
}

function AdminNewsCreate({ onCreated }){
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [image_url, setImageUrl] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const token = localStorage.getItem('token')

  const submit = async (e)=>{
    e.preventDefault()
    const res = await fetch(`${baseUrl}/admin/news`, {
      method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`},
      body: JSON.stringify({ title, text, image_url: image_url || null })
    })
    if(res.ok){ setTitle(''); setText(''); setImageUrl(''); onCreated?.() }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <h4 className="font-semibold mb-2">Admin: Opret opslag</h4>
      <form onSubmit={submit} className="grid sm:grid-cols-3 gap-2">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Titel" className="p-2 rounded text-[#072B1A]" required />
        <input value={image_url} onChange={e=>setImageUrl(e.target.value)} placeholder="Billede URL (valgfrit)" className="p-2 rounded text-[#072B1A]" />
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Tekst" className="p-2 rounded text-[#072B1A] col-span-full" rows={3} />
        <div className="col-span-full">
          <button className="bg-[#17C178] text-[#072B1A] px-4 py-2 rounded font-semibold">Publicer</button>
        </div>
      </form>
    </div>
  )
}
