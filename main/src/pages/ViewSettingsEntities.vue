<template>
  <q-page class="q-pa-xl">
    <!-- Empty state: no entity selected -->
    <div
      v-if="!currentEntity"
      class="column items-center justify-center q-pa-xl"
    >
      <q-card
        flat
        bordered
        class="q-pa-xl text-center"
        style="max-width: 600px"
      >
        <p class="text-h6 text-grey-8">
          {{ $t('settingsPage.emptyState') }}
        </p>
      </q-card>
    </div>

    <!-- Entity list: when cities, auditories or cameras selected -->
    <div
      v-else
      class="column q-col-gutter-xl"
    >
      <!-- City + building filter: only for auditories -->
      <div
        v-if="currentEntity === 'auditories'"
        class="col-12"
      >
        <q-card
          flat
          bordered
          class="q-pa-sm"
        >
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-select
                v-model="chosenCity"
                :options="cities"
                dense
                behavior="menu"
                outlined
                :label="$t('statistics.city')"
                @update:model-value="onCityChange"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="chosenBuildingId"
                :options="filteredBuildings"
                dense
                outlined
                :label="$t('statistics.building')"
                use-input
                behavior="menu"
                hide-selected
                fill-input
                input-debounce="200"
                @filter="filterFn"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      {{ $t('statistics.noBuildingsFound') }}
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
        </q-card>
      </div>
      <!-- Search: only for auditories and cameras -->
      <div
        v-if="currentEntity && currentEntity !== 'cities'"
        class="col-12 col-md-4"
      >
        <q-input
          v-model="searchQuery"
          type="search"
          outlined
          dense
          clearable
          clear-icon="close"
          :placeholder="$t('settingsPage.searchPlaceholder')"
          debounce="300"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <!-- Content section -->
      <div class="col-12">
        <q-card
          flat
          bordered
          class="q-pa-md"
        >
          <!-- Cities: self-contained component, no parent loading/error/filteredItems -->
          <SettingsItemCities
            v-if="currentEntity === 'cities'"
            :locale="locale"
            @edit="onEdit"
            @delete="onDelete"
          />
          <!-- Auditories and cameras: parent handles loading, error, filteredItems -->
          <template v-else>
            <div
              v-if="loading"
              class="q-pa-lg text-center"
            >
              <q-spinner-dots
                color="primary"
                size="40px"
              />
            </div>
            <TheErrorPopUp
              v-else-if="error"
              :err="error"
              error-page="viewSettings"
              :route-params="{}"
            />
            <div
              v-else-if="currentEntity === 'auditories' && (!chosenCity || !chosenBuildingId)"
              class="q-pa-lg text-center text-grey"
            >
              {{ $t('settingsPage.selectCityAndBuilding') }}
            </div>
            <div
              v-else-if="filteredItems.length === 0"
              class="q-pa-lg text-center text-grey"
            >
              {{ $t('settingsPage.noItems') }}
            </div>
            <component
              v-else
              :filtered-items="filteredItems"
              :is="entityComponent"
              :locale="locale"
              :chosen-city-id="auditoriesChosenCityId"
              :chosen-building-id="auditoriesChosenBuildingId"
              :refetch-auditories="refetchAuditories"
              @edit="onEdit"
              @delete="onDelete"
            />
          </template>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import TheErrorPopUp from 'src/components/TheErrorPopUp.vue'
import SettingsItemCities from 'src/components/SettingsItemCities.vue'
import SettingsItemAuditories from 'src/components/SettingsItemAuditories.vue'
import SettingsItemCameras from 'src/components/SettingsItemCameras.vue'
import { useAuditoriesInfo } from 'src/composables/useGetAuditoriesInfo.js'
import { useBuildingsInfo } from 'src/composables/useGetBuildingsInfo.js'
import { useGetAllCamerasInfo } from 'src/composables/useGetAllCamerasInfo.js'
import { useCitiesStore } from 'src/stores/cities.store'

const route = useRoute()
const { locale } = useI18n()
const citiesStore = useCitiesStore()

const searchQuery = ref('')

const entityByRoute = {
  viewSettingsCitiesAndBuildings: 'cities',
  viewSettingsAuditories: 'auditories',
  viewSettingsCameras: 'cameras',
}

const currentEntity = computed(() => entityByRoute[route.name] || null)

const entityConfig = {
  auditories: {
    component: SettingsItemAuditories,
    getTitle: (item, loc) => item[loc]?.title || item['ru-RU']?.title || item['en-US']?.title || '',
  },
  cameras: {
    component: SettingsItemCameras,
    getTitle: (item) => `ID: ${item.id} | ${item.mac}`,
  },
}

