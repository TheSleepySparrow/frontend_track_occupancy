<template>
  <q-page class="q-pa-xl">
    <!-- Empty state: no entity selected -->
    <div v-if="!currentEntity" class="column items-center justify-center q-pa-xl">
      <q-card flat bordered class="q-pa-xl text-center" style="max-width: 600px">
        <p class="text-h6 text-grey-8">
          {{ $t('settingsPage.emptyState') }}
        </p>
      </q-card>
    </div>

    <!-- Entity list: when cities, auditories or cameras selected -->
    <div v-else class="column q-col-gutter-xl">
      <!-- Filter section: only for auditories and cameras -->
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
        <q-card flat bordered class="q-pa-md">
          <!-- Cities: self-contained component, no parent loading/error/filteredItems -->
          <SettingsItemCities
            v-if="currentEntity === 'cities'"
            :locale="locale"
            @edit="onEdit"
            @delete="onDelete"
          />
          <!-- Auditories and cameras: parent handles loading, error, filteredItems -->
          <template v-else>
            <div v-if="loading" class="q-pa-lg text-center">
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
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import TheErrorPopUp from 'src/components/TheErrorPopUp.vue'
import SettingsItemCities from 'src/components/SettingsItemCities.vue'
import SettingsItemAuditories from 'src/components/SettingsItemAuditories.vue'
import SettingsItemCameras from 'src/components/SettingsItemCameras.vue'
import { useAuditoriesInfo } from 'src/composables/useGetAuditoriesInfo.js'
import { useGetAllCamerasInfo } from 'src/composables/useGetAllCamerasInfo.js'

const route = useRoute()
const { locale } = useI18n()

const searchQuery = ref('')

const entityByRoute = {
  viewSettingsCitiesAndBuildings: 'cities',
  viewSettingsAuditories: 'auditories',
  viewSettingsCameras: 'cameras'
}

const currentEntity = computed(() => entityByRoute[route.name] || null)

const entityConfig = {
  auditories: {
    component: SettingsItemAuditories,
    getTitle: (item, loc) => item[loc]?.title || item['ru-RU']?.title || item['en-US']?.title || ''
  },
  cameras: {
    component: SettingsItemCameras,
    getTitle: (item) => `ID: ${item.id} | ${item.mac}`
  }
}

const entityComponent = computed(() =>
  currentEntity.value ? entityConfig[currentEntity.value]?.component : null
)

// Auditories: buildingId=1, cityId=1
const auditoriesProps = computed(() => ({ id: 1 }))
const auditoriesBaseUrl = '/v1/cities/1/buildings'
const { auditoriesInfo: auditoriesList, error: auditoriesError } = useAuditoriesInfo(
  auditoriesProps,
  auditoriesBaseUrl,
  { optionalUrl: 'auditories', loading: true, notify: true }
)

// Cameras: both endpoints
const { camerasInfo: camerasList, error: camerasError, loading: camerasLoading } = useGetAllCamerasInfo(
  { loading: true, notify: true }
)

const rawItems = computed(() => {
  if (currentEntity.value === 'auditories') {
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

  return items.filter(item => {
    const title = getTitle(item, locale.value).toLowerCase()
    return title.includes(query)
  })
})

const loading = computed(() => {
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
  // Placeholder - no logic yet
}

function onDelete(item) {
  console.log(item)
  // Placeholder - no logic yet
}
</script>
