import { useFetchList, loadFromUrl } from './useFetch.js'
import { ref, computed, onMounted } from 'vue'
import { postResponse, putResponse, deleteResponse } from 'src/services/api.js'

export function useCamerasInfo(
  propsForFetch,
  baseUrl,
  options = { optionalUrl: null, loading: null, notify: null },
) {
  const { data, error, refetch } = useFetchList(propsForFetch, baseUrl, {
    optionalUrl: 'cameras',
    loading: false,
    ...options,
  })

  const camerasInfo = computed(() => {
    if (error.value) {
      return []
    }
    if (!data.value) {
      return []
    }
    return data.value?.map((item) => ({
      id: item.id,
      mac: item.mac,
      auditorium_id: item.auditorium_id,
    }))
  })

  return { camerasInfo, error, refetch }
}

export function useFreeCamerasInfo(options = { loading: true, notify: true }) {
  const data = ref([])
  const error = ref(null)
  const loading = ref(false)

  const camerasInfo = computed(() => {
    if (error.value) return []
    const list = Array.isArray(data.value) ? data.value : []
    return list.map((item) => ({
      id: item.id,
      mac: item.mac,
      auditorium_id: item.auditorium_id || null,
    }))
  })

  const load = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await loadFromUrl('/v1/cameras', { ...options, loading: false })
      data.value = Array.isArray(result) ? result : result ? [result] : []
    } catch (err) {
      error.value = err
      data.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return { camerasInfo, error, loading, reload: load }
}

export function useCreateCamera() {
  const error = ref(null)
  async function createCamera(body) {
    error.value = null
    try {
      const url = '/v1/cameras'
      return await postResponse(url, body)
    } catch (err) {
      error.value = err
      throw err
    }
  }
  return { createCamera, error }
}

export function useUpdateCamera() {
  const error = ref(null)
  async function updateCamera(cameraId, body) {
    error.value = null
    try {
      const url = `/v1/cameras/${cameraId}`
      return await putResponse(url, body)
    } catch (err) {
      error.value = err
      throw err
    }
  }
  return { updateCamera, error }
}

export function useDeleteCamera() {
  const error = ref(null)
  async function deleteCamera(cameraId) {
    error.value = null
    try {
      const url = `/v1/cameras/${cameraId}?confirm=true`
      return await deleteResponse(url)
    } catch (err) {
      error.value = err
      throw err
    }
  }
  return { deleteCamera, error }
}
