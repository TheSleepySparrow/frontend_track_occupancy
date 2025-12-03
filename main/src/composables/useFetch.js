import { ref, watch } from 'vue'
import { getResponse } from 'src/services/api.js'
import { Notify } from 'quasar'
import { Loading } from 'quasar'


export function useFetchList(props, baseUrl, options = { optionalUrl: null, loading: null, notify: null }) {
    const data = ref([])
    const error = ref(null)
    const url = ref('')

    const load = async (id) => {
        data.value = []
        error.value = null
        url.value = `${baseUrl}/${id}`

        if (options.optionalUrl) {
            url.value = `${url.value}/${options.optionalUrl}`
        }

        try {
            if (options.loading) {
                Loading.show()
            }
            const result  = await getResponse(url.value)
            data.value = result
        } catch (err) {
            error.value = err.message
            if (options.notify) {
                Notify.create({
                    message: `Ошибка получения данных (${error.value})`,
                    color: 'primary'
                })
            }
            console.log('catch',error.value)
        } finally {
            if (options.loading) { 
                Loading.hide()
            }
        }
    }

    //onMounted(load)
    watch(() => props.id, async (id) => {
        if (!id) return
        await load(id)
    }, { immediate: true })

    return { data, error }
}

export function useFetchInfo(props, baseUrl, options = { loading: null, notify: null }) {
    const data = ref(null)
    const error = ref(null)

    const load = async (id) => {
        data.value = null
        error.value = null

        try {
            if (options.loading && 'show' in options.loading) {
                options.loading.show();
            }
            const result = await getResponse(`${baseUrl}/${id}`)
            data.value = result
           
        } catch (err) {
            error.value = err.message;
            if (options.notify) {
                options.notify({
                    message: `Ошибка получения данных: ${error.value}`,
                    color: 'primary'
                });
            }
        } finally {
            if (options.loading && 'hide' in options.loading) {
                options.loading.hide()
            }
        }
    }

    watch(() => props.id, async (id) => {
        if (!id) return
        await load(id)
    }, { immediate: true })

    return { data, error }
}
