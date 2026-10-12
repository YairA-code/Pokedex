import { useState, useEffect } from 'react'
import PokemonList from './components/PokemonList.jsx'
import PokemonDetails from './components/PokemonDetails.jsx'
import StatusMessage from './components/StatusMessage.jsx'
import SearchBar from './components/SearchBar.jsx'
import TypeFilter from './components/TypeFilter.jsx'
import SortSelect from './components/SortSelect.jsx'
import FavoritesToggle from './components/FavoritesToggle.jsx'
import SkeletonList from './components/SkeletonList.jsx'
import EmptyDetails from './components/EmptyDetails.jsx'
import { useFavorites } from './hooks/useFavorites.js'
import { getIdFromUrl, filterPokemon, sortPokemon, formatName } from './utils/pokemon.js'
import './App.css'

const LIST_URL = 'https://pokeapi.co/api/v2/pokemon?limit=151'

function App() {
  const [pokemonList, setPokemonList] = useState([])
  // 'loading' | 'error' | 'success'
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  // Changing this number runs the fetch effect again ("Try again").
  const [reloadCount, setReloadCount] = useState(0)
  // The id of the Pokémon the user clicked. null = nothing selected yet.
  const [selectedId, setSelectedId] = useState(null)
  // What the user typed in the search box.
  const [searchText, setSearchText] = useState('')
  // 'number' | 'name'
  const [sortOrder, setSortOrder] = useState('number')
  // Favorites: the ids, saved in localStorage by our custom hook.
  const { favorites, toggleFavorite } = useFavorites()
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // Type filter.
  const [selectedType, setSelectedType] = useState('all')
  // Ids of each type we already loaded, e.g. { fire: [4, 5, 6, ...] }.
  // Kept as a cache: going back to a type we loaded before is instant.
  const [typeResults, setTypeResults] = useState({})
  // The type whose request failed (or null).
  const [typeErrorFor, setTypeErrorFor] = useState(null)
  const [typeReloadCount, setTypeReloadCount] = useState(0)

  // Load the list of 151 Pokémon.
  useEffect(() => {
    // Lets us cancel the request if the component goes away.
    const controller = new AbortController()

    async function loadPokemon() {
      try {
        const response = await fetch(LIST_URL, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`The server answered with status ${response.status}.`)
        }
        const data = await response.json()
        // Add an id to every item, so we can use it as the key.
        const list = data.results.map((item) => ({
          id: getIdFromUrl(item.url),
          name: item.name,
        }))
        setPokemonList(list)
        setStatus('success')
      } catch (error) {
        // A cancelled request is not a real error.
        if (error.name === 'AbortError') return
        setErrorMessage(error.message)
        setStatus('error')
      }
    }

    loadPokemon()

    return () => controller.abort()
  }, [reloadCount])

  // Load which Pokémon belong to the selected type (only if not loaded yet).
  useEffect(() => {
    if (selectedType === 'all' || typeResults[selectedType]) return

    const controller = new AbortController()

    async function loadType() {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`The server answered with status ${response.status}.`)
        }
        const data = await response.json()
        const ids = data.pokemon.map((entry) => getIdFromUrl(entry.pokemon.url))
        // Copy the old cache and add this type to it.
        setTypeResults((current) => ({ ...current, [selectedType]: ids }))
      } catch (error) {
        if (error.name === 'AbortError') return
        setTypeErrorFor(selectedType)
      }
    }

    loadType()

    return () => controller.abort()
  }, [selectedType, typeResults, typeReloadCount])

  // Pressing Escape closes the details panel.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') setSelectedId(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    // Remove the listener when App goes away, so it is not added twice.
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function handleRetry() {
    setStatus('loading')
    setReloadCount((count) => count + 1)
  }

  function handleTypeChange(type) {
    setSelectedType(type)
    // A new choice gets a new try, even if this type failed before.
    setTypeErrorFor(null)
  }

  function handleTypeRetry() {
    setTypeErrorFor(null)
    setTypeReloadCount((count) => count + 1)
  }

  // The type filter's status is calculated, not stored. This way it can never
  // get stuck on "loading": as soon as the result for the chosen type exists, it is ready.
  let typeStatus = 'success'
  if (selectedType !== 'all' && !typeResults[selectedType]) {
    typeStatus = typeErrorFor === selectedType ? 'error' : 'loading'
  }

  // Not stored in state: calculated from the other state on every render,
  // so it is always up to date.
  let visiblePokemon = filterPokemon(pokemonList, searchText)
  if (selectedType !== 'all' && typeResults[selectedType]) {
    const typeIds = typeResults[selectedType]
    visiblePokemon = visiblePokemon.filter((pokemon) => typeIds.includes(pokemon.id))
  }
  if (showFavoritesOnly) {
    visiblePokemon = visiblePokemon.filter((pokemon) => favorites.includes(pokemon.id))
  }
  visiblePokemon = sortPokemon(visiblePokemon, sortOrder)

  function renderList() {
    if (typeStatus === 'loading') {
      return <StatusMessage type="loading" message={`Loading ${formatName(selectedType)} Pokémon...`} />
    }
    if (typeStatus === 'error') {
      return (
        <StatusMessage
          type="error"
          message={`Could not load the ${formatName(selectedType)} type.`}
          onRetry={handleTypeRetry}
        />
      )
    }
    if (visiblePokemon.length === 0) {
      return (
        <p className="app__empty">
          {showFavoritesOnly && favorites.length === 0
            ? 'No favorites yet. Tap the heart on a Pokémon to add it.'
            : 'No Pokémon found.'}
        </p>
      )
    }
    return (
      <PokemonList
        pokemonList={visiblePokemon}
        selectedId={selectedId}
        favorites={favorites}
        onSelect={setSelectedId}
        onToggleFavorite={toggleFavorite}
      />
    )
  }

  const isListReady = typeStatus === 'success'
  const hasFilters = searchText !== '' || selectedType !== 'all' || showFavoritesOnly

  function clearFilters() {
    setSearchText('')
    handleTypeChange('all')
    setShowFavoritesOnly(false)
  }

  // Open a random Pokémon from the ones shown right now.
  function showRandomPokemon() {
    const index = Math.floor(Math.random() * visiblePokemon.length)
    setSelectedId(visiblePokemon[index].id)
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-inner">
          <div className="app__brand">
            <span className="app__logo" aria-hidden="true"></span>
            <div>
              <h1 className="app__title">Pokédex</h1>
              <p className="app__subtitle">Generation I · 151 Pokémon from PokéAPI</p>
            </div>
          </div>
          {status === 'success' && <SearchBar value={searchText} onChange={setSearchText} />}
        </div>
      </header>

      {status === 'loading' && (
        <main className="app__main app__main--single">
          <StatusMessage type="loading" message="Loading Pokémon..." />
          <SkeletonList />
        </main>
      )}

      {status === 'error' && (
        <main className="app__main app__main--single">
          <StatusMessage
            type="error"
            message={`Could not load the Pokémon. ${errorMessage}`}
            onRetry={handleRetry}
          />
        </main>
      )}

      {status === 'success' && (
        <main className="app__main">
          <div className="app__list">
            <div className="toolbar">
              <TypeFilter selectedType={selectedType} onChange={handleTypeChange} />
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
                  <FavoritesToggle
                    isOn={showFavoritesOnly}
                    count={favorites.length}
                    onChange={setShowFavoritesOnly}
                  />
                  <SortSelect value={sortOrder} onChange={setSortOrder} />
                </div>
              </div>
            </div>
            {renderList()}
          </div>

          {selectedId ? (
            <PokemonDetails
              key={selectedId}
              pokemonId={selectedId}
              isFavorite={favorites.includes(selectedId)}
              onToggleFavorite={toggleFavorite}
              onSelect={setSelectedId}
              onClose={() => setSelectedId(null)}
            />
          ) : (
            <EmptyDetails favoriteCount={favorites.length} />
          )}
        </main>
      )}

      <footer className="app__footer">
        Data and images from <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokéAPI</a>.
        Built with React + Vite.
      </footer>
    </div>
  )
}

export default App
