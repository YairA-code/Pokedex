import { describe, it, expect } from 'vitest'
import { getIdFromUrl, formatNumber, formatName, filterPokemon } from './pokemon.js'

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
