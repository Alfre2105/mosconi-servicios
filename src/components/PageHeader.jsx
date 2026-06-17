import { useNavigate } from 'react-router-dom'

export function PageHeader({ title, subtitle, showBack = true, showLogo = true }) {
  const navigate = useNavigate()
  return (
    <div className="page-header">
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="absolute left-3 top-4 text-white/80 flex items-center gap-1 text-sm"
        >
          <span className="material-icons text-xl">arrow_back_ios</span>
        </button>
      )}
      {showLogo && (
        <img
          src="/logo.png"
          alt="Asoc. Vecinal General Mosconi"
          className="w-20 h-20 rounded-full mx-auto mb-2 border-2 border-white shadow-lg bg-white object-contain"
        />
      )}
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </div>
  )
}
