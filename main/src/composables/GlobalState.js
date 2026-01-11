import { useStorage } from '@vueuse/core'

const STORAGE_KEY = 'vueuse-local-storage'

const initialGlobalState = {
  theme: 'light',
  language: 'en-US',
}

const globalState = useStorage(
  STORAGE_KEY,
  initialGlobalState,
  localStorage,
  { mergeDefaults: true }
)

export function useGlobalState() {
  return { globalState, initialGlobalState, STORAGE_KEY }
}

export function getTheme() {
  return globalState.value.theme
}

export function setTheme(theme) {
  globalState.value.theme = theme ? 'dark' : 'light'
}
