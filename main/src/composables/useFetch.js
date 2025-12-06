import { ref, watch, onMounted } from 'vue'
import { getResponse } from 'src/services/api.js'
import { Notify } from 'quasar'
import { Loading } from 'quasar'


async function loadById(id, baseUrl, options = {}) {
    const {
        optionalUrl = null,
        loading = true,
        notify = true
    } = options

    let url = `${baseUrl}/${id}`
    if (optionalUrl) {
        url = `${url}/${optionalUrl}`
    }

    try {
        if (loading) {
            Loading.show()
        }
        const result = await getResponse(url)
        return result
    } catch (err) {
        if (notify) {
            Notify.create({
                message: `Ошибка получения данных (${err.message || 'неизвестная ошибка'})`,
                color: 'primary'
            })
        }
        console.error('Fetch error:', err)
        const error = new Error(err.message)
        error.statusCode = err.statusCode
        throw error
    } finally {
        if (loading) {
            Loading.hide()
        }
    }
}

export async function loadFromUrl(url, options = {}) {
    const {
        loading = true,
        notify = true
    } = options

    try {
        if (loading) {
            Loading.show()
        }
        const result = await getResponse(url)
        return result
    } catch (err) {
        if (notify) {
            Notify.create({
                message: `Ошибка загрузки данных (${err.message || 'неизвестная ошибка'})`,
                color: 'primary'
            })
        }
        console.error('Load from URL error:', err)
        const error = new Error(err.message)
        error.statusCode = err.statusCode
        throw error
    } finally {
        if (loading) {
            Loading.hide()
        }
    }
}

export function useFetchList(props, baseUrl, options = { optionalUrl: null, loading: null, notify: null }) {
    const data = ref([])
    const error = ref(null)

    const load = async (id) => {
        if (!id) return
        try {
            error.value = null
            const result = await loadById(id, baseUrl, options)
            data.value = Array.isArray(result) ? result : []
        } catch (err) {
            error.value = err
            data.value = []
        }
    }

    watch(() => props.id, load, { immediate: true })

    return { data, error }
}

export function useFetchListOnMounted(url, options = { loading: null, notify: null }) {
    const data = ref([])
    const error = ref(null)

    const load = async () => {
        try {
            error.value = null
            const result = await loadFromUrl(url, options)
            data.value = Array.isArray(result) ? result : []
            console.log(data.value)
        } catch (err) {
            error.value = err
            data.value = []
        }
    }

    onMounted(load)

    return { data, error, reload: load }
}
