<template>
    <q-header elevated>
      <q-toolbar class="bg-primary text-white">
        <q-btn flat dense round
            v-if="isGoBackButtonShown"
            color="secondary"
            icon="arrow_back"
            aria-label="Menu"
            @click="$router.push({ name: 'viewMenu' })"
        />
        <div class="q-gutter-x-sm row items-center no-wrap" style="padding-left: 2%;">
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
          <q-btn flat round icon="question_mark" color="accent" size="sm"
          @click="infoDialogOpen = true">
            <q-tooltip
              transition-show="scale"
              transition-hide="scale">
                {{ $t('settings.infoTooltip') }}
            </q-tooltip>
          </q-btn>
          <q-btn-dropdown
                push flat dense
                color="accent"
                :label="$t(headerText.settings)"
                padding="xs md"
                content-style="background-color: accent"
            >
                <TheSettingsList
                    :languageName="$t(headerText.language)"
                    :themeName="$t(headerText.theme)"
                />
          </q-btn-dropdown>
          <q-btn
              flat dense
              v-if="isLogoutButtonShown"
              icon-right="logout"
              @click="logout" padding="xs md"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-dialog v-model="logoutDialogOpen">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">{{ $t('auth.logoutConfirm') }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('popUps.no')"
            color="primary"
            @click="logoutDialogOpen = false"
          />
          <q-btn
            flat
            :label="$t('popUps.yes')"
            color="primary"
            @click="confirmLogout"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="infoDialogOpen">
      <FeedBackDialog />
    </q-dialog>
</template>

<script setup>
import TheSettingsList from 'src/components/TheSettingsList.vue'
import TheCitySelectDialog from 'src/components/TheCitySelectDialog.vue'
import FeedBackDialog from './FeedBackDialog.vue'
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCitiesStore } from 'src/stores/cities.store'
import { useAuth } from 'src/stores/auth.store'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

const props = defineProps({
  HeaderName: String,
  showBreadcrumbs: {
    type: Boolean,
    default: false
  },
  city: Object,
  buildingName: String,
  defaultRouteName: {
    type: String,
    default: null
  }
})

const router = useRouter()
const route = useRoute()
const citiesStore = useCitiesStore()
const authStore = useAuth()
const { locale, t } = useI18n()
const $q = useQuasar()

const cityDialogOpen = ref(false)
const logoutDialogOpen = ref(false)
const infoDialogOpen = ref(false)

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

  // Use defaultRouteName prop if provided, otherwise use current route name
  const routeName = props.defaultRouteName || currentRoute.name

  router.push({
    name: routeName,
    params: {
      cityId: newCityId,
      slug: slug
    },
    query: currentRoute.query
  })
}

const isGoBackButtonShown = computed(() => {
  const whatRoutes = ['login', 'register', 'viewMenu']
  const areWeThere = whatRoutes.find(el => el === route.name)
  if (areWeThere){ return false }
  return true
})

const isLogoutButtonShown = computed(() => {
  const whatRoutes = ['login', 'register']
  const areWeThere = whatRoutes.find(el => el === route.name)
  if(areWeThere) { return false }
  return true
})

function logout() {
  logoutDialogOpen.value = true
}

async function confirmLogout() {
  logoutDialogOpen.value = false
  try {
    await authStore.logout()
    router.push({ name: 'login' }).then(() => {
      $q.notify({
        message: t('auth.logoutSuccess'),
        color: 'positive',
        position: 'bottom'
      })
    })
  } catch(err) {
    const messageText = 'errorOccured.' + err.statusCode
    const key = t(messageText) ? messageText : 'errorOccured.else'
    $q.notify({
      message: t(key),
      color: 'negative',
      position: 'top'
    })
  }
}
</script>
