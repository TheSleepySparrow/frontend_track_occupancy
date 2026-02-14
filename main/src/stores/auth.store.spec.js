import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuth } from './auth.store.js'

vi.mock('src/services/api', () => ({
  postResponseWithoutAuth: vi.fn(),
  clearAuthState: vi.fn(),
}))

import { postResponseWithoutAuth, clearAuthState } from 'src/services/api'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('getters', () => {
    it('isAuthenticated returns true when loaded', () => {
      const store = useAuth()
      store.loaded = true
      expect(store.isAuthenticated).toBe(true)
    })

    it('isAuthenticated returns false when not loaded', () => {
      const store = useAuth()
      store.loaded = false
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('login', () => {
    it('sets token and loaded on success', async () => {
      const mockData = {
        access_token: 'token-123',
        refresh_token: 'refresh-456',
        role: 'admin',
        token_type: 'Bearer',
      }
      postResponseWithoutAuth.mockResolvedValue(mockData)

      const store = useAuth()
      await store.login('user', 'pass')

      expect(postResponseWithoutAuth).toHaveBeenCalledWith('/auth/login', {
        login: 'user',
        password: 'pass',
      })
      expect(store.token).toBe('token-123')
      expect(store.refreshToken).toBe('refresh-456')
      expect(store.role).toBe('admin')
      expect(store.loaded).toBe(true)
    })

    it('throws on login failure', async () => {
      const err = new Error('Invalid credentials')
      err.statusCode = 401
      postResponseWithoutAuth.mockRejectedValue(err)

      const store = useAuth()
      await expect(store.login('user', 'wrong')).rejects.toMatchObject({
        message: 'Invalid credentials',
        statusCode: 401,
      })
    })

    it('does not login when already loaded', async () => {
      const store = useAuth()
      store.loaded = true

      await store.login('user', 'pass')

      expect(postResponseWithoutAuth).not.toHaveBeenCalled()
    })
  })

  describe('logout', () => {
    it('clears state and calls API on success', async () => {
      postResponseWithoutAuth.mockResolvedValue({})
      const store = useAuth()
      store.loaded = true
      store.token = 'token'
      store.refreshToken = 'refresh'
      store.role = 'admin'

      await store.logout()

      expect(clearAuthState).toHaveBeenCalled()
      expect(postResponseWithoutAuth).toHaveBeenCalledWith('/auth/logout', {
        refresh_token: 'refresh',
      })
      expect(store.token).toBeNull()
      expect(store.loaded).toBe(false)
      expect(localStorage.getItem('auth')).toBeNull()
    })

    it('does not logout when not loaded', async () => {
      const store = useAuth()
      store.loaded = false

      await store.logout()

      expect(postResponseWithoutAuth).not.toHaveBeenCalled()
    })
  })
})
