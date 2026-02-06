import { ref, computed, onMounted } from 'vue'
import { loadFromUrl } from './useFetch.js'

export function useGetAllCamerasInfo(options = { loading: true, notify: true }) {
  const attachedData = ref([])
  const freeData = ref([])
  const error = ref(null)
  const loading = ref(false)

  const camerasInfo = computed(() => {
    const attached = Array.isArray(attachedData.value) ? attachedData.value : []
    const free = Array.isArray(freeData.value) ? freeData.value : []

    const byId = new Map()
    attached.forEach(item => {
      byId.set(item.id, {
        id: item.id,
        mac: item.mac,
        auditorium_id: item.auditorium_id,
        isAttached: true
      })
    })
    free.forEach(item => {
      if (!byId.has(item.id)) {
        byId.set(item.id, {
          id: item.id,
          mac: item.mac,
          auditorium_id: item.auditorium_id || null,
          isAttached: false
        })
      }
    })
    return Array.from(byId.values())
  })

  const load = async () => {
    loading.value = true
    error.value = null
    try {
      const [attachedResult, freeResult] = await Promise.all([
        loadFromUrl('/v1/cameras/attached', { ...options, loading: false }),
        loadFromUrl('/v1/cameras', { ...options, loading: false })
      ])
      attachedData.value = Array.isArray(attachedResult) ? attachedResult : []
      freeData.value = Array.isArray(freeResult) ? freeResult : (freeResult ? [freeResult] : [])
    } catch (err) {
      error.value = err
      attachedData.value = []
      freeData.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return { camerasInfo, error, loading, reload: load }
}
