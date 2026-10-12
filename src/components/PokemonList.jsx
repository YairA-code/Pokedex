import PokemonCard from './PokemonCard.jsx'

// The list of Pokémon. Each item gets a unique key: its id.
function PokemonList({ pokemonList, selectedId, onSelect }) {
  return (
    <ul className="pokemon-list">
      {pokemonList.map((pokemon) => (
        <li key={pokemon.id}>
          <PokemonCard
            pokemon={pokemon}
            isSelected={pokemon.id === selectedId}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  )
}

export default PokemonList
