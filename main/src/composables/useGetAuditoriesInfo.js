import { useFetchList, useFetchObject } from './useFetch.js'
import { computed } from 'vue'
import { getLocalizedTypeLabel } from './GetMainInfo.js'

export function useAuditoriesInfo(
  props,
  baseUrl,
  options = { optionalUrl: null, loading: null, notify: null },
) {
  const { data, error } = useFetchList(props, baseUrl, options)

  const auditoriesInfo = computed(() => {
    if (error.value) {
      return []
    }
    if (!data.value) {
      return []
    }
    return data.value?.map((item) => {
      return {
        id: parseInt(item.id),
        type: item.type.en,
        'ru-RU': {
          title: item.auditorium_number,
          type: getLocalizedTypeLabel(item.type.en, 'ru-RU'),
          description: '',
        },
        'en-US': {
          title: item.auditorium_number,
          type: getLocalizedTypeLabel(item.type.en, 'en-US'),
          description: '',
        },
        floor: parseInt(item.floor_number),
        capacity: parseInt(item.capacity),
        img_url: item.image_url,
      }
    })
  })
  return { auditoriesInfo, error }
}

export function useAuditoriesOccupancyInfo(
  props,
  baseUrl,
  options = { optionalUrl: null, loading: null, notify: null },
) {
  const str = { timestamp: new Date().toISOString() }
  const params = new URLSearchParams(str).toString()
  const url = options.optionalUrl ? `${options.optionalUrl}?${params}` : params
  //const url = options.optionalUrl ? `${options.optionalUrl}?timestamp=2025-12-10T13:00:15.123Z` : params
  const { data, error } = useFetchList(props, baseUrl, {
    optionalUrl: url,
    loading: options.loading,
    notify: options.notify,
  })

  const auditoriesOccupancyInfo = computed(() => {
    if (error.value) {
      return []
    }
    if (!data.value) {
      return []
    }
    return data.value?.map((item) => {
      return {
        id: parseInt(item.auditorium_id),
        count: parseInt(item.person_count),
        timestamp: item.actual_timestamp,
        isValid: item.is_fresh,
        differenceIntime: item.time_diff_minutes,
        warning: item.warning ? item.warning : null,
      }
    })
  })
  return { auditoriesOccupancyInfo, error }
}

export function useAuditoryOccupancy(
  props,
  baseUrl,
  options = { optionalUrl: null, loading: null, notify: null },
) {
  const str = { timestamp: new Date().toISOString() }
  const params = new URLSearchParams(str).toString()
  const url = options.optionalUrl ? `${options.optionalUrl}?${params}` : params
  const { data, error } = useFetchObject(props, baseUrl, {
    optionalUrl: url,
    loading: options.loading,
    notify: options.notify,
  })

  const auditoryOccupancy = computed(() => {
    if (error.value) {
      return null
    }
    if (!data.value) {
      return null
    }
    return {
      id: parseInt(data.value.auditorium_id),
      count: parseInt(data.value.person_count),
      timestamp: data.value.actual_timestamp,
      isValid: data.value.is_fresh,
      differenceIntime: data.value.time_diff_minutes,
      warning: data.value.warning ? data.value.warning : null,
    }
  })
  return { auditoryOccupancy, error }
}
