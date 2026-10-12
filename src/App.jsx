import PokemonList from './components/PokemonList.jsx'
import samplePokemon from './data/samplePokemon.json'
import { getIdFromUrl } from './utils/pokemon.js'
import './App.css'

// Add an id to every item, so we can use it as the key.
const pokemonList = samplePokemon.map((item) => ({
  id: getIdFromUrl(item.url),
  name: item.name,
}))

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1>Pokédex</h1>
      </header>
      <main className="app__main">
        <PokemonList pokemonList={pokemonList} />
      </main>
    </div>
  )
}

export default App
