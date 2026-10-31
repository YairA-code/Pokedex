import { useSearchParams } from 'react-router'
import CompareSide from '../components/CompareSide.tsx'
import CompareTable from '../components/CompareTable.tsx'
import ListStatus from '../components/ListStatus.tsx'
import PokemonSelect from '../components/PokemonSelect.tsx'
import { usePokemonDetail } from '../hooks/usePokemonDetail.ts'
import { parsePokemonId } from '../utils/pokemon.ts'
import type { PokemonListState } from '../types/pokemon.ts'

interface ComparePageProps {
  listState: PokemonListState
}

// The page at /compare?a=1&b=25. The choice lives in the address, not in useState,
// so a refresh keeps it and the link can be shared.
function ComparePage({ listState }: ComparePageProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const idA = parsePokemonId(searchParams.get('a'))
  const idB = parsePokemonId(searchParams.get('b'))
  const detailA = usePokemonDetail(idA)
  const detailB = usePokemonDetail(idB)

  if (listState.status !== 'success') return <ListStatus listState={listState} />

  function choose(side: 'a' | 'b', id: number) {
    const next = new URLSearchParams(searchParams)
    next.set(side, String(id))
    setSearchParams(next)
  }

  return (
    <div className="compare">
      <h1 className="page-title">Compare two Pokémon</h1>
      <div className="compare__sides">
        <div className="compare__side">
          <PokemonSelect
            label="First Pokémon"
            pokemonList={listState.pokemonList}
            value={idA}
            onChange={(id) => choose('a', id)}
          />
          {idA !== null && (
            <CompareSide pokemon={detailA.pokemon} status={detailA.status} onRetry={detailA.retry} />
          )}
        </div>
        <div className="compare__side">
          <PokemonSelect
            label="Second Pokémon"
            pokemonList={listState.pokemonList}
            value={idB}
            onChange={(id) => choose('b', id)}
          />
          {idB !== null && (
            <CompareSide pokemon={detailB.pokemon} status={detailB.status} onRetry={detailB.retry} />
          )}
        </div>
      </div>
      {detailA.pokemon && detailB.pokemon ? (
        <CompareTable pokemonA={detailA.pokemon} pokemonB={detailB.pokemon} />
      ) : (
        (idA === null || idB === null) && (
          <p className="app__empty">Choose two Pokémon to see their base stats side by side.</p>
        )
      )}
    </div>
  )
}

export default ComparePage
