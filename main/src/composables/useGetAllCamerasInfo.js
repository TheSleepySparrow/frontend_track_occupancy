import { ref, computed, onMounted } from 'vue'
import { loadFromUrl } from './useFetch.js'

export function useGetAllCamerasInfo(options = { loading: true, notify: true }) {
  const attachedData = ref([])
  const freeData = ref([])
  const error = ref(null)
  const loading = ref(false)

  const mapItem = (item, isAttached) => ({
    id: item.id,
    mac: item.mac,
    ip: item.ip ?? null,
    auditorium_id: item.auditorium_id ?? null,
    isAttached,
  })

  const attachedCamerasInfo = computed(() => {
    const attached = Array.isArray(attachedData.value) ? attachedData.value : []
    return attached.map((item) => mapItem(item, true))
  })

  const freeCamerasInfo = computed(() => {
    const free = Array.isArray(freeData.value) ? freeData.value : []
    const attachedIds = new Set(attachedCamerasInfo.value.map((c) => c.id))
    return free.filter((item) => !attachedIds.has(item.id)).map((item) => mapItem(item, false))
  })

  const camerasInfo = computed(() => {
    return [...attachedCamerasInfo.value, ...freeCamerasInfo.value]
  })

  const load = async () => {
    loading.value = true
    error.value = null
    try {
      const [attachedResult, freeResult] = await Promise.all([
        loadFromUrl('/v1/cameras/attached', { ...options, loading: false }),
        loadFromUrl('/v1/cameras', { ...options, loading: false }),
      ])
      attachedData.value = Array.isArray(attachedResult) ? attachedResult : []
      freeData.value = Array.isArray(freeResult) ? freeResult : freeResult ? [freeResult] : []
    } catch (err) {
      error.value = err
      attachedData.value = []
      freeData.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return { camerasInfo, attachedCamerasInfo, freeCamerasInfo, error, loading, reload: load }
}
