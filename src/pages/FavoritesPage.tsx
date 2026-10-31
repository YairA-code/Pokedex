import { Link } from 'react-router'
import ListStatus from '../components/ListStatus.tsx'
import PokemonList from '../components/PokemonList.tsx'
import { getFavoritePokemon } from '../utils/pokemon.ts'
import type { PokemonListState } from '../types/pokemon.ts'

interface FavoritesPageProps {
  listState: PokemonListState
  favorites: number[]
  onToggleFavorite: (id: number) => void
}

// The page at /favorites: the Pokémon the user saved with the heart.
function FavoritesPage({ listState, favorites, onToggleFavorite }: FavoritesPageProps) {
  if (listState.status !== 'success') return <ListStatus listState={listState} />

  const favoritePokemon = getFavoritePokemon(listState.pokemonList, favorites)

  return (
    <>
      <h1 className="page-title">My favorites</h1>
      {favoritePokemon.length === 0 ? (
        <div className="app__empty">
          <p>No favorites yet. Tap the heart on a Pokémon to save it here.</p>
          <Link to="/items" className="not-found__link">
            Browse Pokémon
          </Link>
        </div>
      ) : (
        <>
          <p className="page-subtitle">
            {favoritePokemon.length} saved in this browser. Tap a heart to remove one.
          </p>
          <PokemonList
            pokemonList={favoritePokemon}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        </>
      )}
    </>
  )
}

export default FavoritesPage
