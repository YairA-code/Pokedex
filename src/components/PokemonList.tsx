import PokemonCard from './PokemonCard.tsx'
import type { PokemonSummary } from '../types/pokemon.ts'

interface PokemonListProps {
  pokemonList: PokemonSummary[]
  favorites: number[]
  onToggleFavorite: (id: number) => void
}

// The list of Pokémon. Each item gets a unique key: its id.
function PokemonList({ pokemonList, favorites, onToggleFavorite }: PokemonListProps) {
  return (
    <ul className="pokemon-list">
      {pokemonList.map((pokemon) => (
        <li key={pokemon.id}>
          <PokemonCard
            pokemon={pokemon}
            isFavorite={favorites.includes(pokemon.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </li>
      ))}
    </ul>
  )
}

export default PokemonList
