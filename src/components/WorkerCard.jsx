import { useNavigate } from 'react-router-dom'
import { StarDisplay } from './StarRating'

export function WorkerCard({ worker }) {
  const navigate = useNavigate()
  const services = worker.worker_services?.map(s => s.service_categories?.name).filter(Boolean)
  const badges = worker.worker_badges?.map(b => b.badges?.name).filter(Boolean)
  const photo = worker.photo_url

  return (
    <div className="card flex gap-4 cursor-pointer active:bg-gray-50 transition-colors"
      onClick={() => navigate(`/trabajador/${worker.id}`)}>
      <div className="flex-shrink-0">
        {photo
          ? <img src={photo} alt={worker.full_name} className="w-16 h-16 rounded-full object-cover" />
          : <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-icons text-primary text-3xl">person</span>
            </div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{worker.full_name}</h3>
        {services?.length > 0 && (
          <p className="text-sm text-gray-500 truncate">{services.slice(0, 3).join(' · ')}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <StarDisplay value={worker.avg_rating} size="text-base" />
          <span className="text-sm text-gray-500">
            {worker.avg_rating ? worker.avg_rating.toFixed(1) : '—'}
            {worker.rating_count > 0 && ` (${worker.rating_count})`}
          </span>
        </div>
        {badges?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {badges.map(b => (
              <span key={b} className="badge-chip">
                <span className="material-icons text-xs">verified</span>{b}
              </span>
            ))}
          </div>
        )}
      </div>
      <span className="material-icons text-gray-400 self-center">chevron_right</span>
    </div>
  )
}
