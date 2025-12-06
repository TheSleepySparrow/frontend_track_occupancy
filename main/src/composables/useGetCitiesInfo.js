import { useFetchList } from './useFetch.js'
import { computed } from 'vue'


export function useCitiesInfo(props, baseUrl, options = { optionalUrl: null, loading: null, notify: null }) {
    const { data, error } = useFetchList(props, baseUrl, options)

    const citiesInfo = computed(() => {
        if (error.value) {
            return []
        }
        if (!data.value) {
            return []
        }
        return data.value?.map(item => ({
            id: item.id,
            'name_ru-RU': item.name.ru,
            'name_en-US': item.name.en
        }))
    })
    return { citiesInfo, error }
}
