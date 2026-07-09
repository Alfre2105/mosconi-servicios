import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import { supabase } from '../lib/supabase'
import { PageHeader } from '../components/PageHeader'
import { Spinner } from '../components/Spinner'
import { WhatsAppButton } from '../components/WhatsAppButton'

export default function CompleteRequest() {
  const { id } = useParams()
  const [state, setState] = useState('loading')
  const [whatsappHref, setWhatsappHref] = useState('')
  const [neighborName, setNeighborName] = useState('')

  useEffect(() => {
    if (!id) { setState('error'); return }

    async function complete() {
      try {
        const { data: req, error } = await supabase
          .from('service_requests')
          .select('id, status, neighbor_id, worker_id')
          .eq('id', id)
          .maybeSingle()

        if (error || !req) { setState('error'); return }

        const [neighborRes, workerRes] = await Promise.all([
          supabase.from('neighbors').select('full_name, phone').eq('id', req.neighbor_id).single(),
          supabase.from('workers').select('full_name').eq('id', req.worker_id).single(),
        ])

        const neighbor = neighborRes.data
        const worker = workerRes.data

        if (neighbor) setNeighborName(neighbor.full_name ?? 'el vecino')

        const phone = (neighbor?.phone ?? '').replace(/\D/g, '')
        const number = phone.startsWith('549') ? phone : `549${phone}`
        const workerName = worker?.full_name ?? 'El trabajador'
        const nName = neighbor?.full_name ?? 'vecino/a'
        const rateLink = `https://mosconi-servicios-fwxc.vercel.app/calificar/${req.worker_id}`
        const msg = encodeURIComponent(
          `Hola ${nName}, soy ${workerName} de Mosconi Servicios.\n` +
          `Te aviso que el trabajo ha sido completado. ¡Gracias por confiar en nosotros!\n\n` +
          `Si querés, podés calificar el servicio acá: ${rateLink}`
        )
        setWhatsappHref(`https://wa.me/${number}?text=${msg}`)

        if (req.status === 'completado') { setState('already'); return }

        const { error: updErr } = await supabase
          .from('service_requests')
          .update({ status: 'completado' })
          .eq('id', id)

        if (updErr) { setState('error'); return }

        emailjs.send(
          'service_t9g6l0o',
          'template_r2m1rcj',
          {
            vecino: nName,
            telefono: neighbor?.phone ?? '—',
            trabajador: workerName,
            servicio: 'Trabajo completado',
            fecha: '—',
            hora: '—',
            comentario: `El trabajo fue marcado como completado por ${workerName}.`,
          },
          '5okt81n2drMODL3QB'
        ).catch(() => {})

        setState('success')
      } catch (e) {
        setState('error')
      }
    }

    complete()
  }, [id])

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader title="Trabajo completado" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5 text-center max-w-sm mx-auto w-full">

        {state === 'loading' && <Spinner />}

        {state === 'success' && (
          <>
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-md">
              <span className="material-icons text-green-500 text-6xl">task_alt</span>
            </div>
            <div className="card w-full">
              <p className="font-bold text-gray-800 text-lg mb-1">¡Trabajo completado!</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Avisale a <strong>{neighborName}</strong> que el trabajo terminó e invitalo a calificarte.
              </p>
            </div>
            <WhatsAppButton href={whatsappHref}>
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
              <p className="font-bold text-gray-800 text-lg mb-1">Este trabajo ya fue completado</p>
              <p className="text-gray-600 text-sm">Podés igualmente contactar al vecino por WhatsApp.</p>
            </div>
            <WhatsAppButton href={whatsappHref}>
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
