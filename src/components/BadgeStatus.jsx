export function BadgeStatus({ status }) {
  if (status === 'verificado') {
    return (
      <span className="flex items-center gap-1 bg-blue-100 text-[#1565C0] text-xs font-bold px-2 py-1 rounded-full w-fit">
        <span className="material-icons text-sm">verified</span>Verificado
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full w-fit">
      <span className="material-icons text-sm">fiber_new</span>Nuevo
    </span>
  )
}
