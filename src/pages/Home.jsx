import { useNavigate } from 'react-router-dom'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { whatsappAdminLink } from '../lib/whatsapp'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="page-header pb-8">
        <img
          src="/logo.png"
          alt="Asoc. Vecinal General Mosconi"
          className="w-28 h-28 rounded-full mx-auto mb-3 border-4 border-white shadow-xl bg-white object-contain"
        />
      </div>

      {/* Foto hero */}
      <div className="w-full max-w-md mx-auto px-4 pt-4">
        <img
          src="/hero.png"
          alt="Vecinos y trabajadores del barrio General Mosconi"
          className="w-full rounded-2xl object-cover shadow-md"
          style={{ maxHeight: '220px' }}
        />
      </div>

      {/* Contenido */}
      <main className="flex-1 px-5 py-4 flex flex-col gap-4 max-w-md mx-auto w-full">
        <div className="text-center mb-2">
          <p className="text-gray-700 text-base leading-relaxed font-medium">
            Conectamos vecinos con trabajadores <span className="text-[#1565C0] font-bold">confiables</span> del barrio General Mosconi.
          </p>
        </div>

        <button className="btn-primary text-lg" onClick={() => navigate('/trabajadores')}>
          <span className="material-icons">search</span>
          Buscar trabajadores
        </button>

        <button className="btn-outline text-lg" onClick={() => navigate('/registrar')}>
          <span className="material-icons">person_add</span>
          Registrarme como trabajador
        </button>

        <div className="mt-2">
          <WhatsAppButton href={whatsappAdminLink()}>
            Contactar por WhatsApp
          </WhatsAppButton>
        </div>

        <div className="flex justify-center mt-2">
          <button
            onClick={() => navigate('/admin')}
            className="text-xs text-gray-400 underline"
          >
            Panel de administración
          </button>
        </div>
      </main>

      <footer className="page-footer">
        <strong>Asociación Vecinal Mosconi</strong> · KM3 Comodoro Rivadavia
      </footer>
    </div>
  )
}
