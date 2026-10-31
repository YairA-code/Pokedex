// @vitest-environment jsdom
import { afterEach, describe, it, expect, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import DetailsPage from './DetailsPage.tsx'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

const pokemonAnswer = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  types: [{ type: { name: 'electric', url: '' } }],
  abilities: [],
  stats: [{ base_stat: 35, stat: { name: 'hp', url: '' } }],
  sprites: {},
}
const speciesAnswer = {
  flavor_text_entries: [],
  genera: [],
  habitat: null,
  is_legendary: false,
  is_mythical: false,
  evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/10/' },
}
const evolutionAnswer = {
  chain: { species: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon-species/25/' }, evolves_to: [] },
}

// A stand-in for the real fetch, so the tests do not need the internet.
async function fakeFetch(url: string) {
  let answer: object = evolutionAnswer
  if (url.includes('/pokemon/')) answer = pokemonAnswer
  if (url.includes('/pokemon-species/')) answer = speciesAnswer
  return new Response(JSON.stringify(answer))
}

function renderAt(address: string) {
  render(
    <MemoryRouter initialEntries={[address]}>
      <Routes>
        <Route path="/items/:id" element={<DetailsPage favorites={[]} onToggleFavorite={() => {}} />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('DetailsPage', () => {
  it('reads the id from the address, shows loading and then the Pokémon', async () => {
    const fetchMock = vi.fn(fakeFetch)
    vi.stubGlobal('fetch', fetchMock)
    renderAt('/items/25')

    expect(screen.getByText('Loading details...')).toBeTruthy()
    expect((await screen.findByRole('heading', { level: 1 })).textContent).toBe('Pikachu')
    expect(fetchMock.mock.calls[0][0]).toContain('/pokemon/25')
  })

  it('shows an error, and "Try again" loads again', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    renderAt('/items/25')
    const retryButton = await screen.findByRole('button', { name: 'Try again' })

    vi.stubGlobal('fetch', vi.fn(fakeFetch))
    fireEvent.click(retryButton)
    expect((await screen.findByRole('heading', { level: 1 })).textContent).toBe('Pikachu')
  })

  it('shows the not found page, with no request, for an id that is not in the Pokédex', () => {
    const fetchMock = vi.fn(fakeFetch)
    vi.stubGlobal('fetch', fetchMock)
    renderAt('/items/999')

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeTruthy()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
