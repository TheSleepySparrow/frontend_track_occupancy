<template>
  <q-page class="q-pa-lg">
    <div class="column q-col-gutter-lg">
      <!-- Filter Section -->
      <div class="col-12 col-md-3">
        <q-card class="q-pa-md" flat>
          <RoomsFilter
            :numberOfFloorsOptions="numberOfFloorsOptions"
            @search="(value) => filters.search = value"
            @update-floors="(value) => filters.floor = value"
            @update-room="(value) => filters.type = value"
          />
        </q-card>
      </div>

      <!-- Content Section -->
      <div class="col-12 col-md-9">
        <div v-if="filteredRooms.length > 0" class="row q-col-gutter-md">
          <div
            v-for="item in filteredRooms"
            :key="item.id"
            class="col-12 col-sm-6 col-md-4"
          >
            <RoomsInfoCard 
              :url="occupancyUrl" 
              :item="item" 
              :occupancy="auditoriesOccupancyInfo.find(occupancy => occupancy.id === item.id)"
              :city-id="cityId"
              :building-id="buildingId"
            />
          </div>
        </div>
        <div v-else class="q-pa-md column">
          <q-card flat class="text-center q-pa-xl">
            <p class="text-h6 text-grey-8">
              {{ $t('occupationPage.noRooms') }}
            </p>
          </q-card>
        </div>
        <TheErrorPopUp
          :err="err || errOccupancy"
          :errorPage="'viewOccupancyError'"
          :routeParams="route.params"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import RoomsFilter from 'src/components/RoomsFilter.vue'
import RoomsInfoCard from 'src/components/RoomsInfoCard.vue'
import TheErrorPopUp from 'src/components/TheErrorPopUp.vue'
import { useAuditoriesInfo, useAuditoriesOccupancyInfo } from 'src/composables/useGetAuditoriesInfo'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { locale } = useI18n()
const route = useRoute()
const cityId = computed(() => parseInt(route.params.cityId))
const buildingId = computed(() => parseInt(route.params.buildingId))

const buildingIdRef = computed(() => {
  return { id: buildingId.value }
})
const url = computed(() => {
  return '/v1/cities/' + cityId.value + '/buildings'
})
const occupancyUrl = computed(() => {
  return url.value + '/' + buildingIdRef.value.id + '/auditories'
})

const { auditoriesInfo: roomsInfo, error: err } = useAuditoriesInfo(
  buildingIdRef,
  url,
  {
    optionalUrl: 'auditories',
    loading: true,
    notify: true
  }
)

const { auditoriesOccupancyInfo: auditoriesOccupancyInfo, error: errOccupancy } = useAuditoriesOccupancyInfo(
  buildingIdRef,
  url,
  {
    optionalUrl: 'auditories/occupancy',
    loading: true,
    notify: true
  }
)

const filters = ref({
  search: ref(''),
  floor: ref([]),
  type: ref([])
})

const numberOfFloorsOptions = computed(() => {
  if (!roomsInfo.value || roomsInfo.value.length === 0) {
    return []
  }
  const uniqueFloors = [...new Set(roomsInfo.value.map(room => room.floor))]
    .filter(floor => floor != null)
    .sort((a, b) => a - b)
  
  return uniqueFloors.map(floor => ({
    label: String(floor),
    value: String(floor)
  }))
})

const filteredRooms = computed(() => {
  return roomsInfo.value
  .filter(room =>{
    // 1. Фильтрация по поиску
    return !filters.value.search || room[locale.value].title.toLowerCase().includes(filters.value.search.toString().toLowerCase())
  })
  .filter(room => {
    // 2. Фильтрация по этажу
    return !filters.value.floor || !filters.value.floor.length || (Array.isArray(filters.value.floor) && filters.value.floor.map(item => item.value).includes(String(room.floor)))
  })
  .filter(room => {
    // 3. Фильтрация по типу
    return !filters.value.type || !filters.value.type.length || (Array.isArray(filters.value.type) && filters.value.type.map(item => item.value).includes(room.type))
  })
})
</script>
