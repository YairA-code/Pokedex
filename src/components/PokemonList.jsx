import PokemonCard from './PokemonCard.jsx'

// The list of Pokémon. Each item gets a unique key: its id.
function PokemonList({ pokemonList }) {
  return (
    <ul className="pokemon-list">
      {pokemonList.map((pokemon) => (
        <li key={pokemon.id}>
          <PokemonCard pokemon={pokemon} />
        </li>
      ))}
    </ul>
  )
}

export default PokemonList
