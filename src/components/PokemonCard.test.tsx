// @vitest-environment jsdom
import { afterEach, describe, it, expect, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import PokemonCard from './PokemonCard.tsx'

afterEach(cleanup)

describe('PokemonCard', () => {
  const pikachu = { id: 25, name: 'pikachu' }

  it('links to the address of the Pokémon', () => {
    render(
      <MemoryRouter>
        <PokemonCard pokemon={pikachu} isFavorite={false} onToggleFavorite={() => {}} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link').getAttribute('href')).toBe('/items/25')
    expect(screen.getByRole('link').textContent).toContain('Pikachu')
  })

  it('reports the id when the heart is clicked', () => {
    const onToggleFavorite = vi.fn()
    render(
      <MemoryRouter>
        <PokemonCard pokemon={pikachu} isFavorite={false} onToggleFavorite={onToggleFavorite} />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add Pikachu to favorites' }))
    expect(onToggleFavorite).toHaveBeenCalledWith(25)
  })
})
