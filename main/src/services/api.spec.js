import { describe, it, expect, vi, beforeEach } from 'vitest'
import { clearAuthState, getResponse, postResponseWithoutAuth, deleteResponse } from './api.js'

describe('api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearAuthState()
  })

  describe('clearAuthState', () => {
    it('clears internal refresh state', () => {
      expect(() => clearAuthState()).not.toThrow()
    })
  })

  describe('getResponse', () => {
    it('throws when no auth in localStorage', async () => {
      localStorage.removeItem('auth')

      await expect(getResponse('/test')).rejects.toThrow('User is unknown')
    })

    it('returns data on successful response', async () => {
      const mockData = { id: 1 }
      localStorage.setItem('auth', JSON.stringify({ token: 'test-token' }))
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
        statusText: 'OK',
      })

      const result = await getResponse('/test')

      expect(result).toEqual(mockData)
    })

    it('throws with statusCode on error response', async () => {
      localStorage.setItem('auth', JSON.stringify({ token: 'test-token' }))
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(getResponse('/test')).rejects.toMatchObject({
        message: 'Not Found',
        statusCode: 404,
      })
    })
  })

  describe('postResponseWithoutAuth', () => {
    it('returns data on successful POST', async () => {
      const mockData = { success: true }
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
        statusText: 'OK',
      })

      const result = await postResponseWithoutAuth('/auth/login', {
        login: 'user',
        password: 'pass',
      })

      expect(result).toEqual(mockData)
      expect(fetch).toHaveBeenCalledWith(
        '/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ login: 'user', password: 'pass' }),
        }),
      )
    })

    it('throws with statusCode on error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      })

      await expect(postResponseWithoutAuth('/auth/login', {})).rejects.toMatchObject({
        message: 'Unauthorized',
        statusCode: 401,
      })
    })
  })

  describe('deleteResponse', () => {
    it('returns parsed JSON on success with response body', async () => {
      const mockData = { deleted: true }
      localStorage.setItem('auth', JSON.stringify({ token: 'test-token' }))
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(mockData)),
        statusText: 'OK',
      })

      const result = await deleteResponse('/v1/test/1')

      expect(result).toEqual(mockData)
    })

    it('returns empty object when response has no body', async () => {
      localStorage.setItem('auth', JSON.stringify({ token: 'test-token' }))
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        text: () => Promise.resolve(''),
        statusText: 'No Content',
      })

      const result = await deleteResponse('/v1/test/1')

      expect(result).toEqual({})
    })
  })
})
