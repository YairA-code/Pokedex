import { useState } from 'react'
import { Link } from 'react-router'
import StatBar from './StatBar.tsx'
import FavoriteButton from './FavoriteButton.tsx'
import EvolutionChain from './EvolutionChain.tsx'
import { formatNumber, formatName, getStatTotal, FIRST_ID, LAST_ID } from '../utils/pokemon.ts'
import type { PokemonDetail } from '../types/pokemon.ts'

interface PokemonDetailsProps {
  pokemon: PokemonDetail
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
}

// Shows one Pokémon. It gets the data in props: DetailsPage does the loading.
function PokemonDetails({ pokemon, isFavorite, onToggleFavorite }: PokemonDetailsProps) {
  // Show the shiny (rare color) artwork instead of the normal one.
  const [isShiny, setIsShiny] = useState(false)

  const name = formatName(pokemon.name)
  const totalStats = getStatTotal(pokemon.stats)

  return (
    // The first type gives the panel its color (see .type-color--* in App.css).
    <section className={`pokemon-details type-color--${pokemon.types[0]}`} aria-label={`${name} details`}>
      <div className="pokemon-details__banner">
        <div className="pokemon-details__toolbar">
          <span className="pokemon-details__number">{formatNumber(pokemon.id)}</span>
          {pokemon.shinyImage && (
            <button
              type="button"
              className="pokemon-details__shiny"
              aria-pressed={isShiny}
              title="Show the shiny (rare color) version"
              onClick={() => setIsShiny(!isShiny)}
            >
              ✨ Shiny
            </button>
          )}
          <FavoriteButton
            className="pokemon-details__favorite"
            isFavorite={isFavorite}
            pokemonName={name}
            onToggle={() => onToggleFavorite(pokemon.id)}
          />
        </div>
        <img
          className="pokemon-details__image"
          src={isShiny && pokemon.shinyImage ? pokemon.shinyImage : pokemon.image}
          alt={isShiny ? `${name} (shiny)` : name}
        />
      </div>

      <div className="pokemon-details__body">
        <h1 className="pokemon-details__name">{name}</h1>
        {pokemon.genus && <p className="pokemon-details__genus">{pokemon.genus}</p>}

        <ul className="pokemon-details__types">
          {pokemon.types.map((type) => (
            <li key={type} className={`type-badge type-color--${type}`}>
              {formatName(type)}
            </li>
          ))}
          {pokemon.isLegendary && <li className="tag tag--legendary">Legendary</li>}
          {pokemon.isMythical && <li className="tag tag--mythical">Mythical</li>}
        </ul>

        {pokemon.description && <p className="pokemon-details__description">{pokemon.description}</p>}

        <dl className="pokemon-details__measures">
          <div>
            <dt>Height</dt>
            <dd>{pokemon.heightMeters} m</dd>
          </div>
          <div>
            <dt>Weight</dt>
            <dd>{pokemon.weightKg} kg</dd>
          </div>
          <div>
            <dt>Habitat</dt>
            <dd>{pokemon.habitat ? formatName(pokemon.habitat) : '—'}</dd>
          </div>
        </dl>

        <h2 className="pokemon-details__heading">Abilities</h2>
        <ul className="pokemon-details__abilities">
          {pokemon.abilities.map((ability) => (
            <li key={ability.name} className="ability-chip">
              {formatName(ability.name)}
              {ability.isHidden && <span className="ability-chip__hidden">hidden</span>}
            </li>
          ))}
        </ul>

        <h2 className="pokemon-details__heading">Base stats</h2>
        <div className="pokemon-details__stats">
          {pokemon.stats.map((stat) => (
            <StatBar key={stat.name} name={stat.name} value={stat.value} />
          ))}
          <div className="stat-total">
            <span>Total</span>
            <strong>{totalStats}</strong>
          </div>
        </div>

        <h2 className="pokemon-details__heading">Evolution</h2>
        <EvolutionChain stages={pokemon.evolutionStages} currentId={pokemon.id} />

        <Link to={`/compare?a=${pokemon.id}`} className="pokemon-details__compare">
          Compare with another Pokémon
        </Link>

        <nav className="pokemon-details__nav" aria-label="Previous and next Pokémon">
          {pokemon.id > FIRST_ID && (
            <Link to={`/items/${pokemon.id - 1}`} className="pokemon-details__nav-button">
              ← {formatNumber(pokemon.id - 1)}
            </Link>
          )}
          {pokemon.id < LAST_ID && (
            <Link to={`/items/${pokemon.id + 1}`} className="pokemon-details__nav-button">
              {formatNumber(pokemon.id + 1)} →
            </Link>
          )}
        </nav>
      </div>
    </section>
  )
}

export default PokemonDetails
