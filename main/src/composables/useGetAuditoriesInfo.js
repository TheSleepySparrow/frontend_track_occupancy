import { useFetchList } from './useFetch.js'
import { computed } from 'vue'


export function useAuditoriesInfo(props, baseUrl, options = { optionalUrl: null, loading: null, notify: null }) {
    const { data, error } = useFetchList(props, baseUrl, options)

    const auditoriesInfo = computed(() => {
        if (error.value) {
            return []
        }
        if (!data.value) {
            return []
        }
        return data.value?.map(item => ({
            id: item.id,
            'ru-RU': {
                title: item.auditorium_number,
                type: item.type.ru,
                description: ''
            },
            'en-US': {
                title: item.auditorium_number,
                type: item.type.en,
                description: ''
            },
            floor: item.floor_number,
            capacity: item.capacity,
            img_url: item.image_url
        }))
    })
    return { auditoriesInfo, error }
}
