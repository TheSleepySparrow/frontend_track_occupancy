import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { loadFromUrl, useFetchList, useFetchListOnMounted } from './useFetch.js'

vi.mock('src/services/api.js', () => ({
  getResponse: vi.fn(),
}))

vi.mock('quasar', () => ({
  Notify: { create: vi.fn() },
  Loading: { show: vi.fn(), hide: vi.fn() },
}))

import { getResponse } from 'src/services/api.js'

describe('useFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('loadFromUrl', () => {
    it('returns data on success', async () => {
      const mockData = [{ id: 1 }]
      getResponse.mockResolvedValue(mockData)

      const result = await loadFromUrl('/v1/test', { loading: false })

      expect(getResponse).toHaveBeenCalledWith('/v1/test')
      expect(result).toEqual(mockData)
    })

    it('throws with statusCode on error', async () => {
      const err = new Error('Failed')
      err.statusCode = 500
      getResponse.mockRejectedValue(err)

      await expect(loadFromUrl('/v1/test', { loading: false })).rejects.toMatchObject({
        message: 'Failed',
        statusCode: 500,
      })
    })
  })

  describe('useFetchList', () => {
    it('loads data when props has id', async () => {
      const mockData = [{ id: 1, name: 'Item' }]
      getResponse.mockResolvedValue(mockData)

      const props = ref({ id: 5 })
      const { data, error, refetch } = useFetchList(props, '/v1/items', {
        loading: false,
        notify: false,
      })

      await refetch()

      expect(getResponse).toHaveBeenCalledWith('/v1/items/5')
      expect(data.value).toEqual(mockData)
      expect(error.value).toBeNull()
    })

    it('sets error on failure', async () => {
      const err = new Error('Network error')
      getResponse.mockRejectedValue(err)

      const props = ref({ id: 1 })
      const { data, error, refetch } = useFetchList(props, '/v1/items', {
        loading: false,
        notify: false,
      })

      await refetch()

      expect(data.value).toEqual([])
      expect(error.value).toMatchObject({ message: 'Network error' })
    })

    it('does not load when props has no id', async () => {
      const props = ref({})
      const { data, refetch } = useFetchList(props, '/v1/items', {
        loading: false,
        notify: false,
      })

      await refetch()

      expect(getResponse).not.toHaveBeenCalled()
      expect(data.value).toEqual([])
    })
  })

  describe('useFetchListOnMounted', () => {
    it('loads on first call to reload', async () => {
      const mockData = [1, 2, 3]
      getResponse.mockResolvedValue(mockData)

      const { data, error, reload } = useFetchListOnMounted('/v1/list', {
        loading: false,
        notify: false,
      })

      await reload()

      expect(getResponse).toHaveBeenCalledWith('/v1/list')
      expect(data.value).toEqual([1, 2, 3])
      expect(error.value).toBeNull()
    })
  })
})
