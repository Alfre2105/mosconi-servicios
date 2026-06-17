import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { StarPicker } from '../components/StarRating'
import { Spinner } from '../components/Spinner'
import { useWorker } from '../hooks/useWorkers'
import { supabase } from '../lib/supabase'
import { RatingIllustration } from '../components/Illustrations'

export default function Rate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { worker, loading } = useWorker(id)
  const [stars, setStars] = useState(0)
  const [comment, setComment] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (loading) return <div className="min-h-screen flex flex-col"><PageHeader title="Calificación del servicio" /><Spinner /></div>

  const starLabels = ['', 'Muy deficiente', 'Deficiente', 'Regular', 'Bueno', 'Excelente']

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stars) { setError('Seleccioná una calificación.'); return }
    if (!name.trim() || !phone.trim()) { setError('Tu nombre y teléfono son necesarios.'); return }
    setError(null)
    setSubmitting(true)
    try {
      let neighbor_id = null
      const { data: existing } = await supabase.from('neighbors').select('id').eq('phone', phone.trim()).maybeSingle()
      if (existing) {
        neighbor_id = existing.id
      } else {
        const { data: newN } = await supabase.from('neighbors').insert({ full_name: name.trim(), phone: phone.trim(), role: 'neighbor' }).select('id').single()
        neighbor_id = newN?.id
      }
      await supabase.from('ratings').insert({
        worker_id: id, neighbor_id, stars, comment: comment.trim() || null, is_visible: stars > 2,
      })
      setSent(true)
    } catch (err) {
      setError('Error al enviar. Intentá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="Calificación del servicio" subtitle="Tu opinión ayuda a mejorar la red comunitaria." />
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-md">
            <span className="material-icons text-green-500 text-6xl">check_circle</span>
          </div>
          <p className="text-gray-700 font-medium">¡Gracias por calificar! Tu opinión ayuda a otros vecinos.</p>
          <button onClick={() => navigate(`/trabajador/${id}`)} className="btn-primary max-w-xs">Ver perfil</button>
          <button onClick={() => navigate('/')} className="btn-outline max-w-xs">Inicio</button>
        </div>
        <footer className="page-footer">
          <strong>Mosconi Servicios</strong> · Asociación Vecinal Mosconi KM3 Comodoro Rivadavia
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader
        title="Calificación del servicio"
        subtitle="Tu opinión ayuda a mejorar la red comunitaria del barrio General Mosconi."
      />

      <div className="px-4 pt-3 max-w-lg mx-auto w-full">
        <RatingIllustration />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-4 max-w-lg mx-auto w-full">

        <div className="card flex flex-col gap-3">
          <div>
            <label className="label">Nombre del trabajador:</label>
            <div className="input bg-gray-50 text-gray-600">{worker?.full_name ?? '...'}</div>
          </div>

          <div>
            <label className="label">Puntaje:</label>
            <div className="flex flex-col gap-1">
              <StarPicker value={stars} onChange={setStars} />
              {stars > 0 && (
                <p className={`text-sm font-semibold ${stars <= 2 ? 'text-red-500' : 'text-[#43A047]'}`}>
                  {starLabels[stars]}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="label">Comentarios:</label>
            <textarea className="input min-h-[90px] resize-none" value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Contá tu experiencia..." />
          </div>
        </div>

        <div className="card flex flex-col gap-3">
          <h2 className="font-bold text-[#1565C0]">Tus datos</h2>
          <div>
            <label className="label">Tu nombre *</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="label">Tu teléfono *</label>
            <input className="input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
        </div>

        {stars > 0 && stars <= 2 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm flex gap-2">
            <span className="material-icons text-amber-500 text-base flex-shrink-0">info</span>
            Las calificaciones bajas son revisadas por la Asociación Vecinal antes de publicarse.
          </div>
        )}

        {error && <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

        <button type="submit" className="btn-primary" disabled={submitting || !stars}>
          {submitting ? 'Enviando...' : 'Enviar calificación'}
        </button>
      </form>

      <footer className="page-footer">
        <strong>Mosconi Servicios</strong> · Asociación Vecinal Mosconi KM3 Comodoro Rivadavia
      </footer>
    </div>
  )
}
