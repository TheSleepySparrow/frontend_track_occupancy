import { useFetchList } from './useFetch.js'
import { computed } from 'vue'
import { getLocalizedTypeLabel } from './GetMainInfo.js'


export function useAuditoriesInfo(props, baseUrl, options = { optionalUrl: null, loading: null, notify: null }) {
    const { data, error } = useFetchList(props, baseUrl, options)

    const auditoriesInfo = computed(() => {
        if (error.value) {
            return []
        }
        if (!data.value) {
            return []
        }
        return data.value?.map(item => {
            return {
                id: parseInt(item.id),
                type: item.type.en,
                'ru-RU': {
                    title: item.auditorium_number,
                    type: getLocalizedTypeLabel(item.type.en, 'ru-RU'),
                    description: ''
                },
                'en-US': {
                    title: item.auditorium_number,
                    type: getLocalizedTypeLabel(item.type.en, 'en-US'),
                    description: ''
                },
                floor: parseInt(item.floor_number),
                capacity: parseInt(item.capacity),
                img_url: item.image_url
            }
        })
    })
    return { auditoriesInfo, error }
}