const entityComponent = computed(() =>
  currentEntity.value ? entityConfig[currentEntity.value]?.component : null,
)

// Auditories: city + building filter
const chosenCity = ref(null)
const chosenBuildingId = ref(null)
const cities = computed(() =>
  citiesStore.cities.map((city) => ({
    label: city[`name_${locale.value}`],
    value: city.id,
  })),
)
const cityIdRef = computed(() => {
  if (!chosenCity.value?.value) return { id: null }
  return { id: chosenCity.value.value }
})
const { buildingsInfo: buildingsList } = useBuildingsInfo(cityIdRef, '/v1/cities', {
  optionalUrl: 'buildings',
  loading: true,
  notify: true,
})
const buildings = computed(() => {
  return buildingsList.value.map((building) => {
    return { label: building[locale.value].title, value: building.id }
  })
})

const filteredBuildings = ref([])
function filterFn(val, update) {
  update(() => {
    if (val === '') {
      filteredBuildings.value = buildings.value
      return
    } else {
      const needle = val.toLowerCase()
      filteredBuildings.value = buildings.value.filter(
        (v) => v.label.toLowerCase().indexOf(needle) > -1,
      )
    }
  })
}
function onCityChange(selected) {
  if (!selected?.value) {
    return
  }
  const cityId = selected.value
  const city = citiesStore.findCityById(cityId)
  if (!city) return
  chosenBuildingId.value = null
}

const auditoriesUrl = computed(() => {
  if (!chosenCity.value?.value) return '/v1/cities'
  return '/v1/cities/' + chosenCity.value.value + '/buildings'
})
const buildingIdRef = computed(() => {
  if (!chosenBuildingId.value?.value) return { id: null }
  return { id: chosenBuildingId.value.value }
})

const {
  auditoriesInfo: auditoriesData,
  error: auditoriesError,
  loading: auditoriesLoading,
  refetch: refetchAuditories,
} = useAuditoriesInfo(buildingIdRef, auditoriesUrl, {
  optionalUrl: 'auditories',
  loading: true,
  notify: true,
})
const auditoriesList = ref([])
watch(
  auditoriesData,
  (newData) => {
    if (newData && Array.isArray(newData)) {
      auditoriesList.value = newData
    } else {
      auditoriesList.value = []
    }
  },
  { immediate: true },
)

watch(chosenBuildingId, (newBuildingId) => {
  if (!newBuildingId) {
    auditoriesList.value = []
  }
})

const auditoriesChosenCityId = computed(() => chosenCity.value?.value ?? null)
const auditoriesChosenBuildingId = computed(() => chosenBuildingId.value?.value ?? null)

// Cameras: both endpoints
const {
  camerasInfo: camerasList,
  error: camerasError,
  loading: camerasLoading,
} = useGetAllCamerasInfo({ loading: true, notify: true })

const rawItems = computed(() => {
  if (currentEntity.value === 'auditories') {
    if (auditoriesChosenCityId.value === null || auditoriesChosenBuildingId.value === null) {
      return []
    }
    return auditoriesList.value || []
  }
  if (currentEntity.value === 'cameras') {
    return camerasList.value || []
  }
  return []
})

const filteredItems = computed(() => {
  const items = rawItems.value
  const query = (searchQuery.value || '').toString().toLowerCase()
  if (!query) return items

  const config = currentEntity.value ? entityConfig[currentEntity.value] : null
  const getTitle = config?.getTitle
  if (!getTitle) return items

  return items.filter((item) => {
    const title = getTitle(item, locale.value).toLowerCase()
    return title.includes(query)
  })
})

const loading = computed(() => {
  if (currentEntity.value === 'auditories') return auditoriesLoading.value
  if (currentEntity.value === 'cameras') return camerasLoading.value
  return false
})

const error = computed(() => {
  if (currentEntity.value === 'auditories') return auditoriesError.value
  if (currentEntity.value === 'cameras') return camerasError.value
  return null
})

function onEdit(item) {
  console.log(item)
}

function onDelete(item) {
  console.log(item)
}

watch(
  () => route.name,
  async (routeName) => {
    if (entityByRoute[routeName] === 'auditories' && !citiesStore.loaded) {
      try {
        await citiesStore.fetchCities()
      } catch (err) {
        console.error('Cities load failed', err)
      }
    }
  },
  { immediate: true }
)
</script>
