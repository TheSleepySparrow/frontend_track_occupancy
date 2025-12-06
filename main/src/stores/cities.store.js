import { defineStore } from 'pinia'
import { useFetchListOnMounted } from 'src/composables/useFetch'
import { getCitiesList } from 'src/services/getCities'

export const useCitiesStore = defineStore('cities', {
  state: () => ({
    cities: [],
    loaded: false
  }),

  getters: {
    findCityById: (state) => (id) => {
      return state.cities.find(city => String(city.id) === String(id))
    },

    getSlugByCityId: (state) => {
      const locale = 'en-US'
      return (id) => {
        const city = state.cities.find(c => c.id === id)
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
      if (this.loaded) return

      try {
        const data = useFetchListOnMounted('/api/v1/cities', { optionalUrl: null, loading: true, notify: true })
        console.log(data)
        this.cities = await getCitiesList()
        this.loaded = true
      } catch (err) {
        console.error('Cities load failed in route guard', err)
        throw err
      }
    }
  }
})