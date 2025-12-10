<template>
  <q-page class="q-pa-lg">
    <!-- Selection Section -->
    <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-md-6">
          <q-card flat bordered class="q-pa-sm">
            <q-select
              v-model="chosenCity"
              :options="cities"
              dense
              outlined
              :label="$t('statistics.city')"
              @update:model-value="onCityChange"
            />
          </q-card>
        </div>
        <div class="col-12 col-md-6">
          <q-card flat bordered class="q-pa-sm">
            <q-select
              v-model="chosenBuildingId"
              :options="filteredBuildings"
              dense
              outlined
              :label="$t('statistics.building')"
              use-input
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
          </q-card>
        </div>
    </div>

    <!-- Main Content Section -->
    <div class="row q-col-gutter-lg">
      <!-- Filters Section -->
      <div class="col-12 col-md-4 col-lg-3">
        <q-card flat bordered class="q-pa-md">
          <StatisticsFilters
            v-model="filters"
            :report-types="reportTypes"
            @build-chart="buildChart"
          />
        </q-card>
      </div>

      <!-- Chart Section -->
      <div class="col-12 col-md-8 col-lg-9">
        <q-card flat bordered class="q-pa-md">
          <StatisticsChart
            :data="chartData"
            :filters-max-show="filters.showMax"
            :filters-min-show="filters.showMin"
            :report-type="filters.reportType"
            :stats="stats"
          />
        </q-card>
      </div>
    </div>

    <!-- Error Handling -->
    <TheErrorPopUp
      :err="err"
      :errorPage="'viewOccupancyError'"
      :routeParams="route.params"
    />
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import StatisticsChart from 'src/components/StatisticsChart.vue'
import StatisticsFilters from 'src/components/StatisticsFilters.vue'
import TheErrorPopUp from 'src/components/TheErrorPopUp.vue'
import { useBuildingsInfo } from 'src/composables/useGetBuildingsInfo.js'
import { getReportTypes } from 'src/services/getStatisticsInfo.js'
import { useCitiesStore } from 'src/stores/cities.store'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const router = useRouter()
const route = useRoute()

const cityId = computed(() => parseInt(route.params.cityId))
const citiesStore = useCitiesStore()

const cities = computed(() => 
  citiesStore.cities.map(city => ({ 
    label: city[`name_${locale.value}`], 
    value: city.id 
  }))
)

const chosenCity = ref(null)
const buildingsProps = computed(() => ({ id: cityId.value }))

const { buildingsInfo: buildingsList, error: err } = useBuildingsInfo(
  buildingsProps,
  '/v1/cities',
  {
    optionalUrl: 'buildings',
    loading: true,
    notify: true
  }
)

const chosenBuildingId = ref(null)
const buildings = computed(() => {
  return buildingsList.value.map(building => {
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
        v => v.label.toLowerCase().indexOf(needle) > -1
      )
    }
  })
}

watch(cityId, (newCityId) => {
  if (!newCityId) {
    chosenCity.value = null
    return
  }
  const city = citiesStore.findCityById(newCityId)
  if (city) {
    chosenCity.value = {
      label: city[`name_${locale.value}`],
      value: city.id
    }
  } else {
    chosenCity.value = null
  }
}, { immediate: true })

function onCityChange(selected) {
  if (!selected?.value) {
    return
  }
  const cityId = selected.value
  const city = citiesStore.findCityById(cityId)
  if (!city) return
  chosenBuildingId.value = null
  const cityNameSlug = citiesStore.getSlugByCityId(cityId)
  router.push({ name: 'viewStatistics', params: { cityId, slug: cityNameSlug } })
}

const reportTypes = getReportTypes()
const filters = ref({
  reportType: '',
  month: '',
  monthModel: '',
  showMax: true,
  showMin: true
})

const chartData = ref([])
const stats = ref({
  maxValue: 0,
  maxDate: '',
  minValue: 0,
  minDate: '',
  avgValue: 0
})

function buildChart(updatedFilters) {
  if (!updatedFilters) return
  
  const daysInMonth = 30
  chartData.value = Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, '0')
    const value = Math.floor(Math.random() * 100) + 10
    return { date: `${day}.11`, value }
  })

  const values = chartData.value.map(d => d.value)
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length

  const maxItem = chartData.value.find(d => d.value === maxValue)
  const minItem = chartData.value.find(d => d.value === minValue)

  stats.value = {
    maxValue,
    maxDate: maxItem?.date || '',
    minValue,
    minDate: minItem?.date || '',
    avgValue
  }

  filters.value = { ...updatedFilters }
}
</script>