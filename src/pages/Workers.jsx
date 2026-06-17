import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { StarDisplay } from '../components/StarRating'
import { FilterBar } from '../components/FilterBar'
import { Spinner } from '../components/Spinner'
import { useWorkers } from '../hooks/useWorkers'
import { whatsappWorkerLink } from '../lib/whatsapp'
import { WorkersIllustration } from '../components/Illustrations'

export default function Workers() {
  const navigate = useNavigate()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({})
  const { workers, loading } = useWorkers(filters)
  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader
        title="Lista de Trabajadores"
        subtitle="Encontrá vecinos disponibles para ayudarte en tu hogar."
      />

      <div className="px-4 pt-3 max-w-lg mx-auto w-full">
        <WorkersIllustration />
      </div>

      <main className="flex-1 px-4 py-4 max-w-lg mx-auto w-full flex flex-col gap-3">

        {/* Filtros */}
        <button
          onClick={() => setShowFilters(v => !v)}
          className={`flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-xl border-2 transition-colors self-start ${hasFilters ? 'border-[#1565C0] text-[#1565C0] bg-blue-50' : 'border-gray-300 text-gray-600 bg-white'}`}
        >
          <span className="material-icons text-base">tune</span>
          {showFilters ? 'Ocultar filtros' : 'Filtrar'}
          {hasFilters && <span className="w-2 h-2 bg-[#1565C0] rounded-full" />}
        </button>

        {showFilters && (
          <div className="card">
            <FilterBar filters={filters} onChange={setFilters} />
            {hasFilters && (
              <button onClick={() => setFilters({})} className="mt-3 text-sm text-[#1565C0] underline">
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {loading ? (
          <Spinner />
        ) : workers.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <span className="material-icons text-5xl text-gray-300 block mb-3">search_off</span>
            <p className="font-medium">No encontramos trabajadores</p>
            <p className="text-sm mt-1">Probá con otros filtros</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 font-medium">
              {workers.length} trabajador{workers.length !== 1 ? 'es' : ''} encontrado{workers.length !== 1 ? 's' : ''}
            </p>
            {workers.map(w => <WorkerRow key={w.id} worker={w} onView={() => navigate(`/trabajador/${w.id}`)} />)}
          </>
        )}
      </main>

      <footer className="page-footer">
        Tu perfil será validado por la Asociación Vecinal. · <strong>Mosconi Servicios</strong> · Asociación Vecinal Mosconi KM3 Comodoro Rivadavia
      </footer>
    </div>
  )
}

function WorkerRow({ worker, onView }) {
  const services = worker.worker_services?.map(s => s.service_categories?.name).filter(Boolean)
  const photo = worker.photo_url

  return (
    <div className="card flex items-center gap-3">
      {/* Foto */}
      <div className="flex-shrink-0 cursor-pointer" onClick={onView}>
        {photo
          ? <img src={photo} alt={worker.full_name} className="w-14 h-14 rounded-full object-cover border-2 border-blue-200" />
          : <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
              <span className="material-icons text-[#1565C0] text-3xl">person</span>
            </div>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onView}>
        <p className="font-bold text-gray-900 truncate">{worker.full_name}</p>
        <p className="text-sm text-gray-500 truncate">{services?.slice(0, 2).join(', ') || '—'}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <StarDisplay value={worker.avg_rating} size="text-sm" />
          {worker.avg_rating > 0 && (
            <span className="text-xs text-gray-400">({worker.rating_count})</span>
          )}
        </div>
      </div>

      {/* Botón contactar */}
      <a
        href={whatsappWorkerLink(worker.phone, worker.full_name)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-contact-sm flex-shrink-0"
        onClick={e => e.stopPropagation()}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Contactar
      </a>
    </div>
  )
}
