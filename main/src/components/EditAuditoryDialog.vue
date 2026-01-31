<template>
  <q-dialog v-model="localModelValue" @update:model-value="updateModelValue">
    <q-card class="q-pa-md" style="min-width: 50vw; max-width: 50vw; min-height: 80vh;">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ $t('editAuditory.title') }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div class="q-gutter-y-md">
          <q-card flat bordered class="q-px-md">
            <q-img
              :src="imageUrl"
              :alt="localItem[selectedLocale]?.title"
              style="height: 30%"
            >
            </q-img>
          </q-card>
          <div class="text-center text-h6">{{ localItem[selectedLocale]?.title }}</div>

          <q-tabs v-model="activeTab"
          dense
          class="text-center text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify">
            <q-tab name="info" :label="$t('editAuditory.tabInfo')" />
            <q-tab name="cameras" :label="$t('editAuditory.tabCameras')" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeTab" animated>
            <q-tab-panel name="info" class="q-pa-none">
              <div class="q-gutter-y-md">
                <div class="row q-gutter-x-xs">
                  <q-select
                    v-model="selectedLocale"
                    class="col-4"
                    :options="localeOptions"
                    :label="$t('editAuditory.locale')"
                    filled
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                  />

                  <q-input
                    v-model="localItem[selectedLocale].title"
                    class="col"
                    :label="$t('editAuditory.titleInput')"
                    filled
                    readonly
                    :rules="[val => !!val || $t('editAuditory.titleRequired')]"
                  />
                </div>

                <q-select
                  v-model="localItem[selectedLocale].type"
                  :options="localeTypeOptions"
                  :label="$t('editAuditory.localeType')"
                  filled
                  readonly
                  option-value="label"
                  option-label="label"
                  emit-value
                  map-options
                />

                <q-input
                  v-model="localItem.capacity"
                  type="number"
                  :label="$t('editAuditory.capacity')"
                  filled
                  readonly
                  :rules="[val => val > 0 || $t('editAuditory.capacityError')]"
                />
                <q-input
                  v-model="localItem.floor"
                  type="number"
                  :label="$t('occupationPage.floor')"
                  filled
                  readonly
                />
                <q-input
                  v-model="localItem.img_url"
                  :label="$t('editAuditory.imageUrl')"
                  filled
                  readonly
                />
              </div>
            </q-tab-panel>

            <q-tab-panel name="cameras" class="q-pa-none">
              <div v-if="camerasError" class="text-negative">
                {{ camerasError.message }}
              </div>
              <q-list v-else-if="camerasInfo.length > 0" bordered separator>
                <q-item v-for="camera in camerasInfo" :key="camera.id">
                  <q-item-section>
                    <q-item-label>{{ $t('editAuditory.cameraId') }}: {{ camera.id }}</q-item-label>
                    <q-item-label caption>{{ $t('editAuditory.cameraMac') }}: {{ camera.mac }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <div v-else class="text-grey">
                {{ $t('editAuditory.noCameras') }}
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </q-card-section>

      <q-card-actions align="right">
          <div class="q-gutter-x-md q-mt-lg">
            <q-btn
              :label="$t('popUps.cancel')"
              color="grey"
              flat
              @click="onCancel"
            />
            <q-btn
              :label="$t('popUps.save')"
              color="primary"
              type="submit"
              disable
              @click="onSave"
              :loading="saving"
            >
            <q-tooltip>{{ $t('popUps.saveTooltip') }}</q-tooltip>
            </q-btn>
          </div>
        </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { putResponse } from 'src/services/api.js'
import { getRoomTypesInfo } from 'src/composables/GetMainInfo.js'
import { useCamerasInfo } from 'src/composables/useGetCamerasInfo.js'
import { Notify, Loading } from 'quasar'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  item: {
    type: Object,
    required: true
  },
  cityId: {
    required: true
  },
  buildingId: {
    required: true
  }
})

const imageUrl = computed(() => `src/assets/images/${props.item.id}.jpg`)
const emit = defineEmits(['update:modelValue', 'save'])

const { locale, t } = useI18n()

const localModelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Create a deep copy of the item for local editing
const localItem = ref(JSON.parse(JSON.stringify(props.item)))

// Watch for prop changes to update local copy
watch(() => props.item, (newItem) => {
  localItem.value = JSON.parse(JSON.stringify(newItem))
}, { deep: true })

const selectedLocale = ref(locale.value || 'ru-RU')
const saving = ref(false)
const activeTab = ref('info')

const propsForFetch = computed(() => ({ id: props.item?.id }))
const baseUrl = computed(() => `/v1/cities/${props.cityId}/buildings/${props.buildingId}/auditories`)
const { camerasInfo, error: camerasError } = useCamerasInfo(propsForFetch, baseUrl, { loading: false })

// Locale options
const localeOptions = [
  { label: 'Русский (ru-RU)', value: 'ru-RU' },
  { label: 'English (en-US)', value: 'en-US' }
]

// Locale-specific type options
const localeTypeOptions = computed(() => {
  const roomTypes = getRoomTypesInfo()
  return roomTypes[selectedLocale.value] || []
})

function updateModelValue(value) {
  emit('update:modelValue', value)
}

function onCancel() {
  // Reset to original item
  localItem.value = JSON.parse(JSON.stringify(props.item))
  emit('update:modelValue', false)
}

async function onSave() {
  if (!localItem.value.capacity || localItem.value.capacity <= 0) {
    Notify.create({
      message: t('editAuditory.capacityError'),
      color: 'negative',
      icon: 'error'
    })
    return
  }

  saving.value = true
  Loading.show()

  try {
    // Prepare the request body according to API structure
    const requestBody = {
      type: localItem.value.type, // English value (lecture_hall, classroom, coworking)
      capacity: localItem.value.capacity,
      image_url: localItem.value.img_url || '',
      floor_number: localItem.value.floor,
      ru: {
        title: localItem.value['ru-RU'].title,
        type: localItem.value['ru-RU'].type // Localized label
      },
      en: {
        title: localItem.value['en-US'].title,
        type: localItem.value['en-US'].type // Localized label
      }
    }

    const apiUrl = `/v1/cities/${props.cityId}/buildings/${props.buildingId}/auditories/${localItem.value.id}`
    const result = await putResponse(apiUrl, requestBody)

    Notify.create({
      message: t('editAuditory.saveSuccess'),
      color: 'positive',
      icon: 'check'
    })
    console.log(result)
    // Emit save event with updated item
    emit('save', localItem.value)
    emit('update:modelValue', false)
  } catch (error) {
    console.error('Error saving auditory:', error)
    Notify.create({
      message: t('editAuditory.saveError') + ': ' + (error.message || 'Unknown error'),
      color: 'negative',
      icon: 'error'
    })
  } finally {
    saving.value = false
    Loading.hide()
  }
}
</script>
