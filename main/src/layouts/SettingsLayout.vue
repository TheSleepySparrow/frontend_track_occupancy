<template>
  <q-layout view="hHh Lpr lFf">
    <TheHeader
      HeaderName="mainMenu.settings"
      :showBreadcrumbs="false"
      :city="null"
      :buildingName="null"
      default-route-name="viewSettings"
    />
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-scroll-area
        class="q-pa-md"
        style="height: calc(100vh - 50px)"
      >
        <q-toolbar :class="$q.dark.isActive ? 'text-white' : 'text-primary'">
          <q-toolbar-title>{{ $t('settingsPage.toolbar') }}</q-toolbar-title>
        </q-toolbar>
        <q-list class="q-pa-sm items-center">
          <div
            v-for="settingsOption in menuItems"
            :key="settingsOption.name"
          >
            <q-separator spaced />
            <q-item-label header>
              {{ $t(settingsOption.label) }}
            </q-item-label>
            <q-item
              v-for="item in settingsOption.list"
              :key="item.routeName"
              :active="route.name === item.routeName"
              active-class="bg-secondary text-white"
              clickable
              v-ripple
              class="q-mb-sm"
              style="border-radius: 0.5rem"
              @click="navigateTo(item.routeName)"
            >
              <q-item-section>
                <q-item-label class="text-weight-medium">
                  {{ $t(item.label) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-page-sticky
      v-if="!leftDrawerOpen"
      position="top-left"
      :offset="[15, 15]"
    >
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
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TheHeader from 'src/components/TheHeader.vue'

const route = useRoute()
const router = useRouter()
const leftDrawerOpen = ref(true)

const menuItems = [
  {
    name: 'mainEntities',
    label: 'settingsPage.entitiesGroups.mainEntities',
    list: [
      { routeName: 'viewSettingsCitiesAndBuildings', label: 'settingsPage.entities.cities' },
      { routeName: 'viewSettingsAuditories', label: 'settingsPage.entities.auditories' },
      { routeName: 'viewSettingsCameras', label: 'settingsPage.entities.cameras' },
    ],
  },
  {
    name: 'otherSettings',
    label: 'settingsPage.entitiesGroups.other',
    list: [{ routeName: 'viewSettingsTheme', label: 'settingsPage.entities.theme' }],
  },
]

function navigateTo(routeName) {
  router.push({ name: routeName })
}

function toggleDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
