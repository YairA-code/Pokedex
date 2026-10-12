import { describe, it, expect } from 'vitest'
import { getIdFromUrl, formatNumber, formatName, filterPokemon, sortPokemon,
  getEnglishDescription, getEnglishGenus, getEvolutionStages } from './pokemon.js'

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
  const node = (name, id, next = []) => ({
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
