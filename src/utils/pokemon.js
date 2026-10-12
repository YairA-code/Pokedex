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

// The types used by the first 151 Pokémon (in today's PokéAPI data).
// This is a fixed list for the filter buttons; which Pokémon belong to each
// type always comes from the API (/type/{name}).
export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground',
  'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'steel', 'fairy',
]

// Returns a new sorted list. sortOrder: 'number' | 'name'.
// We copy the list first, because sort() changes the array it is called on.
export function sortPokemon(pokemonList, sortOrder) {
  const copy = [...pokemonList]
  if (sortOrder === 'name') {
    copy.sort((a, b) => a.name.localeCompare(b.name))
  } else {
    copy.sort((a, b) => a.id - b.id)
  }
  return copy
}

// The species API has descriptions in many languages and game versions.
// We take the newest English one and clean the line breaks the games use.
export function getEnglishDescription(flavorTextEntries) {
  const english = flavorTextEntries.filter((entry) => entry.language.name === 'en')
  if (english.length === 0) return ''
  const newest = english[english.length - 1]
  return newest.flavor_text
    .replace(/[\n\f\r]+/g, ' ')
    .replace(/POKéMON/g, 'Pokémon')
    .trim()
}

// "Mouse Pokémon" — the English category of the species.
export function getEnglishGenus(genera) {
  const english = genera.find((item) => item.language.name === 'en')
  return english ? english.genus : ''
}

// The first and last Pokémon in our Pokédex.
export const FIRST_ID = 1
export const LAST_ID = 151

// The evolution chain from the API is a tree: each step has "evolves_to" with the next steps.
// We turn it into stages (a list per step), keeping only Pokémon up to #151:
// Bulbasaur → [[bulbasaur], [ivysaur], [venusaur]]
// Eevee     → [[eevee], [vaporeon, jolteon, flareon]]
export function getEvolutionStages(chain) {
  const stages = []

  // A function that calls itself for every next step (recursion).
  function visit(node, depth) {
    const id = getIdFromUrl(node.species.url)
    if (id <= LAST_ID) {
      if (!stages[depth]) stages[depth] = []
      stages[depth].push({ id, name: node.species.name })
    }
    node.evolves_to.forEach((next) => visit(next, depth + 1))
  }

  visit(chain, 0)
  // Remove empty stages (for example a baby Pokémon from a later generation).
  return stages.filter((stage) => stage !== undefined)
}
