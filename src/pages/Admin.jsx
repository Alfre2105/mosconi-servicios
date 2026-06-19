import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StarDisplay } from '../components/StarRating'
import { Spinner } from '../components/Spinner'
import { AdminIllustration } from '../components/Illustrations'

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Credenciales incorrectas.')
    else onLogin()
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="page-header pb-6">
        <img src="/logo.png" alt="Logo" className="w-20 h-20 rounded-full mx-auto mb-2 border-2 border-white shadow-lg bg-white object-contain" />
        <h1 className="page-title">Panel de Administración</h1>
        <p className="page-subtitle">Gestión de solicitudes, trabajadores y calificaciones</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <form onSubmit={handleSubmit} className="card w-full max-w-sm flex flex-col gap-4">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="btn-primary" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
        </form>
      </div>
      <footer className="page-footer">
        <strong>Mosconi Servicios</strong> · Asociación Vecinal Mosconi KM3 Comodoro Rivadavia
      </footer>
    </div>
  )
}

const TABS = [
  { label: 'Pendientes', icon: 'pending' },
  { label: 'Trabajadores', icon: 'people' },
  { label: 'Calificaciones', icon: 'star' },
  { label: 'Solicitudes', icon: 'assignment' },
  { label: 'Estadísticas', icon: 'bar_chart' },
]

