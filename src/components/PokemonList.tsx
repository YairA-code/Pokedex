import PokemonCard from './PokemonCard.tsx'
import type { PokemonSummary } from '../types/pokemon.ts'

interface PokemonListProps {
  pokemonList: PokemonSummary[]
  selectedId: number | null
  favorites: number[]
  onSelect: (id: number) => void
  onToggleFavorite: (id: number) => void
}

// The list of Pokémon. Each item gets a unique key: its id.
function PokemonList({ pokemonList, selectedId, favorites, onSelect, onToggleFavorite }: PokemonListProps) {
  return (
    <ul className="pokemon-list">
      {pokemonList.map((pokemon) => (
        <li key={pokemon.id}>
          <PokemonCard
            pokemon={pokemon}
            isSelected={pokemon.id === selectedId}
            isFavorite={favorites.includes(pokemon.id)}
            onSelect={onSelect}
            onToggleFavorite={onToggleFavorite}
          />
        </li>
      ))}
    </ul>
  )
}

export default PokemonList
