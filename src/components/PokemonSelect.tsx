import { formatName, formatNumber } from '../utils/pokemon.ts'
import type { PokemonSummary } from '../types/pokemon.ts'

interface PokemonSelectProps {
  label: string
  pokemonList: PokemonSummary[]
  value: number | null
  onChange: (id: number) => void
}

// A dropdown for choosing one Pokémon from the list.
function PokemonSelect({ label, pokemonList, value, onChange }: PokemonSelectProps) {
  return (
    <label className="pokemon-select">
      <span className="pokemon-select__label">{label}</span>
      <select
        className="pokemon-select__input"
        value={value ?? ''}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        <option value="" disabled>
          Choose a Pokémon
        </option>
        {pokemonList.map((pokemon) => (
          <option key={pokemon.id} value={pokemon.id}>
            {formatNumber(pokemon.id)} {formatName(pokemon.name)}
          </option>
        ))}
      </select>
    </label>
  )
}

export default PokemonSelect