export default function Admin() {
  const [session, setSession] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setCheckingAuth(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (checkingAuth) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>
  if (!session) return <AdminLogin onLogin={() => supabase.auth.getSession().then(({ data }) => setSession(data.session))} />

  return (
    <div className="min-h-screen flex flex-col">
      <div className="page-header pb-4">
        <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-white shadow bg-white object-contain" />
        <h1 className="page-title">Panel de Administración</h1>
        <p className="page-subtitle">Gestión de solicitudes, trabajadores y calificaciones del sistema comunitario.</p>
        <button onClick={() => supabase.auth.signOut()} className="absolute right-3 top-4 text-white/80 text-xs flex items-center gap-1">
          <span className="material-icons text-base">logout</span>Salir
        </button>
      </div>

      <div className="px-4 pt-3 max-w-2xl mx-auto w-full">
        <AdminIllustration />
      </div>

      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex min-w-max">
          {TABS.map((t, i) => (
            <button key={t.label} onClick={() => setTab(i)}
              className={`flex items-center gap-1 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${tab === i ? 'border-[#1565C0] text-[#1565C0]' : 'border-transparent text-gray-500'}`}>
              <span className="material-icons text-base">{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 px-4 py-5 max-w-2xl mx-auto w-full">
        {tab === 0 && <PendingWorkers />}
        {tab === 1 && <ActiveWorkers />}
        {tab === 2 && <PendingRatings />}
        {tab === 3 && <ServiceRequests />}
        {tab === 4 && <Stats />}
      </main>

      <footer className="page-footer">
        <strong>Mosconi Servicios</strong> · Asociación Vecinal Mosconi KM3 Comodoro Rivadavia
      </footer>
    </div>
  )
}

function PendingWorkers() {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase.from('workers').select('*, worker_services(service_categories(name))').eq('is_verified', false).order('created_at', { ascending: false })
    setWorkers(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  if (loading) return <Spinner />
  if (!workers.length) return <EmptyState icon="check_circle" text="No hay registros pendientes" />

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-bold text-[#1565C0]">Validar trabajadores ({workers.length})</h2>
      {workers.map(w => (
        <div key={w.id} className="card flex flex-col gap-3">
          <div>
            <p className="font-bold text-gray-900">{w.full_name}</p>
            <p className="text-sm text-gray-500">{w.phone}{w.address ? ` · ${w.address}` : ''}</p>
            {w.worker_services?.length > 0 && (
              <p className="text-sm text-[#1565C0] font-medium mt-1">
                {w.worker_services.map(s => s.service_categories?.name).filter(Boolean).join(', ')}
              </p>
            )}
            {w.description && <p className="text-sm text-gray-600 mt-1 italic">"{w.description}"</p>}
            <p className="text-xs text-gray-400 mt-1">{new Date(w.created_at).toLocaleString('es-AR')}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={async () => { await supabase.from('workers').update({ is_verified: true }).eq('id', w.id); load() }}
              className="btn-accent flex-1 py-2 text-sm min-h-[44px]">
              <span className="material-icons text-base">check</span>Aprobar
            </button>
            <button onClick={async () => { if (!confirm('¿Eliminar?')) return; await supabase.from('workers').delete().eq('id', w.id); load() }}
              className="flex-1 py-2 text-sm border-2 border-red-400 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-1 min-h-[44px]">
              <span className="material-icons text-base">close</span>Rechazar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function ActiveWorkers() {
  const [workers, setWorkers] = useState([])
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const [{ data: ws }, { data: bs }] = await Promise.all([
      supabase.from('workers').select('*, worker_badges(badge_id, badges(name))').eq('is_verified', true).order('full_name'),
      supabase.from('badges').select('*'),
    ])
    setWorkers(ws ?? [])
    setBadges(bs ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  if (loading) return <Spinner />
  if (!workers.length) return <EmptyState icon="person" text="No hay trabajadores activos" />

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-bold text-[#1565C0]">Lista de trabajadores ({workers.length})</h2>
      {workers.map(w => (
        <div key={w.id} className="card flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-gray-900">{w.full_name}</p>
              <p className="text-sm text-gray-500">{w.phone}</p>
              {w.worker_badges?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {w.worker_badges.map(b => b.badges && (
                    <span key={b.badge_id} className="badge-chip"><span className="material-icons text-xs">verified</span>{b.badges.name}</span>
                  ))}
                </div>
              )}
            </div>
            <button onClick={async () => { if (!confirm('¿Suspender?')) return; await supabase.from('workers').update({ is_verified: false }).eq('id', w.id); load() }}
              className="text-xs text-red-500 flex items-center gap-1 border border-red-300 rounded-xl px-2 py-1">
              <span className="material-icons text-sm">pause_circle</span>Suspender
            </button>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-semibold">Asignar insignia:</p>
            <div className="flex flex-wrap gap-2">
              {badges.map(b => {
                const has = w.worker_badges?.some(wb => wb.badge_id === b.id)
                return (
                  <button key={b.id}
                    onClick={async () => { if (!has) { await supabase.from('worker_badges').upsert({ worker_id: w.id, badge_id: b.id, assigned_at: new Date().toISOString() }); load() } }}
                    className={`text-xs px-3 py-1.5 rounded-full border-2 transition-colors font-semibold ${has ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : 'bg-white border-gray-300 text-gray-600'}`}>
                    {has ? '✓ ' : ''}{b.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function PendingRatings() {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase.from('ratings').select('*, workers(full_name), neighbors(full_name)').eq('is_visible', false).order('created_at', { ascending: false })
    setRatings(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  if (loading) return <Spinner />
  if (!ratings.length) return <EmptyState icon="verified" text="No hay calificaciones para revisar" />

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-bold text-[#1565C0]">Puntajes a revisar ({ratings.length})</h2>
      {ratings.map(r => (
        <div key={r.id} className="card flex flex-col gap-3">
          <div>
            <div className="flex items-center gap-2">
              <StarDisplay value={r.stars} size="text-base" />
              <span className="text-sm font-bold text-red-600">{r.stars} estrella{r.stars !== 1 ? 's' : ''}</span>
            </div>
            <p className="text-sm mt-1">Para: <strong>{r.workers?.full_name}</strong></p>
            <p className="text-sm text-gray-500">Por: {r.neighbors?.full_name ?? 'Vecino/a'}</p>
            {r.comment && <p className="text-sm text-gray-600 italic mt-1">"{r.comment}"</p>}
            <p className="text-xs text-gray-400 mt-1">{new Date(r.created_at).toLocaleString('es-AR')}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={async () => { await supabase.from('ratings').update({ is_visible: true }).eq('id', r.id); load() }}
              className="btn-accent flex-1 py-2 text-sm min-h-[44px]">
              <span className="material-icons text-base">visibility</span>Publicar
            </button>
            <button onClick={async () => { await supabase.from('ratings').delete().eq('id', r.id); load() }}
              className="flex-1 py-2 text-sm border-2 border-red-400 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-1 min-h-[44px]">
              <span className="material-icons text-base">delete</span>Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function ServiceRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todas')
  const [whatsappLink, setWhatsappLink] = useState(null)
  const STATUSES = ['pendiente', 'aceptado', 'completado', 'cancelado']
  const statusColors = { pendiente: 'bg-yellow-100 text-yellow-800', aceptado: 'bg-blue-100 text-blue-800', completado: 'bg-green-100 text-green-800', cancelado: 'bg-gray-100 text-gray-600' }

  async function load() {
    let q = supabase.from('service_requests').select('*, workers(full_name), neighbors(full_name, phone), service_categories(name)').order('created_at', { ascending: false })
    if (filter !== 'todas') q = q.eq('status', filter)
    const { data } = await q
    setRequests(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [filter])

  if (loading) return <Spinner />

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-bold text-[#1565C0]">Solicitudes recibidas</h2>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['todas', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-sm px-3 py-1.5 rounded-full border-2 whitespace-nowrap font-semibold ${filter === s ? 'bg-[#1565C0] text-white border-[#1565C0]' : 'bg-white text-gray-600 border-gray-300'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      {!requests.length
        ? <EmptyState icon="assignment" text="No hay solicitudes" />
        : requests.map(r => (
          <div key={r.id} className="card flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-sm">{r.neighbors?.full_name ?? '—'}</p>
                <p className="text-xs text-gray-500">{r.neighbors?.phone}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[r.status]}`}>{r.status}</span>
            </div>
            <p className="text-sm">→ <strong>{r.workers?.full_name}</strong> · {r.service_categories?.name ?? '—'}</p>
            {r.preferred_date && <p className="text-xs text-gray-500">{r.preferred_date}{r.preferred_time ? ` a las ${r.preferred_time}` : ''}</p>}
            {r.comment && <p className="text-xs text-gray-500 italic">"{r.comment}"</p>}
            <div className="flex gap-2 flex-wrap mt-1">
              {STATUSES.filter(s => s !== r.status).map(s => (
                <button key={s} onClick={async () => {
                  await supabase.from('service_requests').update({ status: s }).eq('id', r.id)
                  if (s === 'aceptado' && r.neighbors?.phone) {
                    const num = r.neighbors.phone.replace(/\D/g, '')
                    const number = num.startsWith('549') ? num : `549${num}`
                    const msg = encodeURIComponent(
                      `Hola ${r.neighbors.full_name}, te avisamos que ${r.workers?.full_name} aceptó tu solicitud de ${r.service_categories?.name ?? 'servicio'}. ¡Pronto se va a contactar con vos! — Mosconi Servicios`
                    )
                    setWhatsappLink(`https://wa.me/${number}?text=${msg}`)
                  } else {
                    setWhatsappLink(null)
                  }
                  load()
                }}
                  className="text-xs px-3 py-1 border-2 border-[#1565C0] text-[#1565C0] rounded-full font-semibold bg-white">
                  Marcar {s}
                </button>
              ))}
            </div>
            {whatsappLink && r.status === 'aceptado' && (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-4 py-2 rounded-xl mt-1"
                onClick={() => setWhatsappLink(null)}>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Notificar al vecino por WhatsApp
              </a>
            )}
          </div>
        ))
      }
    </div>
  )
}

function Stats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const now = new Date()
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const [{ count: totalWorkers }, { count: requestsMonth }, { data: ratingsData }, { data: topWorkers }] = await Promise.all([
        supabase.from('workers').select('*', { count: 'exact', head: true }).eq('is_verified', true),
        supabase.from('service_requests').select('*', { count: 'exact', head: true }).gte('created_at', firstOfMonth),
        supabase.from('ratings').select('stars').eq('is_visible', true),
        supabase.from('workers').select('full_name, ratings(stars, is_visible)').eq('is_verified', true),
      ])
      const avgGlobal = ratingsData?.length ? (ratingsData.reduce((s, r) => s + r.stars, 0) / ratingsData.length).toFixed(1) : null
      const top5 = (topWorkers ?? []).map(w => {
        const vis = w.ratings?.filter(r => r.is_visible) ?? []
        const avg = vis.length ? vis.reduce((s, r) => s + r.stars, 0) / vis.length : 0
        return { name: w.full_name, avg, count: vis.length }
      }).filter(w => w.count > 0).sort((a, b) => b.avg - a.avg).slice(0, 5)
      setStats({ totalWorkers, requestsMonth, avgGlobal, top5 })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-[#1565C0]">Reportes y estadísticas</h2>
      <p className="text-sm text-gray-500">Visualizá el desempeño de los servicios y la participación vecinal.</p>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon="assignment" label="Solicitudes atendidas" value={stats.requestsMonth ?? 0} color="text-[#1565C0]" bg="bg-blue-50" />
        <StatCard icon="star" label="Promedio de calificaciones" value={stats.avgGlobal ? `${stats.avgGlobal} ★` : '—'} color="text-yellow-600" bg="bg-yellow-50" />
        <StatCard icon="people" label="Trabajadores activos" value={stats.totalWorkers ?? 0} color="text-[#43A047]" bg="bg-green-50" />
      </div>

      {stats.top5?.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-[#1565C0] mb-3">Top trabajadores mejor calificados</h3>
          <div className="flex flex-col gap-2">
            {stats.top5.map((w, i) => (
              <div key={w.name} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#1565C0] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                <span className="flex-1 text-sm font-medium">{w.name}</span>
                <span className="text-sm text-yellow-600 font-bold">{w.avg.toFixed(1)} ★</span>
                <span className="text-xs text-gray-400">({w.count})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, color, bg }) {
  return (
    <div className={`card text-center ${bg}`}>
      <span className={`material-icons text-3xl ${color}`}>{icon}</span>
      <p className={`text-2xl font-extrabold mt-1 ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1 leading-tight">{label}</p>
    </div>
  )
}

function EmptyState({ icon, text }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <span className="material-icons text-5xl text-gray-300 block mb-2">{icon}</span>
      <p>{text}</p>
    </div>
  )
}
