import { useState, useEffect } from 'react'
import { API_BASE_URL, fetchJson, isAbortError } from '../utils/api.ts'
import { getIdFromUrl } from '../utils/pokemon.ts'
import type { ApiType, LoadStatus } from '../types/pokemon.ts'

// Loads which Pokémon belong to a type. The type 'all' needs no request.
export function useTypeIds(type: string) {
  // Ids of each type we already loaded, e.g. { fire: [4, 5, 6, ...] }.
  // Kept as a cache: going back to a type we loaded before is instant.
  const [typeResults, setTypeResults] = useState<Record<string, number[]>>({})
  // The type whose request failed (or null).
  const [failedType, setFailedType] = useState<string | null>(null)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    if (type === 'all' || typeResults[type]) return

    const controller = new AbortController()

    async function loadType() {
      try {
        const data = await fetchJson<ApiType>(`${API_BASE_URL}/type/${type}`, controller.signal)
        const ids = data.pokemon.map((entry) => getIdFromUrl(entry.pokemon.url))
        // Copy the old cache and add this type to it.
        setTypeResults((current) => ({ ...current, [type]: ids }))
      } catch (error) {
        if (isAbortError(error)) return
        setFailedType(type)
      }
    }

    loadType()

    return () => {
      controller.abort()
      // A new try starts clean, even if this one failed.
      setFailedType(null)
    }
  }, [type, typeResults, reloadCount])

  const typeIds = typeResults[type] ?? null

  // The status is calculated, not stored. This way it can never get stuck on
  // "loading": as soon as the result for the chosen type exists, it is ready.
  let typeStatus: LoadStatus = 'success'
  if (type !== 'all' && !typeIds) {
    typeStatus = failedType === type ? 'error' : 'loading'
  }

  function retryType() {
    setReloadCount((count) => count + 1)
  }

  return { typeIds, typeStatus, retryType }
}
