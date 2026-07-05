export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false })

  const { vecino, telefono, trabajador, servicio, fecha, hora, comentario } = req.body

  const html = `
    <h2>Nueva solicitud de servicio — Mosconi Servicios</h2>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
      <tr><td style="padding:8px;font-weight:bold;color:#1565C0">Vecino</td><td style="padding:8px">${vecino}</td></tr>
      <tr style="background:#f4f6f9"><td style="padding:8px;font-weight:bold;color:#1565C0">Teléfono</td><td style="padding:8px">${telefono}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#1565C0">Trabajador</td><td style="padding:8px">${trabajador}</td></tr>
      <tr style="background:#f4f6f9"><td style="padding:8px;font-weight:bold;color:#1565C0">Servicio</td><td style="padding:8px">${servicio}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#1565C0">Fecha preferida</td><td style="padding:8px">${fecha || '—'}</td></tr>
      <tr style="background:#f4f6f9"><td style="padding:8px;font-weight:bold;color:#1565C0">Hora preferida</td><td style="padding:8px">${hora || '—'}</td></tr>
      ${comentario ? `<tr><td style="padding:8px;font-weight:bold;color:#1565C0">Comentario</td><td style="padding:8px">${comentario}</td></tr>` : ''}
    </table>
    <p style="margin-top:16px;font-size:12px;color:#9e9e9e">Este mensaje fue generado automáticamente por Mosconi Servicios.</p>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Mosconi Servicios <onboarding@resend.dev>',
      to: ['alfregomezcr@gmail.com'],
      subject: `Nueva solicitud: ${vecino} → ${trabajador}`,
      html,
    }),
  })

  if (!response.ok) return res.status(500).json({ ok: false })
  res.status(200).json({ ok: true })
}
