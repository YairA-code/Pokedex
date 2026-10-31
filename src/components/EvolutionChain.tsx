import { Link } from 'react-router'
import { getArtworkUrl, formatName, formatNumber } from '../utils/pokemon.ts'
import type { PokemonSummary } from '../types/pokemon.ts'

interface EvolutionChainProps {
  stages: PokemonSummary[][]
  currentId: number
}

// Shows the evolution stages with arrows between them.
// Each Pokémon is a link to its own address.
function EvolutionChain({ stages, currentId }: EvolutionChainProps) {
  const total = stages.reduce((count, stage) => count + stage.length, 0)
  if (total <= 1) {
    return <p className="evolution__none">This Pokémon does not evolve.</p>
  }

  return (
    <ol className="evolution">
      {stages.map((stage, index) => (
        // The first Pokémon's id is a stable, unique key for the stage.
        <li key={stage[0].id} className="evolution__stage">
          {index > 0 && (
            <span className="evolution__arrow" aria-hidden="true">
              →
            </span>
          )}
          <div className="evolution__options">
            {stage.map((pokemon) => (
              <Link
                key={pokemon.id}
                to={`/items/${pokemon.id}`}
                className={`evolution__item ${pokemon.id === currentId ? 'evolution__item--current' : ''}`}
                aria-current={pokemon.id === currentId ? 'page' : undefined}
              >
                <img src={getArtworkUrl(pokemon.id)} alt="" loading="lazy" />
                <span className="evolution__name">{formatName(pokemon.name)}</span>
                <span className="evolution__number">{formatNumber(pokemon.id)}</span>
              </Link>
            ))}
          </div>
        </li>
      ))}
    </ol>
  )
}

export default EvolutionChain
