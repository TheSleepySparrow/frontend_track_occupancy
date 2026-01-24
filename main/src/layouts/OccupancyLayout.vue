<template>
  <q-layout view="hHh Lpr lFf">
    <TheHeader
      HeaderName="mainMenu.occupancy"
      :showBreadcrumbs="true"
      :city="city"
      :buildingName="currentBuildingName"
      default-route-name="NoOccupancySelected"
    />
    <q-drawer class="bg-secondary" v-model="leftDrawerOpen" show-if-above bordered>
      <div class="q-gutter-y-md text-center" style="padding: 25% 7%; position: relative;">
        <q-btn
          flat
          round
          dense
          icon="close"
          color="white"
          size="md"
          @click="toggleDrawer"
          style="position: absolute; top: 3%; right: 3%;"
        />
        <p class="text-h4 text-white">{{ $t('occupationPage.leftToggleName') }}</p>
        <q-separator spaced size="3px" color="accent"/>
        <!-- Вывод списка зданий -->
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
        <div v-else-if="noBuildings">
          <p class="text-h6 text-white">{{ $t('occupationPage.noBuildings') }}</p>
        </div>
        <q-skeleton v-else type="list" />
        <!-- Обработка ошибки -->
        <TheErrorPopUp :err="err"
          :errorPage="'viewOccupancyError'"
          :routeParams="route.params"
        />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />

    </q-page-container>
    <q-page-sticky position="top-left" :offset="[15, 15]" v-if="!leftDrawerOpen">
      <q-btn
        fab-mini
        icon="menu"
        color="primary"
        @click="toggleDrawer"
      />
    </q-page-sticky>
</q-layout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import TheHeader from '../components/TheHeader.vue'
import { useBuildingsInfo } from 'src/composables/useGetBuildingsInfo.js'
import TheErrorPopUp from 'src/components/TheErrorPopUp.vue'
import { useCitiesStore } from 'src/stores/cities.store'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setLastBuildingId, getLastBuildingId } from 'src/composables/GlobalState.js'

const { locale } = useI18n()

const route = useRoute()
const router = useRouter()
const citiesStore = useCitiesStore()
const chosenBuilding = ref(null)

const cityId = computed(() => parseInt(route.params.cityId))
const city = computed(() =>
  citiesStore.findCityById(cityId.value)
)
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

const leftDrawerOpen = ref(true)
const hasBuildings = computed(() => buildingsList.value.length > 0)
const noBuildings = computed(() => buildingsList.value.length == 0)

const currentBuildingName = computed(() => {
  if (!chosenBuilding.value) return ''
  const building = buildingsList.value.find(b => b.id === chosenBuilding.value)
  if (!building) return ''
  return building[locale.value]?.title || ''
})

watch(() => route.params.buildingId, (newBuildingId) => {
  if (newBuildingId) {
    chosenBuilding.value = parseInt(newBuildingId)
  } else {
    chosenBuilding.value = null
  }
}, { immediate: true })

// Автоматическое перенаправление на последнее выбранное здание
watch([buildingsList, () => route.params.buildingId, cityId],
  ([newBuildingsList, buildingId, currentCityId]) => {
  // Перенаправляем только если:
  // 1. buildingId отсутствует в URL (пользователь на NoOccupancySelected)
  // 2. Список зданий загружен и не пуст
  // 3. Нет ошибки загрузки
  // 4. Есть сохраненное здание для текущего cityId
  if (!buildingId && newBuildingsList && newBuildingsList.length > 0 && !err.value && currentCityId) {
    const savedBuildingId = getLastBuildingId(currentCityId)
    if (savedBuildingId) {
      const buildingExists = newBuildingsList.some(b => b.id === savedBuildingId)
      if (buildingExists) {
        router.push({ name: 'viewOccupancy', params: {
          cityId: parseInt(city.value.id),
          slug: citiesStore.getSlugByCityId(city.value.id),
          buildingId: savedBuildingId
        }})
      }
    }
  }
}, { immediate: true })

function clickBuilding(buildingId) {
  chosenBuilding.value = buildingId
  setLastBuildingId(cityId.value, buildingId)
  router.push({ name: 'viewOccupancy', params: {
    cityId: parseInt(city.value.id),
    slug: citiesStore.getSlugByCityId(city.value.id),
    buildingId: buildingId }
  })
}

function toggleDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>
