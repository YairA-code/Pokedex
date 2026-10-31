// The address of PokéAPI. Free, public, no key.
export const API_BASE_URL = 'https://pokeapi.co/api/v2'

// Loads one URL and returns the JSON. Throws if the server answers with an error.
// <T> is the type of the answer: the caller says what it expects to get.
export async function fetchJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`The server answered with status ${response.status}.`)
  }
  return (await response.json()) as T
}

// In a catch block the error has no known type, so we check it before reading it.
export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.'
}
