<template>
  <q-layout view="hHh Lpr lFf">
    <TheHeader HeaderName="mainMenu.occupancy"/>
    <q-drawer class="bg-secondary" v-model="leftDrawerOpen" show-if-above bordered>
      <div class="q-gutter-y-md text-center" style="padding: 25% 7%">
        <p class="text-h4 text-white">{{ $t('occupationPage.leftToggleName') }}</p>
        <q-separator spaced size="3px" color="accent"/>
        <q-list v-if="hasBuildings">
          <q-item v-for="building in buildingsList"
            :key="building.id"
            :clickable="true"
            :active="building.id == chosenBuilding"
            active-class="bg-primary"
            style="border-radius: 1rem;"
            v-ripple
            @click="clickBuilding(building.id)"
          >
            <q-item-section>
              <q-item-label lines="1" class="text-h6 text-white">
                {{ building[$i18n.locale].title }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-skeleton v-else type="list" />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import TheHeader from '../components/TheHeader.vue'
import { getBuildingsInfo } from 'src/composables/GetMainInfo.js'
import { useCitiesStore } from 'src/stores/cities'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const citiesStore = useCitiesStore()
const chosenBuilding = ref(null)

const city = computed(() => 
  citiesStore.findCityById(parseInt(route.params.cityId))
)

const buildingsList = ref([])
const leftDrawerOpen = ref(true)
const hasBuildings = computed(() => buildingsList.value.length > 0)

function loadBuildings() {
  buildingsList.value = getBuildingsInfo(parseInt(route.params.cityId))
}

function clickBuilding(buildingId) {
  chosenBuilding.value = buildingId
  router.push({ name: 'viewOccupancy', params: { 
    cityId: parseInt(city.value.id),
    slug: citiesStore.getSlugByCityId(city.value.id),
    buildingId: buildingId }
  })
}

watch(() => city.value, () => {
  loadBuildings()
}, { immediate: true })

</script>
