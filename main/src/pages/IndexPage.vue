<template>
  <q-page>
    <div class="q-pa-md column items-center" style="padding: 5% 5%">
      <RoomsFilter class="col-3"
      @search="(value) => filters.search = value"
      @update-floors="(value) => filters.floor = value"
      @update-room="(value) => filters.type = value"/>
      <div class="col" style="width: 100%;">
        <div class="row q-col-gutter-md"
        v-if="filteredRooms.length > 0">
          <div v-for="item in filteredRooms"
            :key="item.id"
            class="col-12 col-sm-6">
            <RoomsInfoCard
              :item="item"
              :occupancy="roomsOccupancy.find(room => room.id === item.id)"
            />
          </div>
        </div>
        <div v-else class="q-pa-md" style="padding: 15%">
            <p class="text-h6 text-grey-8 text-center">
              {{ $t('occupationPage.noRooms') }}
            </p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import RoomsFilter from 'src/components/RoomsFilter.vue'
import RoomsInfoCard from 'src/components/RoomsInfoCard.vue'
import { getRoomsInfo, getOccupancyForAuditories } from 'src/composables/GetMainInfo'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const roomsInfo = ref([])
roomsInfo.value = getRoomsInfo()
const roomsOccupancy = ref([])
roomsOccupancy.value = getOccupancyForAuditories(roomsInfo.value.map(item => item.id))
console.log(roomsOccupancy.value)

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

</script>
