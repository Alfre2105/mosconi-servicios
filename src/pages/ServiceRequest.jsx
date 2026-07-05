import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { Spinner } from '../components/Spinner'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { useWorker } from '../hooks/useWorkers'
import { useCategories } from '../hooks/useCategories'
import { supabase } from '../lib/supabase'
import { ServiceIllustration } from '../components/Illustrations'

export default function ServiceRequest() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { worker, loading } = useWorker(id)
  const { categories } = useCategories()
  const [sent, setSent] = useState(false)
  const [whatsappLink, setWhatsappLink] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    neighbor_name: '',
    neighbor_phone: '',
    service_category_id: '',
    preferred_date: '',
    preferred_time: '',
    comment: '',
  })

  if (loading) return <div className="min-h-screen flex flex-col"><PageHeader title="Solicitud de servicio" /><Spinner /></div>

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!form.neighbor_name.trim() || !form.neighbor_phone.trim()) {
      setError('Nombre y teléfono son obligatorios.')
      return
    }
    setSubmitting(true)
    try {
      let neighbor_id = null
      const { data: existing } = await supabase.from('neighbors').select('id').eq('phone', form.neighbor_phone.trim()).maybeSingle()
      if (existing) {
        neighbor_id = existing.id
      } else {
        const { data: newN } = await supabase.from('neighbors').insert({ full_name: form.neighbor_name.trim(), phone: form.neighbor_phone.trim(), role: 'neighbor' }).select('id').single()
        neighbor_id = newN?.id
      }

      const requestId = ('10000000-1000-4000-8000-100000000000').replace(/[018]/g, c =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
      )
      await supabase.from('service_requests').insert({
        id: requestId,
        neighbor_id,
        worker_id: id,
        service_category_id: form.service_category_id || null,
        preferred_date: form.preferred_date || null,
        preferred_time: form.preferred_time || null,
        comment: form.comment || null,
        status: 'pendiente',
      })

      const serviceName = categories.find(c => c.id === form.service_category_id)?.name ?? 'servicio'
      const acceptLink = `https://mosconi-servicios-fwxc.vercel.app/aceptar/${requestId}`

      fetch('/api/notificar-solicitud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vecino: form.neighbor_name.trim(),
          telefono: form.neighbor_phone.trim(),
          trabajador: worker.full_name,
          servicio: serviceName,
          fecha: form.preferred_date,
          hora: form.preferred_time,
          comentario: form.comment,
        }),
      }).catch(() => {})
      const msg = encodeURIComponent(
        `Hola ${worker.full_name}, soy ${form.neighbor_name.trim()} (${form.neighbor_phone}) vecino/a de Mosconi.\n` +
        `Te solicito: ${serviceName}${form.preferred_date ? ` para el ${form.preferred_date}` : ''}${form.preferred_time ? ` a las ${form.preferred_time}` : ''}.\n` +
        (form.comment ? `Detalle: ${form.comment}\n` : '') +
        `\nPara aceptar la solicitud hacé clic acá: ${acceptLink}`
      )
      const cleaned = worker.phone.replace(/\D/g, '')
      const number = cleaned.startsWith('549') ? cleaned : `549${cleaned}`
      setWhatsappLink(`https://wa.me/${number}?text=${msg}`)
      setSent(true)
    } catch (err) {
      setError('Ocurrió un error. Intentá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="Solicitud de servicio" subtitle="Solicítá ayuda en el barrio General Mosconi." />
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5 text-center max-w-sm mx-auto w-full">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-md">
            <span className="material-icons text-green-500 text-6xl">check_circle</span>
          </div>
          <div className="card w-full">
            <p className="text-gray-700 leading-relaxed">
              Contactá a <strong>{worker?.full_name}</strong> directamente por WhatsApp con el mensaje ya preparado.
            </p>
          </div>
          <WhatsAppButton href={whatsappLink}>Abrir WhatsApp</WhatsAppButton>
          <button onClick={() => navigate('/')} className="btn-outline">Volver al inicio</button>
        </div>
        <footer className="page-footer">
          <strong>Mosconi Servicios</strong> · Asociación Vecinal Mosconi KM3 Comodoro Rivadavia
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader title="Solicitud de servicio" subtitle="Solicítá ayuda en el barrio General Mosconi." />

      <div className="px-4 pt-3 max-w-lg mx-auto w-full">
        <ServiceIllustration />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-4 max-w-lg mx-auto w-full">

        <div className="card flex flex-col gap-3">
          <div>
            <label className="label">Descripción del problema:</label>
            <textarea className="input min-h-[80px] resize-none" value={form.comment}
              onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              placeholder="Describí qué necesitás..." />
          </div>
          <div>
            <label className="label">Tarea necesaria:</label>
            <select className="input" value={form.service_category_id}
              onChange={e => setForm(f => ({ ...f, service_category_id: e.target.value }))}>
              <option value="">Seleccionar...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Seleccioná una fecha:</label>
              <input className="input" type="date" value={form.preferred_date}
                onChange={e => setForm(f => ({ ...f, preferred_date: e.target.value }))} />
            </div>
            <div>
              <label className="label">Seleccioná una hora:</label>
              <input className="input" type="time" value={form.preferred_time}
                onChange={e => setForm(f => ({ ...f, preferred_time: e.target.value }))} />
            </div>
          </div>
        </div>

        <div className="card flex flex-col gap-3">
          <h2 className="font-bold text-[#1565C0]">Tus datos</h2>
          <div>
            <label className="label">Tu nombre *</label>
            <input className="input" value={form.neighbor_name}
              onChange={e => setForm(f => ({ ...f, neighbor_name: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Tu teléfono *</label>
            <input className="input" type="tel" value={form.neighbor_phone}
              onChange={e => setForm(f => ({ ...f, neighbor_phone: e.target.value }))} required />
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Enviando...' : 'Enviar solicitud'}
        </button>
      </form>

      <footer className="page-footer">
        <strong>Mosconi Servicios</strong> · Asociación Vecinal Mosconi KM3 Comodoro Rivadavia
      </footer>
    </div>
  )
}
