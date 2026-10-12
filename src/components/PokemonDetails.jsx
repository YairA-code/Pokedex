import { getArtworkUrl, formatNumber, formatName } from '../utils/pokemon.js'

// The details panel for the selected Pokémon.
function PokemonDetails({ pokemon }) {
  if (!pokemon) {
    return (
      <section className="pokemon-details pokemon-details--empty">
        <p>Choose a Pokémon from the list to see its details.</p>
      </section>
    )
  }

  return (
    <section className="pokemon-details">
      <img
        className="pokemon-details__image"
        src={getArtworkUrl(pokemon.id)}
        alt={formatName(pokemon.name)}
      />
      <p className="pokemon-details__number">{formatNumber(pokemon.id)}</p>
      <h2 className="pokemon-details__name">{formatName(pokemon.name)}</h2>
    </section>
  )
}

export default PokemonDetails
