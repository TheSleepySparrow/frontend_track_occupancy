import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
//import { useAuth } from 'src/stores/auth.store'

const STORAGE_KEY = 'global-storage-for-user'

const initialGlobalState = {
  theme: 'light',
  language: 'en-US',
  lastBuildingId: [],
}

const storageKey = computed(() => {
  //const authStore = useAuth()
  //return authStore.isAuthenticated ? `${STORAGE_KEY}-${authStore.login}` : STORAGE_KEY
  return STORAGE_KEY
})

const globalState = useStorage(storageKey, initialGlobalState, localStorage, {
  mergeDefaults: true,
})

export function useGlobalState() {
  return { globalState, initialGlobalState, storageKey }
}

export function getTheme() {
  return globalState.value.theme
}

export function setTheme(theme) {
  globalState.value.theme = theme ? 'dark' : 'light'
}

export function getLastBuildingId(cityId) {
  if (!cityId) return null
  const obj = globalState.value.lastBuildingId.find((obj) => obj.city === cityId)
  return obj ? obj.building : null
}

export function setLastBuildingId(cityId, buildingId) {
  if (!cityId || !buildingId) return
  if (!globalState.value.lastBuildingId) {
    globalState.value.lastBuildingId = []
  }
  const isCityInArray = globalState.value.lastBuildingId.findIndex((obj) => obj.city === cityId)
  if (isCityInArray > -1) {
    globalState.value.lastBuildingId[isCityInArray].building = buildingId
    return
  }
  globalState.value.lastBuildingId.push({
    city: cityId,
    building: buildingId,
  })
}

export function clearLastBuildingId(cityId) {
  if (!cityId) return
  if (globalState.value.lastBuildingId) {
    const id = globalState.value.lastBuildingId.findIndex((obj) => obj.city === cityId)
    if (id > -1) {
      globalState.value.lastBuildingId.splice(id, 1)
    }
  }
}
