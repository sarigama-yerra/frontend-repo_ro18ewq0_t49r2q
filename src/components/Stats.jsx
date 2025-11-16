import { useEffect, useState } from 'react'

export default function Stats(){
  const [data, setData] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(()=>{
    const load = async ()=>{
      const r = await fetch(`${baseUrl}/stats`).then(r=>r.json())
      setData(r)
    }
    load()
  },[])

  return (
    <section id="stats" className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="text-xl font-semibold mb-2">Statistik</h3>
        {data ? (
          <div className="grid grid-cols-3 gap-3 text-center">
            <StatCard label="Portioner solgt" value={data.portions_sold} />
            <StatCard label="Madspild sparet (kg)" value={data.waste_saved_kg} />
            <StatCard label="CO₂ sparet (kg)" value={data.co2_saved_kg} />
          </div>
        ) : <p className="text-white/70">Indlæser...</p>}
      </div>
    </section>
  )
}

function StatCard({ label, value }){
  return (
    <div className="bg-[#072B1A] border border-white/10 rounded p-4">
      <div className="text-2xl font-bold text-[#17C178]">{value}</div>
      <div className="text-white/80 text-sm">{label}</div>
    </div>
  )
}
