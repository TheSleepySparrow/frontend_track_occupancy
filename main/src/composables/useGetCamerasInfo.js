import { useFetchList } from './useFetch.js'
import { computed } from 'vue'

export function useCamerasInfo(propsForFetch, baseUrl, options = { optionalUrl: null, loading: null, notify: null }) {
  const { data, error } = useFetchList(propsForFetch, baseUrl, {
    optionalUrl: 'cameras',
    loading: false,
    ...options
  })

  const camerasInfo = computed(() => {
    if (error.value) {
      return []
    }
    if (!data.value) {
      return []
    }
    return data.value?.map(item => ({
      id: item.id,
      mac: item.mac,
      auditorium_id: item.auditorium_id
    }))
  })

  return { camerasInfo, error }
}
