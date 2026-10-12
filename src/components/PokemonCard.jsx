import { getArtworkUrl, formatNumber, formatName } from '../utils/pokemon.js'

// One Pokémon in the list: picture, number and name.
// It is a button, so it works with the mouse and with the keyboard.
function PokemonCard({ pokemon, isSelected, onSelect }) {
  const className = isSelected ? 'pokemon-card pokemon-card--selected' : 'pokemon-card'

  return (
    <button type="button" className={className} onClick={() => onSelect(pokemon.id)}>
      <img
        className="pokemon-card__image"
        src={getArtworkUrl(pokemon.id)}
        alt={formatName(pokemon.name)}
        loading="lazy"
      />
      <span className="pokemon-card__number">{formatNumber(pokemon.id)}</span>
      <span className="pokemon-card__name">{formatName(pokemon.name)}</span>
    </button>
  )
}

export default PokemonCard
