import { useState, useEffect } from 'react'
import { API_BASE_URL, fetchJson, isAbortError } from '../utils/api.ts'
import { toPokemonDetail } from '../utils/pokemon.ts'
import type {
  ApiEvolutionChain,
  ApiPokemon,
  ApiSpecies,
  LoadStatus,
  PokemonDetail,
} from '../types/pokemon.ts'

// Loads everything about one Pokémon. id can be null: then nothing is loaded.
export function usePokemonDetail(id: number | null) {
  const [loaded, setLoaded] = useState<PokemonDetail | null>(null)
  // The id whose request failed (or null).
  const [failedId, setFailedId] = useState<number | null>(null)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    if (id === null) return

    // Cancels the old request when the id changes, so a slow answer
    // for an old Pokémon can never replace the new one.
    const controller = new AbortController()

    async function loadDetails() {
      try {
        // Two requests at the same time: the Pokémon (types, stats...) and its
        // species (description, category). Promise.all waits for both.
        const [data, species] = await Promise.all([
          fetchJson<ApiPokemon>(`${API_BASE_URL}/pokemon/${id}`, controller.signal),
          fetchJson<ApiSpecies>(`${API_BASE_URL}/pokemon-species/${id}`, controller.signal),
        ])
        // The species tells us where its evolution chain is, so this request comes after.
        const evolution = await fetchJson<ApiEvolutionChain>(species.evolution_chain.url, controller.signal)
        setLoaded(toPokemonDetail(data, species, evolution))
      } catch (error) {
        // A cancelled request is not a real error.
        if (isAbortError(error)) return
        setFailedId(id)
      }
    }

    loadDetails()

    return () => {
      controller.abort()
      // A new try starts clean, even if this one failed.
      setFailedId(null)
    }
  }, [id, reloadCount])

  // Calculated, not stored: what we show always matches the id we were asked for.
  const pokemon = loaded !== null && loaded.id === id ? loaded : null
  let status: LoadStatus = 'loading'
  if (pokemon) status = 'success'
  else if (failedId === id) status = 'error'

  function retry() {
    setReloadCount((count) => count + 1)
  }

  return { pokemon, status, retry }
}
