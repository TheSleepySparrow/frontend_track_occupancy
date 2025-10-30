<template>
  <q-page class="flex flex-center">
    <div style="width: 100%; padding: 5% 5%">
      <RoomsFilter />
      <div class="row q-col-gutter-md">
        <div
          v-for="item in roomsInfo"
          :key="item.id"
          class="col-12 col-sm-6"
        >
          <RoomsInfoCard :item="item" />
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

const roomsInfo = ref([])
roomsInfo.value = getRoomsInfo()
</script>
