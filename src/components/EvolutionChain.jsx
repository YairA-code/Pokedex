import { getArtworkUrl, formatName, formatNumber } from '../utils/pokemon.js'

// Shows the evolution stages with arrows between them.
// Clicking a Pokémon opens its details (onSelect comes from App).
function EvolutionChain({ stages, currentId, onSelect }) {
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
              <button
                key={pokemon.id}
                type="button"
                className={`evolution__item ${pokemon.id === currentId ? 'evolution__item--current' : ''}`}
                aria-current={pokemon.id === currentId ? 'true' : undefined}
                onClick={() => onSelect(pokemon.id)}
              >
                <img src={getArtworkUrl(pokemon.id)} alt="" loading="lazy" />
                <span className="evolution__name">{formatName(pokemon.name)}</span>
                <span className="evolution__number">{formatNumber(pokemon.id)}</span>
              </button>
            ))}
          </div>
        </li>
      ))}
    </ol>
  )
}

export default EvolutionChain
