<template>
  <div class="col-12">
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <div
          :class="
            $q.dark.isActive
              ? 'q-pa-md text-h6 text-white text-center'
              : 'q-pa-md text-h6 text-primary text-center'
          "
        >
          {{ $t('settingsPage.toolbarCities') }}
        </div>

        <q-separator spaced />

        <q-tabs
          v-model="citiesChoose"
          vertical
          class="text-grey"
          :active-color="$q.dark.isActive ? 'white' : 'primary'"
          dense
          indicator-color="primary"
          align="justify"
        >
          <q-tab
            v-for="city in citiesOptions"
            :key="city.value"
            :name="city.value"
            :label="city.label"
          />
        </q-tabs>

        <q-separator spaced />

        <div class="full-width q-py-xl column items-center">
          <q-btn
            :label="$t('settingsPage.addCityButton')"
            class="col q-ml-sm text-secondary"
            outline
            @click="showCreateCityDialog = true"
          />
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div
            v-if="!citiesChoose"
            class="text-grey text-center q-pa-lg"
          >
            {{ $t('settingsPage.selectCity') }}
          </div>
          <template v-else>
            <div
              v-if="citiesLoading"
              class="q-pa-lg text-center"
            >
              <q-spinner-dots
                color="primary"
                size="40px"
              />
            </div>
            <TheErrorPopUp
              v-else-if="buildingsError"
              :err="buildingsError"
              error-page="viewSettings"
              :route-params="{}"
            />
            <template v-else>
              <div class="row items-center q-mb-md">
                <div class="text-h6 col">
                  {{ selectedCityName }}
                </div>
                <div class="row q-gutter-xs no-wrap">
                  <q-btn
                    flat
                    dense
                    round
                    size="sm"
                    icon="edit"
                    color="primary"
                    :aria-label="$t('settingsPage.edit')"
                    @click="openEditCity"
                  >
                    <q-tooltip>{{ $t('settingsPage.edit') }}</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    dense
                    round
                    size="sm"
                    icon="delete"
                    color="negative"
                    :aria-label="$t('settingsPage.delete')"
                    @click="openDeleteCity"
                  >
                    <q-tooltip>{{ $t('settingsPage.delete') }}</q-tooltip>
                  </q-btn>
                </div>
              </div>
              <div class="column items-right q-mb-md q-gutter-y-md">
                <q-input
                  v-model="searchQuery"
                  type="search"
                  outlined
                  dense
                  clearable
                  clear-icon="close"
                  :placeholder="$t('settingsPage.searchPlaceholder')"
                  debounce="300"
                  class="col full-width"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
                <q-btn
                  :label="$t('settingsPage.addBuildingButton')"
                  color="primary"
                  flat
                  class="col-4"
                  @click="showCreateBuildingDialog = true"
                />
              </div>
              <div
                v-if="filteredBuildings.length === 0"
                class="text-grey text-center q-pa-lg"
              >
                {{ $t('settingsPage.noItems') }}
              </div>
              <q-list
                v-else
                bordered
                separator
              >
                <SettingsItemBuildings
                  v-for="building in filteredBuildings"
                  :key="building.id"
                  :item="building"
                  :locale="locale"
                  @edit="openEditBuilding"
                  @delete="openDeleteBuilding"
                />
              </q-list>
            </template>
          </template>
        </div>
      </template>
    </q-splitter>

    <CityDialog
      v-model="showCreateCityDialog"
      mode="create"
      @created="onCityCreated"
    />
    <CityDialog
      v-model="showEditCityDialog"
      mode="edit"
      :city="cityToEdit"
      @saved="onCitySaved"
    />

    <q-dialog
      v-model="showDeleteDialog"
      persistent
    >
      <q-card style="min-width: 320px">
        <q-card-section>
          {{ deleteDialogMessage }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            v-if="!hasBuildingsWarning"
            flat
            :label="$t('popUps.cancel')"
            color="grey"
            @click="showDeleteDialog = false"
          />
          <q-btn
            flat
            :label="hasBuildingsWarning ? $t('popUps.ok') : $t('settingsPage.confirm')"
            :color="hasBuildingsWarning ? 'primary' : 'negative'"
            :loading="deleteInProgress"
            @click="onDeleteDialogConfirm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <BuildingDialog
      v-model="showCreateBuildingDialog"
      mode="create"
      :city-id="citiesChoose || 0"
      @created="onBuildingCreated"
    />
    <BuildingDialog
      v-model="showEditBuildingDialog"
      mode="edit"
      :city-id="citiesChoose || 0"
      :building="buildingToEdit"
      @saved="onBuildingSaved"
    />

    <q-dialog
      v-model="showDeleteBuildingDialog"
      persistent
    >
      <q-card style="min-width: 320px">
        <q-card-section>
          <div
            v-if="buildingDeleteAuditoriesLoading"
            class="text-center"
          >
            <q-spinner-dots
              color="primary"
              size="32px"
            />
          </div>
          <template v-else>
            {{ buildingDeleteDialogMessage }}
          </template>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            v-if="!hasBuildingAuditoriesWarning"
            flat
            :label="$t('popUps.cancel')"
            color="grey"
            @click="closeDeleteBuildingDialog"
          />
          <q-btn
            flat
            :label="hasBuildingAuditoriesWarning ? $t('popUps.ok') : $t('popUps.yes')"
            :color="hasBuildingAuditoriesWarning ? 'primary' : 'negative'"
            :loading="buildingDeleteInProgress"
            @click="onDeleteBuildingDialogConfirm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useCitiesStore } from 'src/stores/cities.store'
import {
  useBuildingsInfo,
  useDeleteBuilding,
  getBuildingAuditories,
} from 'src/composables/useGetBuildingsInfo.js'
import { useDeleteCity } from 'src/composables/useGetAuditoriesInfo.js'
import SettingsItemBuildings from 'src/components/SettingsItemBuildings.vue'
import CityDialog from 'src/components/CityDialog.vue'
import BuildingDialog from 'src/components/BuildingDialog.vue'
import TheErrorPopUp from 'src/components/TheErrorPopUp.vue'

const props = defineProps({
  locale: {
    type: String,
    default: 'ru-RU',
  },
})

//const emit = defineEmits(['edit', 'delete'])

const { t } = useI18n()
const $q = useQuasar()
const citiesStore = useCitiesStore()
const { deleteCity } = useDeleteCity()
const { deleteBuilding } = useDeleteBuilding()

const citiesChoose = ref(null)
const splitterModel = ref(30)
const searchQuery = ref('')
const citiesLoading = ref(false)
const showCreateCityDialog = ref(false)
const showEditCityDialog = ref(false)
const showDeleteDialog = ref(false)
const cityToEdit = ref(null)
const deleteInProgress = ref(false)
const showCreateBuildingDialog = ref(false)
const showEditBuildingDialog = ref(false)
const showDeleteBuildingDialog = ref(false)
const buildingToEdit = ref(null)
const buildingToDelete = ref(null)
const buildingDeleteInProgress = ref(false)
const buildingDeleteAuditoriesLoading = ref(false)
const buildingAuditoriesList = ref([])

const buildingsProps = computed(() =>
  citiesChoose.value ? { id: citiesChoose.value } : { id: null },
)

const {
  buildingsInfo: buildingsList,
  error: buildingsError,
  refetch: refetchBuildings,
} = useBuildingsInfo(buildingsProps, '/v1/cities', {
  optionalUrl: 'buildings',
  loading: true,
  notify: true,
})

const citiesOptions = computed(() => {
  if (!citiesStore.loaded) return []
  return citiesStore.cities.map((city) => ({
    label: city[`name_${props.locale}`],
    value: city.id,
  }))
})

const selectedCityName = computed(() => {
  if (!citiesChoose.value) return ''
  const city = citiesStore.findCityById(citiesChoose.value)
  return city ? city[`name_${props.locale}`] : ''
})

const filteredBuildings = computed(() => {
  const buildings = buildingsList.value || []
  const query = (searchQuery.value || '').toString().toLowerCase()
  if (!query) return buildings

  return buildings.filter((building) => {
    const title = (
      building[props.locale]?.title ||
      building['ru-RU']?.title ||
      building['en-US']?.title ||
      ''
    ).toLowerCase()
    return title.includes(query)
  })
})

const hasBuildingsForSelectedCity = computed(() => {
  const list = buildingsList.value || []
  return list.length > 0
})

const hasBuildingsWarning = computed(() => {
  return showDeleteDialog.value && hasBuildingsForSelectedCity.value
})

const deleteDialogMessage = computed(() => {
  if (hasBuildingsWarning.value) {
    return t('settingsPage.cityDeleteBuildingsWarning')
  }
  const city = cityToEdit.value ? citiesStore.findCityById(cityToEdit.value.id) : null
  const name = city
    ? city[`name_${props.locale}`] || city['name_ru-RU'] || city['name_en-US'] || ''
    : ''
  return t('settingsPage.deleteCityConfirm', { name })
})

const hasBuildingAuditoriesWarning = computed(() => {
  return (
    showDeleteBuildingDialog.value &&
    !buildingDeleteAuditoriesLoading.value &&
    buildingAuditoriesList.value.length > 0
  )
})

const buildingDeleteDialogMessage = computed(() => {
  if (hasBuildingAuditoriesWarning.value) {
    return t('settingsPage.buildingDeleteAuditoriesWarning')
  }
  const b = buildingToDelete.value
  const address = b ? b[props.locale]?.title || b['ru-RU']?.title || b['en-US']?.title || '' : ''
  return t('settingsPage.deleteBuildingConfirm', { address })
})

function openEditCity() {
  if (!citiesChoose.value) return
  const city = citiesStore.findCityById(citiesChoose.value)
  if (!city) return
  cityToEdit.value = city
  showEditCityDialog.value = true
}

function openDeleteCity() {
  if (!citiesChoose.value) return
  const city = citiesStore.findCityById(citiesChoose.value)
  if (!city) return
  cityToEdit.value = city
  showDeleteDialog.value = true
}

function openEditBuilding(item) {
  buildingToEdit.value = item
  showEditBuildingDialog.value = true
}

async function openDeleteBuilding(item) {
  buildingToDelete.value = item
  showDeleteBuildingDialog.value = true
  buildingDeleteAuditoriesLoading.value = true
  buildingAuditoriesList.value = []
  try {
    const list = await getBuildingAuditories(citiesChoose.value, item.id)
    buildingAuditoriesList.value = list || []
  } catch {
    buildingAuditoriesList.value = []
  } finally {
    buildingDeleteAuditoriesLoading.value = false
  }
}

function closeDeleteBuildingDialog() {
  showDeleteBuildingDialog.value = false
  buildingToDelete.value = null
  buildingAuditoriesList.value = []
}

async function onDeleteBuildingDialogConfirm() {
  if (hasBuildingAuditoriesWarning.value) {
    closeDeleteBuildingDialog()
    return
  }
  if (!buildingToDelete.value?.id || !citiesChoose.value) return
  buildingDeleteInProgress.value = true
  try {
    await deleteBuilding(citiesChoose.value, buildingToDelete.value.id)
    closeDeleteBuildingDialog()
    refetchBuildings()
    $q.notify({
      message: t('settingsPage.buildingDeleted'),
      color: 'positive',
      icon: 'check',
    })
  } catch (err) {
    $q.notify({
      message: err?.message || t('settingsPage.deleteError'),
      color: 'negative',
      icon: 'error',
    })
  } finally {
    buildingDeleteInProgress.value = false
  }
}

function onBuildingCreated() {
  showCreateBuildingDialog.value = false
  refetchBuildings()
}

function onBuildingSaved() {
  showEditBuildingDialog.value = false
  buildingToEdit.value = null
  refetchBuildings()
}

function onCityCreated() {
  showCreateCityDialog.value = false
  citiesStore.refetchCities()
}

function onCitySaved() {
  showEditCityDialog.value = false
  cityToEdit.value = null
  citiesStore.refetchCities()
}

async function onDeleteDialogConfirm() {
  if (hasBuildingsWarning.value) {
    showDeleteDialog.value = false
    cityToEdit.value = null
    return
  }
  if (!cityToEdit.value?.id) return
  deleteInProgress.value = true
  try {
    await deleteCity(cityToEdit.value.id)
    showDeleteDialog.value = false
    cityToEdit.value = null
    citiesStore.refetchCities()
    $q.notify({
      message: t('settingsPage.cityDeleted'),
      color: 'positive',
      icon: 'check',
    })
  } catch (err) {
    $q.notify({
      message: err?.message || t('settingsPage.deleteError'),
      color: 'negative',
      icon: 'error',
    })
  } finally {
    deleteInProgress.value = false
  }
}

async function loadCities() {
  citiesLoading.value = true
  try {
    await citiesStore.fetchCities()
  } catch (err) {
    console.error('Cities load failed', err)
  } finally {
    citiesLoading.value = false
  }
}

watch(
  citiesOptions,
  (options) => {
    if (options.length > 0 && !citiesChoose.value) {
      citiesChoose.value = options[0].value
    }
  },
  { immediate: true },
)

onMounted(() => {
  loadCities()
})
</script>
