import { Link } from 'react-router'
import FavoriteButton from './FavoriteButton.tsx'
import { getArtworkUrl, formatNumber, formatName } from '../utils/pokemon.ts'
import type { PokemonSummary } from '../types/pokemon.ts'

interface PokemonCardProps {
  pokemon: PokemonSummary
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
}

// One Pokémon in the list: picture, number and name, plus a heart.
// The card is a link to the Pokémon's own address.
// The heart is a separate button next to it (a button inside a link is not allowed in HTML).
function PokemonCard({ pokemon, isFavorite, onToggleFavorite }: PokemonCardProps) {
  const name = formatName(pokemon.name)

  return (
    <div className="pokemon-card-wrap">
      <Link to={`/items/${pokemon.id}`} className="pokemon-card">
        <img
          className="pokemon-card__image"
          src={getArtworkUrl(pokemon.id)}
          alt=""
          loading="lazy"
        />
        <span className="pokemon-card__number">{formatNumber(pokemon.id)}</span>
        <span className="pokemon-card__name">{name}</span>
      </Link>
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
