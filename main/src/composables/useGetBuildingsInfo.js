import { useFetchList, loadFromUrl } from './useFetch.js'
import { computed, ref } from 'vue'
import { postResponse, putResponse, deleteResponse } from 'src/services/api.js'

export function useBuildingsInfo(
  props,
  baseUrl,
  options = { optionalUrl: null, loading: null, notify: null },
) {
  const { data, error, refetch } = useFetchList(props, baseUrl, options)

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
  return { buildingsInfo, error, refetch }
}

export function useCreateBuilding() {
  const error = ref(null)
  async function createBuilding(cityId, body) {
    error.value = null
    try {
      const url = `/v1/cities/${cityId}/buildings`
      return await postResponse(url, body)
    } catch (err) {
      error.value = err
      throw err
    }
  }
  return { createBuilding, error }
}

export function useUpdateBuilding() {
  const error = ref(null)
  async function updateBuilding(cityId, buildingId, body) {
    error.value = null
    try {
      const url = `/v1/cities/${cityId}/buildings/${buildingId}`
      return await putResponse(url, body)
    } catch (err) {
      error.value = err
      throw err
    }
  }
  return { updateBuilding, error }
}

export function useDeleteBuilding() {
  const error = ref(null)
  async function deleteBuilding(cityId, buildingId) {
    error.value = null
    try {
      const url = `/v1/cities/${cityId}/buildings/${buildingId}`
      return await deleteResponse(url)
    } catch (err) {
      error.value = err
      throw err
    }
  }
  return { deleteBuilding, error }
}

export async function getBuildingAuditories(cityId, buildingId) {
  try {
    const url = `/v1/cities/${cityId}/buildings/${buildingId}/auditories/`
    const result = await loadFromUrl(url, { loading: false, notify: false })
    return Array.isArray(result) ? result : []
  } catch (err) {
    console.log(err)
    return []
  }
}
