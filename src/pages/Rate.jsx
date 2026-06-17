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
    const adminNum = import.meta.env.VITE_WHATSAPP_ADMIN || '5492974000000'
    const starLabelsShort = ['', '⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐']
    const notifyAdminMsg = encodeURIComponent(
      `Hola, soy ${name} y quiero informar que el trabajo de ${worker?.full_name} fue completado.\n` +
      `Calificación: ${starLabelsShort[stars]} (${stars}/5)${comment ? `\nComentario: ${comment}` : ''}`
    )
    const notifyAdminLink = `https://wa.me/${adminNum}?text=${notifyAdminMsg}`

    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="Calificación del servicio" subtitle="Tu opinión ayuda a mejorar la red comunitaria." />
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5 text-center max-w-sm mx-auto w-full">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-md">
            <span className="material-icons text-green-500 text-6xl">check_circle</span>
          </div>
          <p className="text-gray-700 font-medium">¡Gracias por calificar! Tu opinión ayuda a otros vecinos.</p>
          <div className="card w-full text-left">
            <p className="text-sm font-semibold text-gray-700 mb-2">¿Querés notificar a la Asociación Vecinal que el trabajo fue completado?</p>
            <a href={notifyAdminLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp text-sm">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Notificar a la Asociación Vecinal
            </a>
          </div>
          <button onClick={() => navigate(`/trabajador/${id}`)} className="btn-primary max-w-xs w-full">Ver perfil</button>
          <button onClick={() => navigate('/')} className="btn-outline max-w-xs w-full">Inicio</button>
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
