<template>
  <div class="col-12">
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <div
          :class="
            $q.dark.isActive
              ? 'q-pa-md text-h6 text-white text-center'
              : 'q-pa-md text-h6 text-primary text-center'
          "
        >
          {{ $t('settingsPage.toolbarCities') }}
        </div>

        <q-separator spaced />

        <q-tabs
          v-model="citiesChoose"
          vertical
          class="text-grey"
          :active-color="$q.dark.isActive ? 'white' : 'primary'"
          dense
          indicator-color="primary"
          align="justify"
        >
          <q-tab
            v-for="city in citiesOptions"
            :key="city.value"
            :name="city.value"
            :label="city.label"
          />
        </q-tabs>

        <q-separator spaced />

        <div class="full-width q-py-xl column items-center">
          <q-btn
            :label="$t('settingsPage.addCityButton')"
            class="col q-ml-sm text-secondary"
            outline
            disable
          />
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div
            v-if="!citiesChoose"
            class="text-grey text-center q-pa-lg"
          >
            {{ $t('settingsPage.selectCity') }}
          </div>
          <template v-else>
            <div
              v-if="citiesLoading"
              class="q-pa-lg text-center"
            >
              <q-spinner-dots
                color="primary"
                size="40px"
              />
            </div>
            <TheErrorPopUp
              v-else-if="buildingsError"
              :err="buildingsError"
              error-page="viewSettings"
              :route-params="{}"
            />
            <template v-else>
              <div class="text-h6 q-mb-md">
                {{ selectedCityName }}
              </div>
              <q-input
                v-model="searchQuery"
                type="search"
                outlined
                dense
                clearable
                clear-icon="close"
                :placeholder="$t('settingsPage.searchPlaceholder')"
                debounce="300"
                class="q-mb-md"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
              <div
                v-if="filteredBuildings.length === 0"
                class="text-grey text-center q-pa-lg"
              >
                {{ $t('settingsPage.noItems') }}
              </div>
              <q-list
                v-else
                bordered
                separator
              >
                <SettingsItemBuildings
                  v-for="building in filteredBuildings"
                  :key="building.id"
                  :item="building"
                  :locale="locale"
                  @edit="(item) => emit('edit', item)"
                  @delete="(item) => emit('delete', item)"
                />
              </q-list>
            </template>
          </template>
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useCitiesStore } from 'src/stores/cities.store'
import { useBuildingsInfo } from 'src/composables/useGetBuildingsInfo.js'
import SettingsItemBuildings from 'src/components/SettingsItemBuildings.vue'
import TheErrorPopUp from 'src/components/TheErrorPopUp.vue'

const props = defineProps({
  locale: {
    type: String,
    default: 'ru-RU',
  },
})

const emit = defineEmits(['edit', 'delete'])

const citiesChoose = ref(null)
const splitterModel = ref(30)
const searchQuery = ref('')
const citiesLoading = ref(false)

const citiesStore = useCitiesStore()

const buildingsProps = computed(() =>
  citiesChoose.value ? { id: citiesChoose.value } : { id: null },
)

const { buildingsInfo: buildingsList, error: buildingsError } = useBuildingsInfo(
  buildingsProps,
  '/v1/cities',
  { optionalUrl: 'buildings', loading: true, notify: true },
)

const citiesOptions = computed(() => {
  if (!citiesStore.loaded) return []
  return citiesStore.cities.map((city) => ({
    label: city[`name_${props.locale}`],
    value: city.id,
  }))
})

const selectedCityName = computed(() => {
  if (!citiesChoose.value) return ''
  const city = citiesStore.findCityById(citiesChoose.value)
  return city ? city[`name_${props.locale}`] : ''
})

const filteredBuildings = computed(() => {
  const buildings = buildingsList.value || []
  const query = (searchQuery.value || '').toString().toLowerCase()
  if (!query) return buildings

  return buildings.filter((building) => {
    const title = (
      building[props.locale]?.title ||
      building['ru-RU']?.title ||
      building['en-US']?.title ||
      ''
    ).toLowerCase()
    return title.includes(query)
  })
})

async function loadCities() {
  citiesLoading.value = true
  try {
    await citiesStore.fetchCities()
  } catch (err) {
    console.error('Cities load failed', err)
  } finally {
    citiesLoading.value = false
  }
}

watch(
  citiesOptions,
  (options) => {
    if (options.length > 0 && !citiesChoose.value) {
      citiesChoose.value = options[0].value
    }
  },
  { immediate: true },
)

onMounted(() => {
  loadCities()
})
</script>
