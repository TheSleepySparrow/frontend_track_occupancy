<template>
  <q-page>
    <div class="q-pa-md column items-center" style="padding: 5% 5%">
      <RoomsFilter class="col-3" @search="fillerRooms"/>
      <div class="col" style="width: 100%;">
        <div class="row q-col-gutter-md"
        v-if="filteredRooms.length > 0">
          <div v-for="item in filteredRooms"
            :key="item.id"
            class="col-12 col-sm-6">
            <RoomsInfoCard :item="item" />
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
import { getRoomsInfo } from 'src/composables/GetMainInfo'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const roomsInfo = ref([])
roomsInfo.value = getRoomsInfo()

const filteredRooms =  ref([])
filteredRooms.value = roomsInfo.value

function fillerRooms(search) {
  if (!search) {
    filteredRooms.value = roomsInfo.value
  } else {
    filteredRooms.value = roomsInfo.value.filter((room) => {
      return room[locale.value].title.toLowerCase().includes(search.toString().toLowerCase())
    })
  }
}

</script>
