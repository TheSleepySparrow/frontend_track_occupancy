import { defineBoot } from '#q-app/wrappers'
import { useGlobalState } from 'src/composables/GlobalState'
import { Dark } from 'quasar'

const { globalState } = useGlobalState()

export default defineBoot(() => {
  Dark.set(globalState.value.theme === 'dark')
})
