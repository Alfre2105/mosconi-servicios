import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { PageHeader } from '../components/PageHeader'
import { Spinner } from '../components/Spinner'
import { WhatsAppButton } from '../components/WhatsAppButton'

export default function AcceptRequest() {
  const { id } = useParams()
  const [state, setState] = useState('loading') // loading | success | already | error
  const [data, setData] = useState(null)

  useEffect(() => {
    async function accept() {
      try {
        const { data: req, error } = await supabase
          .from('service_requests')
          .select('id, status, neighbor_id, worker_id')
          .eq('id', id)
          .maybeSingle()

        if (error || !req) { setState('error'); return }

        const [neighborRes, workerRes] = await Promise.all([
          supabase.from('neighbors').select('full_name, phone').eq('id', req.neighbor_id).single(),
          supabase.from('workers').select('full_name, phone').eq('id', req.worker_id).single(),
        ])

        const enriched = {
          ...req,
          neighbor: neighborRes.data,
          worker: workerRes.data,
        }

        if (req.status === 'aceptado') { setData(enriched); setState('already'); return }

        const { error: updErr } = await supabase
          .from('service_requests')
          .update({ status: 'aceptado' })
          .eq('id', id)

        if (updErr) { setState('error'); return }

        setData(enriched)
        setState('success')
      } catch (e) {
        setState('error')
      }
    }
    accept()
  }, [id])

  function whatsappNeighbor(req) {
    const phone = req.neighbor?.phone?.replace(/\D/g, '')
    const number = phone?.startsWith('549') ? phone : `549${phone}`
    const workerName = req.worker?.full_name ?? 'El trabajador'
    const neighborName = req.neighbor?.full_name ?? 'vecino/a'
    const msg = encodeURIComponent(
      `Hola ${neighborName}, soy ${workerName} de Mosconi Servicios.\n` +
      `Acepté tu solicitud de servicio y me pongo en contacto para coordinar. ¿Cuándo te viene bien?`
    )
    return `https://wa.me/${number}?text=${msg}`
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader title="Confirmación de solicitud" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5 text-center max-w-sm mx-auto w-full">

        {state === 'loading' && <Spinner />}

        {state === 'success' && (
          <>
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-md">
              <span className="material-icons text-green-500 text-6xl">check_circle</span>
            </div>
            <div className="card w-full">
              <p className="font-bold text-gray-800 text-lg mb-1">¡Solicitud aceptada!</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Avisale a <strong>{data?.neighbors?.full_name}</strong> que vas a atender su pedido.
              </p>
            </div>
            <WhatsAppButton href={whatsappNeighbor(data)}>
              Avisar al vecino por WhatsApp
            </WhatsAppButton>
          </>
        )}

        {state === 'already' && (
          <>
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center shadow-md">
              <span className="material-icons text-blue-500 text-6xl">info</span>
            </div>
            <div className="card w-full">
              <p className="font-bold text-gray-800 text-lg mb-1">Ya aceptaste esta solicitud</p>
              <p className="text-gray-600 text-sm">Podés igualmente contactar al vecino por WhatsApp.</p>
            </div>
            <WhatsAppButton href={whatsappNeighbor(data)}>
              Contactar al vecino
            </WhatsAppButton>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center shadow-md">
              <span className="material-icons text-red-400 text-6xl">error_outline</span>
            </div>
            <div className="card w-full">
              <p className="font-bold text-gray-800 text-lg mb-1">No encontramos la solicitud</p>
              <p className="text-gray-600 text-sm">El link puede ser incorrecto o la solicitud ya no existe.</p>
            </div>
          </>
        )}

      </div>

      <footer className="page-footer">
        <strong>Mosconi Servicios</strong> · Asociación Vecinal Mosconi KM3 Comodoro Rivadavia
      </footer>
    </div>
  )
}
