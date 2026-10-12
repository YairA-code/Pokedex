import { useState, useEffect } from 'react'
import PokemonList from './components/PokemonList.jsx'
import PokemonDetails from './components/PokemonDetails.jsx'
import StatusMessage from './components/StatusMessage.jsx'
import SearchBar from './components/SearchBar.jsx'
import TypeFilter from './components/TypeFilter.jsx'
import SortSelect from './components/SortSelect.jsx'
import FavoritesToggle from './components/FavoritesToggle.jsx'
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

  // Type filter: the chosen type, and the ids of the Pokémon of that type.
  const [selectedType, setSelectedType] = useState('all')
  const [typeIds, setTypeIds] = useState(null)
  // 'loading' | 'error' | 'success'
  const [typeStatus, setTypeStatus] = useState('success')
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

  // Load which Pokémon belong to the selected type.
  useEffect(() => {
    if (selectedType === 'all') return

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
        // A Set makes "is this id in the type?" a quick check.
        setTypeIds(new Set(data.pokemon.map((entry) => getIdFromUrl(entry.pokemon.url))))
        setTypeStatus('success')
      } catch (error) {
        if (error.name === 'AbortError') return
        setTypeStatus('error')
      }
    }

    loadType()

    return () => controller.abort()
  }, [selectedType, typeReloadCount])

  function handleRetry() {
    setStatus('loading')
    setReloadCount((count) => count + 1)
  }

  function handleTypeChange(type) {
    setSelectedType(type)
    setTypeIds(null)
    setTypeStatus(type === 'all' ? 'success' : 'loading')
  }

  function handleTypeRetry() {
    setTypeStatus('loading')
    setTypeReloadCount((count) => count + 1)
  }

  // Not stored in state: calculated from the other state on every render,
  // so it is always up to date.
  let visiblePokemon = filterPokemon(pokemonList, searchText)
  if (selectedType !== 'all' && typeIds) {
    visiblePokemon = visiblePokemon.filter((pokemon) => typeIds.has(pokemon.id))
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

  return (
    <div className="app">
      <header className="app__header">
        <h1>Pokédex</h1>
      </header>

      {status === 'loading' && <StatusMessage type="loading" message="Loading Pokémon..." />}

      {status === 'error' && (
        <StatusMessage
          type="error"
          message={`Could not load the Pokémon. ${errorMessage}`}
          onRetry={handleRetry}
        />
      )}

      {status === 'success' && (
        <main className="app__main">
          <div className="app__list">
            <SearchBar
              value={searchText}
              onChange={setSearchText}
              resultCount={typeStatus === 'success' ? visiblePokemon.length : 0}
            />
            <SortSelect value={sortOrder} onChange={setSortOrder} />
            <FavoritesToggle
              isOn={showFavoritesOnly}
              count={favorites.length}
              onChange={setShowFavoritesOnly}
            />
            <TypeFilter selectedType={selectedType} onChange={handleTypeChange} />
            {renderList()}
          </div>
          {selectedId ? (
            <PokemonDetails key={selectedId} pokemonId={selectedId} />
          ) : (
            <section className="pokemon-details pokemon-details--empty">
              <p>Choose a Pokémon from the list to see its details.</p>
            </section>
          )}
        </main>
      )}
    </div>
  )
}

export default App
