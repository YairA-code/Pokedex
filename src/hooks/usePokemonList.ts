import { useState, useEffect } from 'react'
import { API_BASE_URL, fetchJson, getErrorMessage, isAbortError } from '../utils/api.ts'
import { getIdFromUrl } from '../utils/pokemon.ts'
import type { ApiPokemonList, LoadStatus, PokemonListState, PokemonSummary } from '../types/pokemon.ts'

const LIST_URL = `${API_BASE_URL}/pokemon?limit=151`

// Loads the list of 151 Pokémon once, and again when retry() is called.
export function usePokemonList(): PokemonListState {
  const [pokemonList, setPokemonList] = useState<PokemonSummary[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  // Changing this number runs the fetch effect again ("Try again").
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    // Lets us cancel the request if the component goes away.
    const controller = new AbortController()

    async function loadPokemon() {
      try {
        const data = await fetchJson<ApiPokemonList>(LIST_URL, controller.signal)
        // Add an id to every item, so we can use it as the key.
        const list = data.results.map((item) => ({
          id: getIdFromUrl(item.url),
          name: item.name,
        }))
        setPokemonList(list)
        setStatus('success')
      } catch (error) {
        // A cancelled request is not a real error.
        if (isAbortError(error)) return
        setErrorMessage(getErrorMessage(error))
        setStatus('error')
      }
    }

    loadPokemon()

    return () => controller.abort()
  }, [reloadCount])

  function retry() {
    setStatus('loading')
    setReloadCount((count) => count + 1)
  }

  return { pokemonList, status, errorMessage, retry }
}
