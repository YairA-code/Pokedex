import FavoriteButton from './FavoriteButton.jsx'
import { getArtworkUrl, formatNumber, formatName } from '../utils/pokemon.js'

// One Pokémon in the list: picture, number and name, plus a heart.
// The card is a button, so it works with the mouse and with the keyboard.
// The heart is a separate button next to it (a button inside a button is not allowed in HTML).
function PokemonCard({ pokemon, isSelected, isFavorite, onSelect, onToggleFavorite }) {
  const className = isSelected ? 'pokemon-card pokemon-card--selected' : 'pokemon-card'
  const name = formatName(pokemon.name)

  return (
    <div className="pokemon-card-wrap">
      <button type="button" className={className} onClick={() => onSelect(pokemon.id)}>
        <img
          className="pokemon-card__image"
          src={getArtworkUrl(pokemon.id)}
          alt={name}
          loading="lazy"
        />
        <span className="pokemon-card__number">{formatNumber(pokemon.id)}</span>
        <span className="pokemon-card__name">{name}</span>
      </button>
      <FavoriteButton
        className="pokemon-card__favorite"
        isFavorite={isFavorite}
        pokemonName={name}
        onToggle={() => onToggleFavorite(pokemon.id)}
      />
    </div>
  )
}

export default PokemonCard
