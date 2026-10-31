import { Link } from 'react-router'
import StatusMessage from './StatusMessage.tsx'
import { formatName, formatNumber } from '../utils/pokemon.ts'
import type { LoadStatus, PokemonDetail } from '../types/pokemon.ts'

interface CompareSideProps {
  pokemon: PokemonDetail | null
  status: LoadStatus
  onRetry: () => void
}

// One side of the compare page: the picture and types, or its loading / error state.
function CompareSide({ pokemon, status, onRetry }: CompareSideProps) {
  if (status === 'error') {
    return <StatusMessage type="error" message="Could not load this Pokémon." onRetry={onRetry} />
  }
  if (pokemon === null) {
    return <StatusMessage type="loading" message="Loading..." />
  }

  return (
    <Link to={`/items/${pokemon.id}`} className="compare-side">
      <img className="compare-side__image" src={pokemon.image} alt="" />
      <span className="compare-side__number">{formatNumber(pokemon.id)}</span>
      <span className="compare-side__name">{formatName(pokemon.name)}</span>
      <span className="compare-side__types">
        {pokemon.types.map((type) => (
          <span key={type} className={`type-badge type-color--${type}`}>
            {formatName(type)}
          </span>
        ))}
      </span>
    </Link>
  )
}

export default CompareSide
