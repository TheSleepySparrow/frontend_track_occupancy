<template>
    <q-header elevated>
      <q-toolbar class="bg-primary text-white">
        <q-btn flat dense round
            color="secondary"
            icon="arrow_back"
            aria-label="Menu"
            @click="$router.push({ name: 'viewMenu' })"
        />
        <div class="q-gutter-sm row items-center no-wrap">
            <q-toolbar-title>{{ $t(props.HeaderName) }}</q-toolbar-title>
            
            <q-breadcrumbs v-if="props.showBreadcrumbs" class="text-white">
                <q-breadcrumbs-el>
                    <q-btn
                        flat
                        dense
                        :label="cityName"
                        color="white"
                        no-caps
                        padding="xs sm"
                        @click="cityDialogOpen = true"
                    />
                </q-breadcrumbs-el>
                <q-breadcrumbs-el v-if="buildingName" :label="buildingName" />
            </q-breadcrumbs>
            
            <TheCitySelectDialog
                v-model="cityDialogOpen"
                @citySelected="handleCityChange"
            />
        </div>

        <q-space/>

        <div class="q-gutter-sm row items-center no-wrap">
            <q-btn-dropdown
                push flat dense
                color="accent"
                :label="$t(headerText.settings)"
                padding="xs md"
                content-style="background-color: accent"
            >
                <SettingsList
                    :languageName="$t(headerText.language)"
                    :themeName="$t(headerText.theme)"
                />
            </q-btn-dropdown>
            <q-btn
                flat dense
                icon-right="logout"
                :label="$t(headerText.logout)"
                @click="logout" padding="xs md"
            />
        </div>
      </q-toolbar>
    </q-header>
</template>

<script setup>
import SettingsList from 'src/components/SettingsList.vue'
import TheCitySelectDialog from 'src/components/TheCitySelectDialog.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCitiesStore } from 'src/stores/cities.store'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  HeaderName: String,
  showBreadcrumbs: {
    type: Boolean,
    default: false
  },
  city: Object,
  buildingName: String
})

const router = useRouter()
const citiesStore = useCitiesStore()
const { locale } = useI18n()
const cityDialogOpen = ref(false)
const text = 'settings'

const headerText = computed(() => {
    return {
        settings: text + '.settings',
        language: text + '.language',
        theme: text + '.theme',
        logout: text + '.logout'
    }
})

const cityName = computed(() => {
  if (!props.city) return ''
  return props.city[`name_${locale.value}`] || ''
})

function handleCityChange(newCityId) {
  if (!newCityId) return
  const slug = citiesStore.getSlugByCityId(newCityId)
  const currentRoute = router.currentRoute.value
  
  router.push({
    name: currentRoute.name,
    params: {
      cityId: newCityId,
      slug: slug
    },
    query: currentRoute.query
  })
}

function logout() {
  console.log('logout')
}
</script>
