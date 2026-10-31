import { describe, it, expect } from 'vitest'
import { getIdFromUrl, formatNumber, formatName, filterPokemon, sortPokemon,
  getEnglishDescription, getEnglishGenus, getEvolutionStages, parsePokemonId, getVisiblePokemon,
  getFavoritePokemon, compareStats, toPokemonDetail } from './pokemon.ts'
import type { ApiChainLink, ApiEvolutionChain, ApiPokemon, ApiSpecies, ListFilters } from '../types/pokemon.ts'

describe('helpers', () => {
  it('reads the id from a PokéAPI url', () => {
    expect(getIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
  })

  it('formats numbers and names', () => {
    expect(formatNumber(4)).toBe('#004')
    expect(formatName('mr-mime')).toBe('Mr Mime')
  })
})

describe('filterPokemon', () => {
  const list = [
    { id: 4, name: 'charmander' },
    { id: 5, name: 'charmeleon' },
    { id: 25, name: 'pikachu' },
    { id: 122, name: 'mr-mime' },
    { id: 125, name: 'electabuzz' },
  ]

  it('returns the whole list when the search is empty', () => {
    expect(filterPokemon(list, '  ')).toHaveLength(5)
  })

  it('finds by part of the name, ignoring case', () => {
    expect(filterPokemon(list, 'CHAR').map((p) => p.name)).toEqual(['charmander', 'charmeleon'])
    expect(filterPokemon(list, 'mr mime').map((p) => p.id)).toEqual([122])
  })

  it('finds by exact number, with or without #', () => {
    expect(filterPokemon(list, '25').map((p) => p.name)).toEqual(['pikachu'])
    expect(filterPokemon(list, '#004').map((p) => p.name)).toEqual(['charmander'])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterPokemon(list, 'xyz')).toEqual([])
  })
})

describe('sortPokemon', () => {
  const list = [
    { id: 25, name: 'pikachu' },
    { id: 4, name: 'charmander' },
    { id: 1, name: 'bulbasaur' },
  ]

  it('sorts by number', () => {
    expect(sortPokemon(list, 'number').map((p) => p.id)).toEqual([1, 4, 25])
  })

  it('sorts by name and does not change the original list', () => {
    expect(sortPokemon(list, 'name').map((p) => p.name)).toEqual(['bulbasaur', 'charmander', 'pikachu'])
    expect(list[0].id).toBe(25)
  })
})

describe('species helpers', () => {
  const en = { name: 'en' }
  const ja = { name: 'ja' }

  it('takes the newest English description and cleans line breaks', () => {
    const entries = [
      { flavor_text: 'Old\nPOKéMON\ftext.', language: en },
      { flavor_text: '日本語', language: ja },
      { flavor_text: 'New\nPOKéMON\ftext.', language: en },
    ]
    expect(getEnglishDescription(entries)).toBe('New Pokémon text.')
    expect(getEnglishDescription([])).toBe('')
  })

  it('finds the English genus', () => {
    expect(getEnglishGenus([{ genus: 'ねずみ', language: ja }, { genus: 'Mouse Pokémon', language: en }])).toBe('Mouse Pokémon')
  })
})

describe('getEvolutionStages', () => {
  const node = (name: string, id: number, next: ApiChainLink[] = []): ApiChainLink => ({
    species: { name, url: `https://pokeapi.co/api/v2/pokemon-species/${id}/` },
    evolves_to: next,
  })

  it('turns a straight chain into stages', () => {
    const chain = node('bulbasaur', 1, [node('ivysaur', 2, [node('venusaur', 3)])])
    expect(getEvolutionStages(chain).map((stage) => stage.map((p) => p.id))).toEqual([[1], [2], [3]])
  })

  it('keeps branches together and drops Pokémon after #151', () => {
    const chain = node('eevee', 133, [node('vaporeon', 134), node('jolteon', 135), node('espeon', 196)])
    expect(getEvolutionStages(chain).map((stage) => stage.map((p) => p.name))).toEqual([['eevee'], ['vaporeon', 'jolteon']])
  })

  it('drops a baby stage from a later generation', () => {
    const chain = node('pichu', 172, [node('pikachu', 25, [node('raichu', 26)])])
    expect(getEvolutionStages(chain).map((stage) => stage.map((p) => p.id))).toEqual([[25], [26]])
  })
})

describe('parsePokemonId', () => {
  it('accepts whole numbers from 1 to 151', () => {
    expect(parsePokemonId('1')).toBe(1)
    expect(parsePokemonId('151')).toBe(151)
  })

  it('returns null for anything else', () => {
    for (const value of ['0', '152', '-1', '2.5', 'abc', '25abc', '', null, undefined]) {
      expect(parsePokemonId(value)).toBeNull()
    }
  })
})

