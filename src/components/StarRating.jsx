export function StarDisplay({ value, size = 'text-xl' }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`material-icons ${size} ${i <= Math.round(value) ? 'star-filled' : 'star-empty'}`}>
          star
        </span>
      ))}
    </span>
  )
}

export function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className={`material-icons text-4xl transition-colors ${i <= value ? 'star-filled' : 'star-empty'}`}
        >
          star
        </button>
      ))}
    </div>
  )
}
