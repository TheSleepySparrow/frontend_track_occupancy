import { defineStore } from 'pinia'
import { loadFromUrl } from 'src/composables/useFetch'

export const useCitiesStore = defineStore('cities', {
  state: () => ({
    cities: [],
    loaded: false,
    loading: false,
    error: null,
  }),

  getters: {
    findCityById: (state) => (id) => {
      return state.cities.find((city) => String(city.id) === String(id))
    },

    getSlugByCityId: (state) => {
      const locale = 'en-US'
      return (id) => {
        const city = state.cities.find((c) => c.id === id)
        if (!city) return ''

        const slugKey = `name_${locale}`
        if (city[slugKey]) {
          return city[slugKey]
        }

        return ''
      }
    },
  },

  actions: {
    async fetchCities() {
      if (this.loaded || this.loading) return

      this.loading = true
      this.error = null
      try {
        const data = await loadFromUrl('/v1/cities/', { loading: true, notify: true })

        this.cities = Array.isArray(data)
          ? data.map((item) => ({
              id: item.id,
              'name_ru-RU': item.name.ru,
              'name_en-US': item.name.en,
            }))
          : []
        this.loaded = true
      } catch (err) {
        this.error = err
        console.error('Cities load failed', err)
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
