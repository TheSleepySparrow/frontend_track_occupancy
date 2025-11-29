<template>
  <q-page class="q-pa-md" style="min-height: 100vh;">
      <div class="row q-gutter-x-md q-mb-md justify-start" style="width: 100%; height: 10%">
          <div class="col">
              <q-select
              v-model="chosenCity"
              :options="cities"
              dense
              outlined
              @update:model-value="onCityChange"
              :display-value="`Город: ${ chosenCity ? chosenCity.label : 'Ничего не выбрано'}`"
              />
          </div>
          <div class="col">
              <q-select
              v-model="chosenBuildingId"
              :options="filteredBuildings"
              dense
              outlined
              use-input
              hide-selected
              fill-input
              input-debounce="200"
              @filter="filterFn"
              >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Ничего не найдено
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
      </div>
      <div class="q-pa-md row q-col-gutter-x-md items-start bg-secondary full-height full-width">
        <div class="col-5">
          <StatisticsFilters
          v-model="filters"
          :report-types="reportTypes"
          @build-chart="buildChart(filters)"/>
        </div>
        <div class="col-grow full-height">
          <StatisticsChart
          :data="chartData"
          :filters-max-show="filters.showMax"
          :filters-min-show="filters.showMin"
          :report-type="filters.reportType"
          :stats="stats"
          />
        </div>
      </div>
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import StatisticsChart from 'src/components/StatisticsChart.vue'
import StatisticsFilters from 'src/components/StatisticsFilters.vue'
import { getBuildingsInfo } from 'src/composables/GetMainInfo.js'
import { getReportTypes } from 'src/api/getStatisticsInfo.js'
import { useCitiesStore } from 'src/stores/cities'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const router = useRouter()
const props = defineProps({
  cityId: { type: Number, required: true },
  slug: { type: String, default: '' }
})

const cityId = computed(() => props.cityId)
const citiesStore = useCitiesStore()
const cities = citiesStore.cities.map(city => { return { label: city[`name_${locale.value}`], value: city.id } })
const chosenCity = ref(null)

const chosenBuildingId = ref(null)
const buildings = computed(() => {
  const buildingsList = computed(() => getBuildingsInfo(parseInt(props.cityId)))
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