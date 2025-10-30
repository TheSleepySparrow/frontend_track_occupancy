<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-primary text-white">
        <q-btn flat dense round
        color="secondary"
        icon="arrow_back"
        aria-label="Menu"/>
        <q-toolbar-title>{{ $t('headerName') }}</q-toolbar-title>

        <q-space/>

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn-dropdown push flat dense
          color="accent"
          :label="$t('settings')"
          padding="xs md"
          content-style="background-color: accent">
            <SettingsList/>
          </q-btn-dropdown>
          <q-btn flat dense
          icon-right="logout"
          :label="$t('logout')"
          @click="logout" padding="xs md"/>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer class="bg-secondary" v-model="leftDrawerOpen" show-if-above bordered>
      <div class="q-gutter-y-md text-center" style="padding: 25% 7%">
        <p class="text-h4 text-white">{{ $t('leftToggleName') }}</p>
        <q-separator spaced size="3px" color="accent"/>
        <q-list v-if="hasBuildings">
          <q-item v-for="building in buildingsList" :key="building.id" clickable>
            <q-item-section>
              <q-item-label lines="1" class="text-h6 text-white">
                {{ building[locale === 'en-US' ? 'en_US' : 'ru_RU'].title }}
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
import { useI18n } from 'vue-i18n'
import SettingsList from 'src/components/SettingsList.vue'
import { getBuildingsInfo } from 'src/composables/GetMainInfo.js'

const buildingsList = ref([])
const leftDrawerOpen = ref(true)
const { locale } = useI18n()
const hasBuildings = computed(() => buildingsList.value.length > 0)
buildingsList.value = getBuildingsInfo()

function logout() {
  console.log('logout')
}
</script>
