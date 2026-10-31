import { Link, useParams } from 'react-router'
import PokemonDetails from '../components/PokemonDetails.tsx'
import StatusMessage from '../components/StatusMessage.tsx'
import NotFoundPage from './NotFoundPage.tsx'
import { usePokemonDetail } from '../hooks/usePokemonDetail.ts'
import { parsePokemonId } from '../utils/pokemon.ts'

interface DetailsPageProps {
  favorites: number[]
  onToggleFavorite: (id: number) => void
}

// The page at /items/:id. The id comes from the address, so a refresh or a shared link works.
function DetailsPage({ favorites, onToggleFavorite }: DetailsPageProps) {
  const params = useParams()
  const id = parsePokemonId(params.id)
  const { pokemon, status, retry } = usePokemonDetail(id)

  if (id === null) return <NotFoundPage />

  return (
    <div className="details-page">
      <Link to="/items" className="details-page__back">
        ← All Pokémon
      </Link>
      {status === 'loading' && <StatusMessage type="loading" message="Loading details..." />}
      {status === 'error' && (
        <StatusMessage type="error" message="Could not load the details of this Pokémon." onRetry={retry} />
      )}
      {pokemon && (
        // A new key gives every Pokémon a fresh component, so "shiny" does not stay on.
        <PokemonDetails
          key={pokemon.id}
          pokemon={pokemon}
          isFavorite={favorites.includes(pokemon.id)}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </div>
  )
}

export default DetailsPage
