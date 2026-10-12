import { getArtworkUrl, formatNumber, formatName } from '../utils/pokemon.js'

// One Pokémon in the list: picture, number and name.
function PokemonCard({ pokemon }) {
  return (
    <div className="pokemon-card">
      <img
        className="pokemon-card__image"
        src={getArtworkUrl(pokemon.id)}
        alt={formatName(pokemon.name)}
        loading="lazy"
      />
      <span className="pokemon-card__number">{formatNumber(pokemon.id)}</span>
      <span className="pokemon-card__name">{formatName(pokemon.name)}</span>
    </div>
  )
}

export default PokemonCard
