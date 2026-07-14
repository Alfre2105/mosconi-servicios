import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { useCategories } from '../hooks/useCategories'
import { supabase } from '../lib/supabase'

const AVAILABILITY_OPTS = [
  { key: 'morning', label: 'Mañana' },
  { key: 'afternoon', label: 'Tarde' },
  { key: 'night', label: 'Noche' },
  { key: 'weekend', label: 'Fines de semana' },
]

export default function Register() {
  const { categories } = useCategories()
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    description: '',
    references: '',
    accepts_rating: true,
    services: [],
    availability: { morning: false, afternoon: false, night: false, weekend: false },
  })

  function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function toggleService(id) {
    setForm(f => ({
      ...f,
      services: f.services.includes(id) ? f.services.filter(s => s !== id) : [...f.services, id],
    }))
  }

  function toggleAvail(key) {
    setForm(f => ({ ...f, availability: { ...f.availability, [key]: !f.availability[key] } }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!form.full_name.trim() || !form.phone.trim()) {
      setError('Nombre y teléfono son obligatorios.')
      return
    }
    setLoading(true)
    try {
      const workerId = crypto.randomUUID()

      // Subir foto si se eligió una
      let photo_url = null
      if (photo) {
        const ext = photo.name.split('.').pop()
        const path = `${workerId}.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('worker-photos')
          .upload(path, photo, { upsert: true })
        if (uploadErr) throw uploadErr
        const { data: urlData } = supabase.storage.from('worker-photos').getPublicUrl(path)
        photo_url = urlData.publicUrl
      }

      const { error: wErr } = await supabase.from('workers').insert({
        id: workerId,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim() || null,
        description: form.description.trim() || null,
        photo_url,
        accepts_rating: form.accepts_rating,
        is_verified: false,
      })
      if (wErr) throw wErr

      if (form.services.length) {
        await supabase.from('worker_services').insert(
          form.services.map(id => ({ worker_id: workerId, service_category_id: id }))
        )
      }
      await supabase.from('availability').insert({ worker_id: workerId, ...form.availability })
      setSent(true)
    } catch (err) {
      setError(`Error: ${err?.message || JSON.stringify(err)}`)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="¡Registro enviado!" subtitle="Sumate a la red comunitaria" />
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-md">
            <span className="material-icons text-green-500 text-6xl">check_circle</span>
          </div>
          <div className="card w-full max-w-sm">
            <p className="text-gray-700 leading-relaxed">
              Tu perfil será validado por la <strong>Asociación Vecinal</strong> antes de aparecer en el listado.
            </p>
          </div>
          <a href="/" className="btn-primary max-w-xs">Volver al inicio</a>
        </div>
        <footer className="page-footer">
          <strong>Mosconi Servicios</strong> · Asociación Vecinal Mosconi KM3 Comodoro Rivadavia
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader title="Registro de Trabajadores" subtitle="Sumate a la red comunitaria del barrio General Mosconi." />

      <div className="w-full max-w-lg mx-auto px-4 pt-3">
        <img src="/registrar.jpg" alt="Vecinos registrándose en Mosconi Servicios"
          className="w-full rounded-2xl object-cover shadow-md" style={{ maxHeight: '200px' }} />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-4 max-w-lg mx-auto w-full">

        <div className="card flex flex-col gap-3">
          <div>
            <label className="label">Nombre completo *</label>
            <input className="input" value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Teléfono *</label>
            <input className="input" type="tel" value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Dirección (opcional)</label>
            <input className="input" value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          </div>
        </div>

        <div className="card flex flex-col gap-3">
          <h2 className="font-bold text-[#1565C0]">Tipo de tareas:</h2>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(c => (
              <label key={c.id} className={`flex items-center gap-2 cursor-pointer rounded-xl p-3 border-2 transition-colors ${form.services.includes(c.id) ? 'border-[#1565C0] bg-blue-50' : 'border-gray-200 bg-white'}`}>
                <input type="checkbox" className="accent-[#1565C0] w-5 h-5"
                  checked={form.services.includes(c.id)} onChange={() => toggleService(c.id)} />
                <span className="text-sm font-medium">{c.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="card flex flex-col gap-3">
          <h2 className="font-bold text-[#1565C0]">Disponibilidad:</h2>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABILITY_OPTS.map(o => (
              <label key={o.key} className={`flex items-center gap-2 cursor-pointer rounded-xl p-3 border-2 transition-colors ${form.availability[o.key] ? 'border-[#1565C0] bg-blue-50' : 'border-gray-200 bg-white'}`}>
                <input type="checkbox" className="accent-[#1565C0] w-5 h-5"
                  checked={form.availability[o.key]} onChange={() => toggleAvail(o.key)} />
                <span className="text-sm font-medium">{o.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="card flex flex-col gap-3">
          <div>
            <label className="label">Descripción de experiencia</label>
            <textarea className="input min-h-[90px] resize-none" value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Contá tu experiencia y habilidades..." />
          </div>
          <div>
            <label className="label">Referencias (Nombre y Teléfono)</label>
            <textarea className="input min-h-[70px] resize-none" value={form.references}
              onChange={e => setForm(f => ({ ...f, references: e.target.value }))}
              placeholder="Ej: María González, 2974-123456" />
          </div>
        </div>

        {/* Subir foto */}
        <div className="card flex flex-col gap-3">
          <h2 className="font-bold text-[#1565C0]">Foto de perfil (opcional)</h2>
          <p className="text-sm text-gray-500">Tu foto genera más confianza en los vecinos.</p>
          <label className="flex flex-col items-center gap-3 cursor-pointer">
            {photoPreview
              ? <img src={photoPreview} alt="Vista previa" className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow" />
              : <div className="w-28 h-28 rounded-full bg-blue-50 border-2 border-dashed border-blue-300 flex flex-col items-center justify-center gap-1">
                  <span className="material-icons text-[#1565C0] text-4xl">add_a_photo</span>
                  <span className="text-xs text-[#1565C0] font-medium">Subir foto</span>
                </div>
            }
            <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            <span className="text-sm text-[#1565C0] underline font-medium">
              {photoPreview ? 'Cambiar foto' : 'Elegir imagen'}
            </span>
          </label>
        </div>

        <div className="card flex items-center justify-between gap-4">
          <p className="font-semibold text-gray-700">¿Aceptas ser calificado?</p>
          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input type="checkbox" className="sr-only peer"
              checked={form.accepts_rating}
              onChange={e => setForm(f => ({ ...f, accepts_rating: e.target.checked }))} />
            <div className="w-12 h-6 bg-gray-200 peer-checked:bg-[#1565C0] rounded-full transition-colors relative">
              <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5 transition-transform ${form.accepts_rating ? 'translate-x-6' : ''}`} />
            </div>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar registro'}
        </button>

        <p className="text-center text-xs text-gray-500">
          Tu perfil será validado por la Asociación Vecinal.
        </p>
      </form>

      <footer className="page-footer">
        <strong>Mosconi Servicios</strong> · Asociación Vecinal Mosconi KM3 Comodoro Rivadavia
      </footer>
    </div>
  )
}
