import { useState } from 'react'
import PokemonList from './components/PokemonList.jsx'
import PokemonDetails from './components/PokemonDetails.jsx'
import samplePokemon from './data/samplePokemon.json'
import { getIdFromUrl } from './utils/pokemon.js'
import './App.css'

// Add an id to every item, so we can use it as the key.
const pokemonList = samplePokemon.map((item) => ({
  id: getIdFromUrl(item.url),
  name: item.name,
}))

function App() {
  // The id of the Pokémon the user clicked. null = nothing selected yet.
  const [selectedId, setSelectedId] = useState(null)

  const selectedPokemon = pokemonList.find((pokemon) => pokemon.id === selectedId)

  return (
    <div className="app">
      <header className="app__header">
        <h1>Pokédex</h1>
      </header>
      <main className="app__main">
        <PokemonList
          pokemonList={pokemonList}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <PokemonDetails pokemon={selectedPokemon} />
      </main>
    </div>
  )
}

export default App
