import SkeletonList from './SkeletonList.tsx'
import StatusMessage from './StatusMessage.tsx'
import type { PokemonListState } from '../types/pokemon.ts'

interface ListStatusProps {
  listState: PokemonListState
}

// What a page shows until the list of 151 Pokémon is ready: loading or error.
function ListStatus({ listState }: ListStatusProps) {
  if (listState.status === 'error') {
    return (
      <StatusMessage
        type="error"
        message={`Could not load the Pokémon. ${listState.errorMessage}`}
        onRetry={listState.retry}
      />
    )
  }

  return (
    <>
      <StatusMessage type="loading" message="Loading Pokémon..." />
      <SkeletonList />
    </>
  )
}

export default ListStatus
