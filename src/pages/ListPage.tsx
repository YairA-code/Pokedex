import { useNavigate } from 'react-router'
import ListStatus from '../components/ListStatus.tsx'
import PokemonList from '../components/PokemonList.tsx'
import SearchBar from '../components/SearchBar.tsx'
import SortSelect from '../components/SortSelect.tsx'
import StatusMessage from '../components/StatusMessage.tsx'
import TypeFilter from '../components/TypeFilter.tsx'
import { useTypeIds } from '../hooks/useTypeIds.ts'
import { formatName, getVisiblePokemon } from '../utils/pokemon.ts'
import type { ListFilters, PokemonListState } from '../types/pokemon.ts'

interface ListPageProps {
  listState: PokemonListState
  filters: ListFilters
  onFiltersChange: (filters: ListFilters) => void
  favorites: number[]
  onToggleFavorite: (id: number) => void
}

// The page at /items: the search, the filters and the list of cards.
function ListPage({ listState, filters, onFiltersChange, favorites, onToggleFavorite }: ListPageProps) {
  const navigate = useNavigate()
  const { typeIds, typeStatus, retryType } = useTypeIds(filters.type)

  if (listState.status !== 'success') return <ListStatus listState={listState} />

  // Not stored in state: calculated from the other state on every render,
  // so it is always up to date.
  const visiblePokemon = getVisiblePokemon(listState.pokemonList, filters, typeIds)
  const isListReady = typeStatus === 'success'
  const hasFilters = filters.searchText !== '' || filters.type !== 'all'

  function clearFilters() {
    onFiltersChange({ ...filters, searchText: '', type: 'all' })
  }

  // Open a random Pokémon from the ones shown right now.
  function showRandomPokemon() {
    const index = Math.floor(Math.random() * visiblePokemon.length)
    navigate(`/items/${visiblePokemon[index].id}`)
  }

  function renderList() {
    if (typeStatus === 'loading') {
      return <StatusMessage type="loading" message={`Loading ${formatName(filters.type)} Pokémon...`} />
    }
    if (typeStatus === 'error') {
      return (
        <StatusMessage
          type="error"
          message={`Could not load the ${formatName(filters.type)} type.`}
          onRetry={retryType}
        />
      )
    }
    if (visiblePokemon.length === 0) {
      return <p className="app__empty">No Pokémon found.</p>
    }
    return (
      <PokemonList
        pokemonList={visiblePokemon}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
      />
    )
  }

  return (
    <>
      <h1 className="visually-hidden">All Pokémon</h1>
      <div className="toolbar">
        <SearchBar
          value={filters.searchText}
          onChange={(searchText) => onFiltersChange({ ...filters, searchText })}
        />
        <TypeFilter
          selectedType={filters.type}
          onChange={(type) => onFiltersChange({ ...filters, type })}
        />
        <div className="toolbar__row">
          <p className="toolbar__count">
            {isListReady ? `${visiblePokemon.length} Pokémon shown` : 'Loading...'}
            {hasFilters && (
              <button type="button" className="toolbar__clear" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </p>
          <div className="toolbar__actions">
            <button
              type="button"
              className="toolbar__button"
              onClick={showRandomPokemon}
              disabled={!isListReady || visiblePokemon.length === 0}
            >
              🎲 Surprise me
            </button>
            <SortSelect
              value={filters.sort}
              onChange={(sort) => onFiltersChange({ ...filters, sort })}
            />
          </div>
        </div>
      </div>
      {renderList()}
    </>
  )
}

export default ListPage
