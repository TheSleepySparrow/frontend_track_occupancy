<template>
  <q-layout view="hHh Lpr lFf">
    <TheHeader HeaderName="header"/>
    <q-drawer class="bg-secondary" v-model="leftDrawerOpen" show-if-above bordered>
      <div class="q-gutter-y-md text-center" style="padding: 25% 7%">
        <p class="text-h4 text-white">{{ $t('occupationPage.leftToggleName') }}</p>
        <q-separator spaced size="3px" color="accent"/>
        <q-list v-if="hasBuildings">
          <q-item v-for="building in buildingsList" :key="building.id" clickable>
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
import { ref, computed } from 'vue'
import TheHeader from '../components/TheHeader.vue'
import { getBuildingsInfo } from 'src/composables/GetMainInfo.js'

const buildingsList = ref([])
const leftDrawerOpen = ref(true)
const hasBuildings = computed(() => buildingsList.value.length > 0)
buildingsList.value = getBuildingsInfo()

</script>
