import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkUser } from './auth.js'

vi.mock('./api.js', () => ({
  getResponse: vi.fn(),
}))

import { getResponse } from './api.js'

describe('auth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('checkUser', () => {
    it('returns data with authenticated true on success', async () => {
      const mockData = { user: 'test' }
      getResponse.mockResolvedValue(mockData)

      const result = await checkUser()

      expect(getResponse).toHaveBeenCalledWith('/auth/verify')
      expect(result).toEqual({ ...mockData, authenticated: true })
    })

    it('returns false on error', async () => {
      getResponse.mockRejectedValue(new Error('Network error'))

      const result = await checkUser()

      expect(result).toBe(false)
    })
  })
})
