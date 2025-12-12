import { useFetchList } from './useFetch.js'
import { computed, ref } from 'vue'


export function useStatisticsByDay(props, baseUrl, date,
    options = { optionalUrl: null, loading: null, notify: null }) {
    const dateRef = typeof date === 'object' && 'value' in date ? date : ref(date)
    const queryParams = computed(() => {
        if (!dateRef.value) return ''

        let str = dateRef.value.slice(-4, ) + '-' + dateRef.value.slice(-7, -5) + '-' + dateRef.value.slice(-10, -8)
        str = 'day=' + str + '&type=1'
        return new URLSearchParams(str).toString()
    })
    
    const url = computed(() => {
        const params = queryParams.value
        return options.optionalUrl ? `${options.optionalUrl}?${params}` : params
    })
    const { data, error } = useFetchList(props, baseUrl, { optionalUrl: url.value, loading: options.loading, notify: options.notify})

    const statisticsByDay = computed(() => {
        if (error.value) {
            return []
        }
        if (!data.value) {
            return []
        }
        console.log('data', data.value)
        return data.value?.map(item => ({
            time: item.hour + ':00 - ' + (item.hour + 1) + ':00',
            average: item.avg_person_count,
            min: item.min_people_count ? item.min_people_count : 0,
            min_time: item.min_time ? item.min_time : '',
            max: item.max_people_count ? item.max_people_count : 0,
            max_time: item.max_time ? item.max_time : ''
        }))
    })
    return { statisticsByDay, error }
}
