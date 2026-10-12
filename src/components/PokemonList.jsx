import PokemonCard from './PokemonCard.jsx'

// The list of Pokémon. Each item gets a unique key: its id.
function PokemonList({ pokemonList, selectedId, favorites, onSelect, onToggleFavorite }) {
  return (
    <ul className="pokemon-list">
      {pokemonList.map((pokemon) => (
        <li key={pokemon.id}>
          <PokemonCard
            pokemon={pokemon}
            isSelected={pokemon.id === selectedId}
            isFavorite={favorites.includes(pokemon.id)}
            onSelect={onSelect}
            onToggleFavorite={onToggleFavorite}
          />
        </li>
      ))}
    </ul>
  )
}

export default PokemonList
