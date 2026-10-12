import { POKEMON_TYPES, formatName } from '../utils/pokemon.js'

// A row of buttons, one per type, plus "All".
// The selected type lives in App; this component only shows it and reports clicks.
function TypeFilter({ selectedType, onChange }) {
  const options = ['all', ...POKEMON_TYPES]

  return (
    <div className="type-filter" role="group" aria-label="Filter by type">
      {options.map((type) => (
        <button
          key={type}
          type="button"
          className={`type-filter__chip type-color--${type}`}
          aria-pressed={selectedType === type}
          onClick={() => onChange(type)}
        >
          {type === 'all' ? 'All types' : formatName(type)}
        </button>
      ))}
    </div>
  )
}

export default TypeFilter
