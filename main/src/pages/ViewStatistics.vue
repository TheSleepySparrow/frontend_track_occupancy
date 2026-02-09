<template>
  <q-page class="q-pa-lg">
    <!-- Selection Section -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12">
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
            <div class="col-12 col-md-4">
              <q-select
                v-model="chosenAuditoryId"
                :options="filteredAuditories"
                dense
                outlined
                :label="$t('statistics.auditory')"
                use-input
                behavior="menu"
                hide-selected
                fill-input
                input-debounce="200"
                @filter="filterAuditoriesFn"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      {{ $t('statistics.noAuditoriesFound') }}
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="row q-col-gutter-lg">
      <!-- Filters Section -->
      <div class="col-12 col-md-4 col-lg-3">
        <q-card
          flat
          bordered
          class="q-pa-md"
        >
          <StatisticsFilters
            v-model="filters"
            :report-types="reportTypes"
            :statistics-types="statisticsTypes"
            @build-chart="buildChart"
          />
        </q-card>
      </div>

      <!-- Chart Section -->
      <div class="col-12 col-md-8 col-lg-9">
        <q-card
          flat
          bordered
          class="q-pa-md"
        >
          <StatisticsChart
            :data="chartData"
            :filters-max-show="filters.showMax"
            :filters-min-show="filters.showMin"
            :report-type="filters.reportType?.label || ''"
            :time="filters.dateModel"
            :auditoryInfo="chosenAuditory"
          />
        </q-card>
      </div>
    </div>

    <!-- Error Handling -->
    <!--     <TheErrorPopUp
      :err="error"
      :errorPage="'viewStatisticsError'"
      :routeParams="route.params"
    /> -->
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import StatisticsChart from 'src/components/StatisticsChart.vue'
import StatisticsFilters from 'src/components/StatisticsFilters.vue'
//import TheErrorPopUp from 'src/components/TheErrorPopUp.vue'
import { useBuildingsInfo } from 'src/composables/useGetBuildingsInfo.js'
import { useAuditoriesInfo } from 'src/composables/useGetAuditoriesInfo.js'
import { useStatisticsByDay } from 'src/composables/useGetStatisticsInfo.js'
import { getReportTypes, getStatisticsTypes } from 'src/services/getStatisticsInfo.js'
import { useCitiesStore } from 'src/stores/cities.store'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const { t, locale } = useI18n()
const route = useRoute()
const $q = useQuasar()

// Data for city
const cityId = computed(() => parseInt(route.params.cityId))
const citiesStore = useCitiesStore()

const cities = computed(() =>
  citiesStore.cities.map((city) => ({
    label: city[`name_${locale.value}`],
    value: city.id,
  })),
)
const chosenCity = ref(null)

// Data for buildings
const cityIdRef = computed(() => {
  if (!chosenCity.value?.value) return { id: null }
  return { id: chosenCity.value.value }
})
const { buildingsInfo: buildingsList } = useBuildingsInfo(cityIdRef, '/v1/cities', {
  optionalUrl: 'buildings',
  loading: true,
  notify: true,
})

// Filter buildings
const filteredBuildings = ref([])
const buildings = computed(() => {
  return buildingsList.value.map((building) => {
    return { label: building[locale.value].title, value: building.id }
  })
})
const chosenBuildingId = ref(null)
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

// Data for auditories
const chosenAuditoryId = ref(null)
const auditoriesUrl = computed(() => {
  if (!chosenCity.value?.value) return '/v1/cities'
  return '/v1/cities/' + chosenCity.value.value + '/buildings'
})
const buildingIdRef = computed(() => {
  if (!chosenBuildingId.value?.value) return { id: null }
  return { id: chosenBuildingId.value.value }
})
const auditoriesList = ref([])
const chosenAuditory = computed(() => {
  if (!auditoriesList.value) return null
  if (!chosenAuditoryId.value) return null
  return auditoriesList.value.find((aud) => String(aud.id) === String(chosenAuditoryId.value.value))
})

// Filter auditories
const auditories = computed(() => {
  if (!auditoriesList.value) return []
  return auditoriesList.value.map((auditory) => {
    return { label: auditory[locale.value].title, value: auditory.id }
  })
})
const filteredAuditories = ref([])
function filterAuditoriesFn(val, update) {
  update(() => {
    if (val === '') {
      filteredAuditories.value = auditories.value
      return
    } else {
      const needle = val.toLowerCase()
      filteredAuditories.value = auditories.value.filter(
        (v) => v.label.toLowerCase().indexOf(needle) > -1,
      )
    }
  })
}

// Watch city
watch(
  cityId,
  (newCityId) => {
    if (!newCityId) {
      chosenCity.value = null
      return
    }
    const city = citiesStore.findCityById(newCityId)
    if (city) {
      chosenCity.value = {
        label: city[`name_${locale.value}`],
        value: city.id,
      }
    } else {
      chosenCity.value = null
    }
  },
  { immediate: true },
)

watch(
  cities,
  (newCities) => {
    if (newCities.length > 0 && cityId.value) {
      const city = newCities.find((city) => city.value === cityId.value)
      if (city && !chosenCity.value) {
        chosenCity.value = city
      }
    }
  },
  { immediate: true },
)

// Change city - reset buildings and auditories
function onCityChange(selected) {
  if (!selected?.value) {
    return
  }
  const cityId = selected.value
  const city = citiesStore.findCityById(cityId)
  if (!city) return
  chosenBuildingId.value = null
  chosenAuditoryId.value = null
}

// Watch building - reset auditories
const { auditoriesInfo: auditoriesData } = useAuditoriesInfo(buildingIdRef, auditoriesUrl, {
  optionalUrl: 'auditories',
  loading: true,
  notify: true,
})

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
  if (newBuildingId) {
    chosenAuditoryId.value = null
    filteredAuditories.value = []
  } else {
    chosenAuditoryId.value = null
    auditoriesList.value = []
    filteredAuditories.value = []
  }
})

// Watch auditories - filter auditories
watch(
  auditories,
  (newAuditories) => {
    filteredAuditories.value = newAuditories
  },
  { immediate: true },
)

// Watch buildings - filter buildings
watch(
  buildings,
  (newBuildings) => {
    filteredBuildings.value = newBuildings
  },
  { immediate: true },
)

// Data for report types
const reportTypes = getReportTypes()
const statisticsTypes = getStatisticsTypes()

// Data for filters
const filters = ref({
  reportType: null,
  dateModel: '',
  statisticsType: { label: t(statisticsTypes[0].labelName), value: statisticsTypes[0].value },
  showMax: false,
  showMin: false,
})

const chartRequest = ref(null)
const { statisticsByDay } = useStatisticsByDay(chartRequest, {
  loading: true,
  notify: true,
})

const chartData = ref([])

watch(statisticsByDay, (newVal) => {
  chartData.value = newVal
})

function buildChart() {
  if (
    !chosenCity.value?.value ||
    !chosenBuildingId.value?.value ||
    !chosenAuditoryId.value?.value ||
    !filters.value.dateModel
  ) {
    $q.notify({
      message: t('statistics.warningDataChart'),
      color: 'primary',
      icon: 'warning',
    })
    return
  }
  chartRequest.value = {
    cityId: chosenCity.value.value,
    buildingId: chosenBuildingId.value.value,
    auditoryId: chosenAuditoryId.value.value,
    date: filters.value.dateModel,
    type: filters.value.reportType.value,
    statisticsType: filters.value.statisticsType.value,
  }
}
</script>
