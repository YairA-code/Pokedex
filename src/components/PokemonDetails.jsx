import { useState, useEffect } from 'react'
import StatusMessage from './StatusMessage.jsx'
import StatBar from './StatBar.jsx'
import { getArtworkUrl, formatNumber, formatName } from '../utils/pokemon.js'

// The details panel for the selected Pokémon.
// It loads the full data of one Pokémon from the API.
// App gives this component key={pokemonId}, so every new Pokémon gets a fresh
// component with fresh state (status starts again at 'loading').
function PokemonDetails({ pokemonId }) {
  const [pokemon, setPokemon] = useState(null)
  // 'loading' | 'error' | 'success'
  const [status, setStatus] = useState('loading')
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadDetails() {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`The server answered with status ${response.status}.`)
        }
        const data = await response.json()
        // Keep only the fields we show, in a simple shape.
        setPokemon({
          id: data.id,
          name: data.name,
          image: data.sprites?.other?.['official-artwork']?.front_default || getArtworkUrl(data.id),
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

  if (status === 'loading') {
    return (
      <section className="pokemon-details">
        <StatusMessage type="loading" message="Loading details..." />
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section className="pokemon-details">
        <StatusMessage
          type="error"
          message="Could not load the details of this Pokémon."
          onRetry={handleRetry}
        />
      </section>
    )
  }

  return (
    <section className="pokemon-details">
      <img className="pokemon-details__image" src={pokemon.image} alt={formatName(pokemon.name)} />
      <p className="pokemon-details__number">{formatNumber(pokemon.id)}</p>
      <h2 className="pokemon-details__name">{formatName(pokemon.name)}</h2>

      <ul className="pokemon-details__types">
        {pokemon.types.map((type) => (
          <li key={type} className={`type-badge type-color--${type}`}>
            {formatName(type)}
          </li>
        ))}
      </ul>

      <dl className="pokemon-details__measures">
        <div>
          <dt>Height</dt>
          <dd>{pokemon.heightMeters} m</dd>
        </div>
        <div>
          <dt>Weight</dt>
          <dd>{pokemon.weightKg} kg</dd>
        </div>
      </dl>

      <h3 className="pokemon-details__heading">Abilities</h3>
      <ul className="pokemon-details__abilities">
        {pokemon.abilities.map((ability) => (
          <li key={ability.name}>
            {formatName(ability.name)}
            {ability.isHidden && <span className="pokemon-details__hidden"> (hidden)</span>}
          </li>
        ))}
      </ul>

      <h3 className="pokemon-details__heading">Base stats</h3>
      <div className="pokemon-details__stats">
        {pokemon.stats.map((stat) => (
          <StatBar key={stat.name} name={stat.name} value={stat.value} />
        ))}
      </div>
    </section>
  )
}

export default PokemonDetails
