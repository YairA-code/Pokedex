// Small helper functions for Pokémon data.

// The list API gives only a name and a url like ".../pokemon/25/".
// The id is the number at the end of that url.
export function getIdFromUrl(url) {
  const parts = url.split('/').filter((part) => part !== '')
  return Number(parts[parts.length - 1])
}

// Official artwork image, from the PokéAPI sprites repository.
export function getArtworkUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

// 25 -> "#025"
export function formatNumber(id) {
  return '#' + String(id).padStart(3, '0')
}

// "mr-mime" -> "Mr Mime"
export function formatName(name) {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Keep only the Pokémon that match the search text.
// A number ("25" or "#025") matches the Pokémon with that number.
// Any other text matches names that contain it ("char" -> Charmander...).
export function filterPokemon(pokemonList, searchText) {
  const text = searchText.trim().toLowerCase().replace('#', '')
  if (text === '') return pokemonList

  if (/^\d+$/.test(text)) {
    return pokemonList.filter((pokemon) => pokemon.id === Number(text))
  }

  return pokemonList.filter((pokemon) =>
    pokemon.name.replaceAll('-', ' ').includes(text.replaceAll('-', ' ')),
  )
}
