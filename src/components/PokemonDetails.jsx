import { useState, useEffect } from 'react'
import StatusMessage from './StatusMessage.jsx'
import StatBar from './StatBar.jsx'
import FavoriteButton from './FavoriteButton.jsx'
import EvolutionChain from './EvolutionChain.jsx'
import {
  getArtworkUrl,
  formatNumber,
  formatName,
  getEnglishDescription,
  getEnglishGenus,
  getEvolutionStages,
  FIRST_ID,
  LAST_ID,
} from '../utils/pokemon.js'

// Loads one URL and returns the JSON. Throws if the server answers with an error.
async function fetchJson(url, signal) {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`The server answered with status ${response.status}.`)
  }
  return response.json()
}

// The details panel for the selected Pokémon.
// App gives this component key={pokemonId}, so every new Pokémon gets a fresh
// component with fresh state (status starts again at 'loading').
function PokemonDetails({ pokemonId, isFavorite, onToggleFavorite, onSelect, onClose }) {
  const [pokemon, setPokemon] = useState(null)
  // 'loading' | 'error' | 'success'
  const [status, setStatus] = useState('loading')
  const [reloadCount, setReloadCount] = useState(0)
  // Show the shiny (rare color) artwork instead of the normal one.
  const [isShiny, setIsShiny] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadDetails() {
      try {
        // Two requests at the same time: the Pokémon (types, stats...) and its
        // species (description, category). Promise.all waits for both.
        const [data, species] = await Promise.all([
          fetchJson(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`, controller.signal),
          fetchJson(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`, controller.signal),
        ])
        // The species tells us where its evolution chain is, so this request comes after.
        const evolution = await fetchJson(species.evolution_chain.url, controller.signal)
        // Keep only the fields we show, in a simple shape.
        setPokemon({
          id: data.id,
          name: data.name,
          image: data.sprites?.other?.['official-artwork']?.front_default || getArtworkUrl(data.id),
          shinyImage: data.sprites?.other?.['official-artwork']?.front_shiny || null,
          types: data.types.map((item) => item.type.name),
          // Height comes in decimeters and weight in hectograms.
          heightMeters: data.height / 10,
          weightKg: data.weight / 10,
          abilities: data.abilities.map((item) => ({
            name: item.ability.name,
            isHidden: item.is_hidden,
          })),
          stats: data.stats.map((item) => ({
            name: item.stat.name,
            value: item.base_stat,
          })),
          genus: getEnglishGenus(species.genera),
          description: getEnglishDescription(species.flavor_text_entries),
          habitat: species.habitat ? species.habitat.name : null,
          isLegendary: species.is_legendary,
          isMythical: species.is_mythical,
          evolutionStages: getEvolutionStages(evolution.chain),
        })
        setStatus('success')
      } catch (error) {
        // A cancelled request is not a real error.
        if (error.name === 'AbortError') return
        setStatus('error')
      }
    }

    loadDetails()

    return () => controller.abort()
  }, [pokemonId, reloadCount])

  function handleRetry() {
    setStatus('loading')
    setReloadCount((count) => count + 1)
  }

  const closeButton = (
    <button type="button" className="pokemon-details__close" aria-label="Close details" onClick={onClose}>
      ×
    </button>
  )

  if (status === 'loading') {
    return (
      <section className="pokemon-details pokemon-details--status">
        {closeButton}
        <StatusMessage type="loading" message="Loading details..." />
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section className="pokemon-details pokemon-details--status">
        {closeButton}
        <StatusMessage
          type="error"
          message="Could not load the details of this Pokémon."
          onRetry={handleRetry}
        />
      </section>
    )
  }

  const name = formatName(pokemon.name)
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.value, 0)

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
          {closeButton}
        </div>
        <img
          className="pokemon-details__image"
          src={isShiny ? pokemon.shinyImage : pokemon.image}
          alt={isShiny ? `${name} (shiny)` : name}
        />
      </div>

      <div className="pokemon-details__body">
        <h2 className="pokemon-details__name">{name}</h2>
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

        <h3 className="pokemon-details__heading">Abilities</h3>
        <ul className="pokemon-details__abilities">
          {pokemon.abilities.map((ability) => (
            <li key={ability.name} className="ability-chip">
              {formatName(ability.name)}
              {ability.isHidden && <span className="ability-chip__hidden">hidden</span>}
            </li>
          ))}
        </ul>

        <h3 className="pokemon-details__heading">Base stats</h3>
        <div className="pokemon-details__stats">
          {pokemon.stats.map((stat) => (
            <StatBar key={stat.name} name={stat.name} value={stat.value} />
          ))}
          <div className="stat-total">
            <span>Total</span>
            <strong>{totalStats}</strong>
          </div>
        </div>

        <h3 className="pokemon-details__heading">Evolution</h3>
        <EvolutionChain stages={pokemon.evolutionStages} currentId={pokemon.id} onSelect={onSelect} />

        <nav className="pokemon-details__nav" aria-label="Previous and next Pokémon">
          <button
            type="button"
            className="pokemon-details__nav-button"
            disabled={pokemon.id <= FIRST_ID}
            onClick={() => onSelect(pokemon.id - 1)}
          >
            ← {formatNumber(Math.max(pokemon.id - 1, FIRST_ID))}
          </button>
          <button
            type="button"
            className="pokemon-details__nav-button"
            disabled={pokemon.id >= LAST_ID}
            onClick={() => onSelect(pokemon.id + 1)}
          >
            {formatNumber(Math.min(pokemon.id + 1, LAST_ID))} →
          </button>
        </nav>
      </div>
    </section>
  )
}

export default PokemonDetails
