// Types for the data in this app.
// The "Api..." types describe the JSON that PokéAPI sends, only the fields we read.
// The other types are the simple shapes our components work with.

// --- What the API sends ---

export interface NamedResource {
  name: string
  url: string
}

export interface ApiPokemonList {
  results: NamedResource[]
}

export interface ApiType {
  pokemon: { pokemon: NamedResource }[]
}

export interface ApiPokemon {
  id: number
  name: string
  height: number
  weight: number
  types: { type: NamedResource }[]
  abilities: { ability: NamedResource; is_hidden: boolean }[]
  stats: { base_stat: number; stat: NamedResource }[]
  sprites: {
    other?: {
      'official-artwork'?: {
        front_default: string | null
        front_shiny: string | null
      }
    }
  }
}

export interface ApiFlavorText {
  flavor_text: string
  language: Pick<NamedResource, 'name'>
}

export interface ApiGenus {
  genus: string
  language: Pick<NamedResource, 'name'>
}

export interface ApiSpecies {
  flavor_text_entries: ApiFlavorText[]
  genera: ApiGenus[]
  habitat: NamedResource | null
  is_legendary: boolean
  is_mythical: boolean
  evolution_chain: { url: string }
}

// One step in the evolution tree. Each step holds the steps that come after it.
export interface ApiChainLink {
  species: Pick<NamedResource, 'name' | 'url'>
  evolves_to: ApiChainLink[]
}

export interface ApiEvolutionChain {
  chain: ApiChainLink
}

// --- What our components use ---

export interface PokemonSummary {
  id: number
  name: string
}

export interface Ability {
  name: string
  isHidden: boolean
}

export interface Stat {
  name: string
  value: number
}

export interface PokemonDetail {
  id: number
  name: string
  image: string
  shinyImage: string | null
  types: string[]
  heightMeters: number
  weightKg: number
  abilities: Ability[]
  stats: Stat[]
  genus: string
  description: string
  habitat: string | null
  isLegendary: boolean
  isMythical: boolean
  evolutionStages: PokemonSummary[][]
}

export type LoadStatus = 'loading' | 'error' | 'success'
export type SortOrder = 'number' | 'name'
export type Theme = 'light' | 'dark'
