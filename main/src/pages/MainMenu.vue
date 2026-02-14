<template>
  <q-page class="column">
    <div
      class="full-width full-height bg-secondary col items-center"
      style="padding: 10% 20%"
    >
      <q-card
        class="q-pa-xl"
        bordered
        style="border-radius: 2rem"
      >
        <q-list>
          <q-item
            v-for="item in menuList"
            :key="item.id"
          >
            <q-btn
              class="full-width bg-primary text-white"
              :disabled="!item.isClickable"
              flat
              @click="item.whatToDo"
              style="border-radius: 1rem; transition: all 0.2s ease; padding: 2%"
            >
              {{ $t(item.text) }}
            </q-btn>
          </q-item>
        </q-list>
      </q-card>
      <TheCitySelectDialog
        v-model="chooseCityDialog"
        @citySelected="handleCitySelect"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TheCitySelectDialog from 'src/components/TheCitySelectDialog.vue'

const router = useRouter()
const chooseCityDialog = ref(false)
const targetRouteName = ref('')

function pushRoute(routeName, parameters) {
  router.push({ name: routeName, params: parameters })
}

function chooseCity(routeName) {
  targetRouteName.value = routeName
  chooseCityDialog.value = true
}

function handleCitySelect(cityId) {
  pushRoute(targetRouteName.value, { cityId: cityId })
}

const text = 'mainMenu'
const menuList = {
  occupancy: {
    id: 1,
    text: text + '.occupancy',
    whatToDo: () => chooseCity('NoOccupancySelected'),
    isClickable: true,
  },
  statistics: {
    id: 2,
    text: text + '.statistics',
    whatToDo: () => chooseCity('viewStatistics'),
    isClickable: true,
  },
  attendance: {
    id: 3,
    text: text + '.attendance',
    whatToDo: () => pushRoute('viewAttendance', {}),
    isClickable: false,
  },
  /* users: {
    id: 4,
    text: text + '.users',
    whatToDo: () => pushRoute('viewUsers', {}),
    isClickable: false,
  }, */
  settings: {
    id: 5,
    text: text + '.settings',
    whatToDo: () => pushRoute('viewSettings', {}),
    isClickable: true,
  },
}
</script>
