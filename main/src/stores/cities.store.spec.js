import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCitiesStore } from './cities.store.js'

vi.mock('src/composables/useFetch', () => ({
  loadFromUrl: vi.fn(),
}))

import { loadFromUrl } from 'src/composables/useFetch'

describe('cities store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('getters', () => {
    it('findCityById returns city when id matches (string or number)', () => {
      const store = useCitiesStore()
      store.cities = [
        { id: 1, 'name_ru-RU': 'Москва', 'name_en-US': 'Moscow' },
        { id: 2, 'name_ru-RU': 'СПб', 'name_en-US': 'Saint Petersburg' },
      ]

      expect(store.findCityById(1)).toEqual(store.cities[0])
      expect(store.findCityById('1')).toEqual(store.cities[0])
      expect(store.findCityById(3)).toBeUndefined()
    })

    it('getSlugByCityId returns name_en-US when city exists', () => {
      const store = useCitiesStore()
      store.cities = [{ id: 1, 'name_ru-RU': 'Москва', 'name_en-US': 'Moscow' }]

      const getSlug = store.getSlugByCityId
      expect(getSlug(1)).toBe('Moscow')
      expect(getSlug(999)).toBe('')
    })
  })

  describe('fetchCities', () => {
    it('loads and maps cities on success', async () => {
      const mockData = [
        { id: 1, name: { ru: 'Москва', en: 'Moscow' } },
        { id: 2, name: { ru: 'СПб', en: 'Saint Petersburg' } },
      ]
      loadFromUrl.mockResolvedValue(mockData)

      const store = useCitiesStore()
      await store.fetchCities()

      expect(loadFromUrl).toHaveBeenCalledWith('/v1/cities/', {
        loading: true,
        notify: true,
      })
      expect(store.cities).toHaveLength(2)
      expect(store.cities[0]).toEqual({
        id: 1,
        'name_ru-RU': 'Москва',
        'name_en-US': 'Moscow',
      })
      expect(store.loaded).toBe(true)
    })

    it('sets error and throws on failure', async () => {
      const err = new Error('Network error')
      loadFromUrl.mockRejectedValue(err)

      const store = useCitiesStore()
      await expect(store.fetchCities()).rejects.toThrow('Network error')
      expect(store.error).toBe(err)
    })

    it('does not fetch when already loaded', async () => {
      loadFromUrl.mockResolvedValue([])
      const store = useCitiesStore()
      store.loaded = true

      await store.fetchCities()

      expect(loadFromUrl).not.toHaveBeenCalled()
    })
  })
})
