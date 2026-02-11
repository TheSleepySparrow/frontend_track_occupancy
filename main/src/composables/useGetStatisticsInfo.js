import { loadFromUrl } from './useFetch.js'
import { computed, ref, watch } from 'vue'

function returnNeededDateFormat(date) {
  const str = date.split('/')
  return `${str[0]}-${str[1]}-${str[2]}`
}

/** Format API day "2026-02-07T00:00:00Z" -> "07-02-2026" (DD-MM-YYYY) */
function formatDayLabel(dayStr) {
  if (!dayStr) return ''
  const d = new Date(dayStr)
  const day = String(d.getUTCDate()).padStart(2, '0')
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const year = d.getUTCFullYear()
  return `${day}-${month}-${year}`
}

function whatUrlParamsBasedOnType(type, date, detail) {
  let queryParams = 'type=' + type
  if (type === 2) {
    queryParams =
      queryParams +
      '&start=' +
      returnNeededDateFormat(date.from) +
      '&end=' +
      returnNeededDateFormat(date.to)
  } else {
    queryParams = queryParams + '&day=' + returnNeededDateFormat(date)
  }

  if (detail) {
    queryParams = queryParams + '&detail=true'
  }

  return queryParams
}

/**
 * @param {import('vue').Ref<{cityId: number|string, buildingId: number|string, auditoryId: number|string, date: string} | null>} requestParams - ref с параметрами запроса (cityId, buildingId, auditoryId, date) или null
 * @param {object} options - { loading, notify }
 */
export function useStatisticsByDay(requestParams, options = { loading: null, notify: null }) {
  const data = ref([])
  const error = ref(null)

  const url = computed(() => {
    const params =
      typeof requestParams === 'object' && 'value' in requestParams
        ? requestParams.value
        : requestParams

    if (!params?.cityId || !params?.buildingId || !params?.auditoryId || !params?.date) {
      return null
    }

    const queryParams = whatUrlParamsBasedOnType(params.type, params.date, params.detail)

    return `/v1/cities/${params.cityId}/buildings/${params.buildingId}/auditories/${params.auditoryId}/statistics/${params.statisticsType}?${queryParams}`
  })

  const load = async () => {
    const targetUrl = url.value
    if (!targetUrl) return

    try {
      error.value = null
      const result = await loadFromUrl(targetUrl, options)
      data.value = Array.isArray(result) ? result : []
    } catch (err) {
      error.value = err
      data.value = []
    }
  }

  watch(
    url,
    (newUrl) => {
      if (newUrl) load()
    },
    { immediate: true },
  )

  const statisticsByDay = computed(() => {
    if (error.value) return []
    if (!data.value) return []
    const isDetailFormat = Array.isArray(data.value[0]?.days)
    if (isDetailFormat) {
      return data.value.map((item) => ({
        time: item.hour ? item.hour + ':00 - ' + (item.hour + 1) + ':00' : item.pair_number,
        days: (item.days || []).map((d) => ({
          day: d.day,
          dayLabel: formatDayLabel(d.day),
          average: d.avg_person_count,
          min: d.min_person_count ?? '',
          max: d.max_person_count ?? '',
        })),
      }))
    }
    return data.value.map((item) => ({
      time: item.hour ? item.hour + ':00 - ' + (item.hour + 1) + ':00' : item.pair_number,
      average: item.avg_person_count,
      min: item.min_person_count ? item.min_person_count : '',
      max: item.max_person_count ? item.max_person_count : '',
    }))
  })

  return { statisticsByDay, error, refetch: load }
}
