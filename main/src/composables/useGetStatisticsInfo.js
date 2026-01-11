import { useFetchList } from './useFetch.js'
import { computed } from 'vue'


export function useStatisticsByDay(props, baseUrl, date,
    options = { optionalUrl: null, loading: null, notify: null }) {
    const dateRef = computed(() => {
        return typeof date === 'object' && 'value' in date ? date.value : date
    })
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
    const { data, error, refetch } = useFetchList(props, baseUrl, { optionalUrl: url.value, loading: options.loading, notify: options.notify})

    const statisticsByDay = computed(() => {
        if (error.value) {
            return []
        }
        if (!data.value) {
            return []
        }
        return data.value?.map(item => ({
            time: item.hour + ':00 - ' + (item.hour + 1) + ':00',
            average: item.avg_person_count,
            min: item.min_people_count ? item.min_people_count : '',
            min_time: item.min_time ? item.min_time : '',
            max: item.max_people_count ? item.max_people_count : '',
            max_time: item.max_time ? item.max_time : ''
        }))
    })
    return { statisticsByDay, error, refetch }
}
