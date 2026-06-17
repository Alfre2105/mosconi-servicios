import { useParams, useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { StarDisplay } from '../components/StarRating'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { Spinner } from '../components/Spinner'
import { useWorker } from '../hooks/useWorkers'
import { whatsappWorkerLink } from '../lib/whatsapp'

const AVAIL_LABELS = { morning: 'Mañana', afternoon: 'Tarde', night: 'Noche', weekend: 'Fines de semana' }

export default function WorkerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { worker, loading, error } = useWorker(id)

  if (loading) return <div className="min-h-screen flex flex-col"><PageHeader title="Perfil del Trabajador" /><Spinner /></div>
  if (error || !worker) return (
    <div className="min-h-screen flex flex-col">
      <PageHeader title="Perfil del Trabajador" />
      <div className="flex-1 flex items-center justify-center text-gray-500 px-4 text-center">
        <div>
          <span className="material-icons text-5xl text-gray-300 block mb-2">error_outline</span>
          <p>No encontramos este trabajador.</p>
        </div>
      </div>
    </div>
  )

  const services = worker.worker_services?.map(s => s.service_categories?.name).filter(Boolean)
  const badges = worker.worker_badges?.map(b => b.badges) ?? []
  const avail = worker.availability?.[0]
  const availList = avail ? Object.entries(AVAIL_LABELS).filter(([k]) => avail[k]).map(([, v]) => v) : []

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader
        title="Perfil del Trabajador"
        subtitle="Conocé los detalles del trabajador disponible en el barrio."
      />

      <main className="flex-1 px-4 py-5 max-w-lg mx-auto w-full flex flex-col gap-4">

        {/* Card principal */}
        <div className="card flex gap-4 items-center">
          {worker.photo_url
            ? <img src={worker.photo_url} alt={worker.full_name} className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 flex-shrink-0" />
            : <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200 flex-shrink-0">
                <span className="material-icons text-[#1565C0] text-4xl">person</span>
              </div>
          }
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-extrabold text-gray-900">{worker.full_name}</h1>
            {services?.length > 0 && (
              <p className="text-sm text-[#1565C0] font-semibold">{services[0]}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <StarDisplay value={worker.avg_rating} />
              {worker.rating_count > 0 && (
                <span className="text-xs text-gray-500">({worker.rating_count} opinión{worker.rating_count > 1 ? 'es' : ''})</span>
              )}
            </div>
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {badges.map(b => b && <span key={b.name} className="badge-chip"><span className="material-icons text-xs">verified</span>{b.name}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* Teléfono + WhatsApp */}
        <div className="card flex items-center gap-3">
          <span className="material-icons text-[#1565C0] text-2xl">phone</span>
          <div className="flex-1">
            <p className="text-sm text-gray-500">Teléfono</p>
            <p className="font-bold text-gray-800">+54 9 {worker.phone}</p>
          </div>
          <a
            href={whatsappWorkerLink(worker.phone, worker.full_name)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-contact-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Contactar
          </a>
        </div>

        {/* Disponibilidad */}
        {availList.length > 0 && (
          <div className="card">
            <p className="font-bold text-gray-700 mb-2">
              <span className="font-bold">Disponibilidad:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {availList.map(a => (
                <span key={a} className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-[#1565C0] text-sm px-3 py-1 rounded-full font-medium">
                  <span className="material-icons text-sm">check</span>{a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experiencia */}
        {worker.description && (
          <div className="card">
            <p className="font-bold text-gray-700 mb-1">Experiencia:</p>
            <p className="text-gray-600 text-sm leading-relaxed">{worker.description}</p>
          </div>
        )}

        {/* Servicios */}
        {services?.length > 1 && (
          <div className="card">
            <p className="font-bold text-gray-700 mb-2">Servicios:</p>
            <div className="flex flex-wrap gap-2">
              {services.map(s => (
                <span key={s} className="bg-blue-50 border border-blue-200 text-[#1565C0] text-sm px-3 py-1 rounded-full font-medium">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Calificaciones */}
        {worker.visible_ratings?.length > 0 && (
          <div className="card">
            <p className="font-bold text-gray-700 mb-3">Calificaciones:</p>
            <div className="flex flex-col gap-4">
              {worker.visible_ratings.map((r, i) => (
                <div key={i} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-sm font-semibold text-gray-700">
                      {r.neighbors?.full_name ?? 'Vecino/a'} lo calificó:
                    </span>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600 italic mb-1">"{r.comment}"</p>}
                  <StarDisplay value={r.stars} size="text-base" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-col gap-3 pb-6">
          <button className="btn-primary" onClick={() => navigate(`/solicitar/${worker.id}`)}>
            <span className="material-icons">send</span>
            Solicitar servicio
          </button>
          {worker.accepts_rating && (
            <button className="btn-outline" onClick={() => navigate(`/calificar/${worker.id}`)}>
              <span className="material-icons">star_rate</span>
              Calificar a {worker.full_name.split(' ')[0]}
            </button>
          )}
        </div>
      </main>

      <footer className="page-footer">
        <strong>Mosconi Servicios</strong> · Asociación Vecinal Mosconi KM3 Comodoro Rivadavia
      </footer>
    </div>
  )
}
