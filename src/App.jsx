import { useState, useEffect } from 'react'
import PokemonList from './components/PokemonList.jsx'
import PokemonDetails from './components/PokemonDetails.jsx'
import StatusMessage from './components/StatusMessage.jsx'
import { getIdFromUrl } from './utils/pokemon.js'
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

  function handleRetry() {
    setStatus('loading')
    setReloadCount((count) => count + 1)
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
          <PokemonList
            pokemonList={pokemonList}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
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
