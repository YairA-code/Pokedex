import { afterEach, describe, it, expect, vi } from 'vitest'
import { fetchJson, getErrorMessage, isAbortError } from './api.ts'

afterEach(() => vi.unstubAllGlobals())

describe('fetchJson', () => {
  const signal = new AbortController().signal

  it('returns the JSON of a good answer', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"name":"pikachu"}')))
    await expect(fetchJson<{ name: string }>('/x', signal)).resolves.toEqual({ name: 'pikachu' })
  })

  it('throws when the server answers with an error status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 500 })))
    await expect(fetchJson('/x', signal)).rejects.toThrow('status 500')
  })
})

describe('error helpers', () => {
  it('recognizes a cancelled request', () => {
    const aborted = new Error('cancelled')
    aborted.name = 'AbortError'
    expect(isAbortError(aborted)).toBe(true)
    expect(isAbortError(new Error('other'))).toBe(false)
  })

  it('reads a message from anything that was thrown', () => {
    expect(getErrorMessage(new Error('Oops'))).toBe('Oops')
    expect(getErrorMessage('text')).toBe('Something went wrong.')
  })
})