describe('getVisiblePokemon', () => {
  const list = [
    { id: 25, name: 'pikachu' },
    { id: 6, name: 'charizard' },
    { id: 4, name: 'charmander' },
    { id: 7, name: 'squirtle' },
  ]
  const noFilters: ListFilters = { searchText: '', type: 'all', sort: 'number' }

  it('shows everything, sorted, when nothing is chosen', () => {
    expect(getVisiblePokemon(list, noFilters, null).map((p) => p.id)).toEqual([4, 6, 7, 25])
  })

  it('keeps only the ids of the chosen type', () => {
    expect(getVisiblePokemon(list, noFilters, [4, 6, 999]).map((p) => p.id)).toEqual([4, 6])
  })

  it('combines search, type and sort', () => {
    const filters: ListFilters = { searchText: 'char', type: 'fire', sort: 'name' }
    expect(getVisiblePokemon(list, filters, [4, 6, 25]).map((p) => p.name)).toEqual(['charizard', 'charmander'])
  })
})

describe('getFavoritePokemon', () => {
  it('returns the saved Pokémon in list order and ignores ids that are not in the list', () => {
    const list = [{ id: 1, name: 'bulbasaur' }, { id: 4, name: 'charmander' }, { id: 7, name: 'squirtle' }]
    expect(getFavoritePokemon(list, [7, 1, 999]).map((p) => p.id)).toEqual([1, 7])
  })
})

describe('compareStats', () => {
  it('marks the higher value and ties, and adds a total row', () => {
    const rows = compareStats(
      [{ name: 'hp', value: 45 }, { name: 'speed', value: 90 }, { name: 'attack', value: 50 }],
      [{ name: 'hp', value: 35 }, { name: 'speed', value: 100 }, { name: 'attack', value: 50 }],
    )
    expect(rows.map((row) => [row.name, row.winner])).toEqual([
      ['hp', 'a'], ['speed', 'b'], ['attack', 'tie'], ['total', 'tie'],
    ])
    expect(rows[3]).toMatchObject({ valueA: 185, valueB: 185 })
  })

  it('matches stats by name even when the order is different', () => {
    const rows = compareStats(
      [{ name: 'hp', value: 10 }, { name: 'speed', value: 20 }],
      [{ name: 'speed', value: 5 }, { name: 'hp', value: 50 }],
    )
    expect(rows[0]).toMatchObject({ name: 'hp', valueB: 50, winner: 'b' })
  })
})

describe('toPokemonDetail', () => {
  const data: ApiPokemon = {
    id: 25,
    name: 'pikachu',
    height: 4,
    weight: 60,
    types: [{ type: { name: 'electric', url: '' } }],
    abilities: [{ ability: { name: 'static', url: '' }, is_hidden: false }],
    stats: [{ base_stat: 35, stat: { name: 'hp', url: '' } }],
    sprites: { other: { 'official-artwork': { front_default: 'normal.png', front_shiny: null } } },
  }
  const species: ApiSpecies = {
    flavor_text_entries: [{ flavor_text: 'Mouse\ntext.', language: { name: 'en' } }],
    genera: [{ genus: 'Mouse Pokémon', language: { name: 'en' } }],
    habitat: null,
    is_legendary: false,
    is_mythical: false,
    evolution_chain: { url: '' },
  }
  const evolution: ApiEvolutionChain = {
    chain: { species: { name: 'pikachu', url: '/pokemon-species/25/' }, evolves_to: [] },
  }

  it('converts the units and flattens the API answers', () => {
    expect(toPokemonDetail(data, species, evolution)).toEqual({
      id: 25,
      name: 'pikachu',
      image: 'normal.png',
      shinyImage: null,
      types: ['electric'],
      heightMeters: 0.4,
      weightKg: 6,
      abilities: [{ name: 'static', isHidden: false }],
      stats: [{ name: 'hp', value: 35 }],
      genus: 'Mouse Pokémon',
      description: 'Mouse text.',
      habitat: null,
      isLegendary: false,
      isMythical: false,
      evolutionStages: [[{ id: 25, name: 'pikachu' }]],
    })
  })

  it('builds the artwork url when the API has no image', () => {
    const noArtwork = { ...data, sprites: {} }
    expect(toPokemonDetail(noArtwork, species, evolution).image).toContain('official-artwork/25.png')
  })
})
