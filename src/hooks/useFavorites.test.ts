// @vitest-environment jsdom
import { afterEach, describe, it, expect } from 'vitest'
import { act, cleanup, renderHook } from '@testing-library/react'
import { useFavorites } from './useFavorites.ts'

const STORAGE_KEY = 'pokedex-favorites'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

describe('useFavorites', () => {
  it('adds and removes a favorite, and saves it', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => result.current.toggleFavorite(25))
    expect(result.current.favorites).toEqual([25])
    expect(localStorage.getItem(STORAGE_KEY)).toBe('[25]')

    act(() => result.current.toggleFavorite(25))
    expect(result.current.favorites).toEqual([])
  })

  it('reads what was saved before', () => {
    localStorage.setItem(STORAGE_KEY, '[1,4]')
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([1, 4])
  })

  it('starts empty when the saved data is broken', () => {
    for (const saved of ['not json', '{"a":1}']) {
      localStorage.setItem(STORAGE_KEY, saved)
      const { result } = renderHook(() => useFavorites())
      expect(result.current.favorites).toEqual([])
    }
  })
})
