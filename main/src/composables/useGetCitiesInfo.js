import { useFetchListOnMounted } from './useFetch.js'
import { computed } from 'vue'


export function useCitiesInfo(baseUrl, options = { loading: null, notify: null }) {
    const { data, error, reload } = useFetchListOnMounted(baseUrl, options)

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
    console.log('citiesInfo', citiesInfo.value)
    return { citiesInfo, error, reload }
}
