import { useFetchList } from './useFetch.js'
import { computed } from 'vue'

export function useBuildingsInfo(
  props,
  baseUrl,
  options = { optionalUrl: null, loading: null, notify: null },
) {
  const { data, error } = useFetchList(props, baseUrl, options)

  const buildingsInfo = computed(() => {
    if (error.value) {
      return []
    }
    if (!data.value) {
      return []
    }
    return data.value?.map((item) => ({
      id: parseInt(item.id),
      'ru-RU': {
        title: item.address.ru,
      },
      'en-US': {
        title: item.address.en,
      },
      floorNumber: parseInt(item.floors_count),
    }))
  })
  return { buildingsInfo, error }
}
