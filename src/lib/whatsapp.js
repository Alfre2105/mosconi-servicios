export function whatsappWorkerLink(phone, workerName) {
  const cleaned = phone.replace(/\D/g, '')
  const number = cleaned.startsWith('549') ? cleaned : `549${cleaned}`
  const msg = encodeURIComponent(
    `Hola ${workerName}, soy vecino/a de Mosconi y necesito un servicio. Te contacto a través de Mosconi Servicios.`
  )
  return `https://wa.me/${number}?text=${msg}`
}

export function whatsappAdminLink() {
  const number = import.meta.env.VITE_WHATSAPP_ADMIN || '5492974000000'
  const msg = encodeURIComponent('Hola, me comunico desde Mosconi Servicios.')
  return `https://wa.me/${number}?text=${msg}`
}
