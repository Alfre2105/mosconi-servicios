import { useCategories } from '../hooks/useCategories'

export function FilterBar({ filters, onChange }) {
  const { categories } = useCategories()

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="label">Tipo de tarea</label>
        <select
          className="input"
          value={filters.category || ''}
          onChange={e => onChange({ ...filters, category: e.target.value || null })}
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Disponibilidad</label>
        <select
          className="input"
          value={filters.availability || ''}
          onChange={e => onChange({ ...filters, availability: e.target.value || null })}
        >
          <option value="">Cualquier horario</option>
          <option value="morning">Mañana</option>
          <option value="afternoon">Tarde</option>
          <option value="night">Noche</option>
          <option value="weekend">Fines de semana</option>
        </select>
      </div>
      <div>
        <label className="label">Calificación mínima</label>
        <select
          className="input"
          value={filters.min_rating || ''}
          onChange={e => onChange({ ...filters, min_rating: e.target.value || null })}
        >
          <option value="">Cualquier calificación</option>
          <option value="4">4+ estrellas</option>
          <option value="3">3+ estrellas</option>
        </select>
      </div>
    </div>
  )
}
