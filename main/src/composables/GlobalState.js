import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
//import { useAuth } from 'src/stores/auth.store'

const STORAGE_KEY = 'global-storage-for-user'

const initialGlobalState = {
  theme: 'light',
  language: 'en-US',
}

const storageKey = computed(() => {
  //const authStore = useAuth()
  //return authStore.isAuthenticated ? `${STORAGE_KEY}-${authStore.login}` : STORAGE_KEY
  return STORAGE_KEY
})

const globalState = useStorage(
  storageKey,
  initialGlobalState,
  localStorage,
  { mergeDefaults: true }
)

export function useGlobalState() {
  return { globalState, initialGlobalState, storageKey }
}

export function getTheme() {
  return globalState.value.theme
}

export function setTheme(theme) {
  globalState.value.theme = theme ? 'dark' : 'light'
}
