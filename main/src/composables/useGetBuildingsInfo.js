import { useFetchList } from './useFetch.js'
import { ref } from 'vue'


export function useBuildingsInfo(cityId, baseUrl, options = { optionalUrl: null, loading: null, notify: null }) {
    const props = { id: cityId }
    console.log('====1==== ', props)
    const { data, error } = useFetchList(props, baseUrl, options)
    console.log('====2==== ', data.value, error.value)
    if (error.value) { return [] }

    if (!data.value) { return [] }

    const buildingsInfo = ref(data.value?.map(item => ({
        id: item.id,
        'ru-RU': {
            title: item.address_ru,
        },
        'en-US': {
            title: item.address_en,
        },
        floorNumber: item.floors_count
    })))
    console.log('====3==== ', buildingsInfo.value)
    return buildingsInfo
}
