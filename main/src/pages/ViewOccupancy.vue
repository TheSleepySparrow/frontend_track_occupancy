<template>
  <q-page>
    <div class="q-pa-md column items-center" style="padding: 5% 5%">
      <RoomsFilter class="col-3"
      @search="(value) => filters.search = value"
      @update-floors="(value) => filters.floor = value"
      @update-room="(value) => filters.type = value"/>
      <div class="col" style="width: 100%;">
        <div v-if="loading">
          <q-spinner color="primary" size="3em" />
        </div>
        <div class="row q-col-gutter-md"
        v-else-if="filteredRooms.length > 0">
          <div v-for="item in filteredRooms"
            :key="item.id"
            class="col-12 col-sm-6">
            <RoomsInfoCard
              :item="item"
            /> <!-- :occupancy="roomsOccupancy.find(room => room.id === item.id)" -->
          </div>
        </div>
        <div v-else class="q-pa-md" style="padding: 15%">
            <p class="text-h6 text-grey-8 text-center">
              {{ $t('occupationPage.noRooms') }}
            </p>
        </div>
        <TheErrorPopUp :err="err"
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
import { useAuditoriesInfo } from 'src/composables/useGetAuditoriesInfo'
import { getOccupancyForAuditories } from 'src/composables/GetMainInfo'
import { computed, ref, watch } from 'vue'
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
  return '/api/v1/cities/' + cityId.value + '/buildings'
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

const roomsOccupancy = ref([])
const loading = ref(false)

async function loadOccupancyPercent(roomsInfo) {
  const roomIds = roomsInfo.map(room => room.id)
  const occupancy = getOccupancyForAuditories(roomIds)
  return occupancy
} 

async function loadOccupancyData() {
  const id = parseInt(buildingId)
  if (!id) return
  loading.value = true
  try {
    roomsOccupancy.value = loadOccupancyPercent(roomsInfo.value)
  } catch (err) {
    console.error('Failed to load occupancy data', err)
    roomsOccupancy.value = []
  } finally {
    loading.value = false
  }
}

const filters = ref({
  search: ref(''),
  floor: ref([]),
  type: ref([])
})

const filteredRooms = computed(() => {
  return roomsInfo.value
  .filter(room =>{
    // 1. Фильтрация по поиску
    return !filters.value.search || room[locale.value].title.toLowerCase().includes(filters.value.search.toString().toLowerCase())
  })
  .filter(room => {
    // 2. Фильтрация по этажу
    return !filters.value.floor || !filters.value.floor.length || filters.value.floor.map(item => item.value).includes(String(room.floor))
  })
  .filter(room => 
    // 3. Фильтрация по типу
    !filters.value.type || !filters.value.type.length || filters.value.type.map(item => item.label).includes(room[locale.value].type)
  )
})

watch(() => [buildingId, cityId], () => {
  loadOccupancyData()
}, { immediate: true })
</script>
