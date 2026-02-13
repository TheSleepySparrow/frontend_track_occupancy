<template>
  <q-dialog
    v-model="localModelValue"
    @update:model-value="updateModelValue"
  >
    <q-card
      class="q-pa-md"
      style="min-width: 50vw; max-width: 50vw; min-height: 80vh"
    >
      <q-card-section class="row items-center">
        <div class="text-h6">{{ $t('editAuditory.title') }}</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div class="q-gutter-y-md">
          <div class="text-center text-h6">{{ localItem[selectedLocale]?.title }}</div>

          <q-tabs
            v-model="activeTab"
            dense
            class="text-center text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
          >
            <q-tab
              name="info"
              :label="$t('editAuditory.tabInfo')"
            />
            <q-tab
              name="cameras"
              :label="$t('editAuditory.tabCameras')"
            />
          </q-tabs>

          <q-separator />

          <q-tab-panels
            v-model="activeTab"
            animated
          >
            <q-tab-panel
              name="info"
              class="q-pa-none"
            >
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
                    :rules="[(val) => !!val || $t('editAuditory.titleRequired')]"
                  />
                </div>

                <q-select
                  v-model="localItem.type"
                  :options="localeTypeOptions"
                  :label="$t('editAuditory.localeType')"
                  filled
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                />

                <q-input
                  v-model.number="localItem.capacity"
                  type="number"
                  :label="$t('editAuditory.capacity')"
                  filled
                  :rules="[(val) => val > 0 || $t('editAuditory.capacityError')]"
                />
                <q-input
                  v-model.number="localItem.floor"
                  type="number"
                  :label="$t('occupationPage.floor')"
                  filled
                />
                <q-input
                  v-model="localItem.img_url"
                  :label="$t('editAuditory.imageUrl')"
                  filled
                />
              </div>
            </q-tab-panel>

            <q-tab-panel
              name="cameras"
              class="q-pa-none"
            >
              <div
                v-if="camerasError"
                class="text-negative"
              >
                {{ camerasError.message }}
              </div>
              <template v-else>
                <div class="text-subtitle2 q-mb-sm">{{ $t('editAuditory.attachedCameras') }}</div>
                <q-list
                  v-if="camerasInfo.length > 0"
                  bordered
                  separator
                  class="q-mb-md"
                >
                  <q-item
                    v-for="camera in camerasInfo"
                    :key="camera.id"
                  >
                    <q-item-section>
                      <q-item-label
                        >{{ $t('editAuditory.cameraId') }}: {{ camera.id }}</q-item-label
                      >
                      <q-item-label caption
                        >{{ $t('editAuditory.cameraMac') }}: {{ camera.mac }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </q-list>
                <div
                  v-else
                  class="text-grey q-mb-md"
                >
                  {{ $t('editAuditory.noCameras') }}
                </div>
                <div class="text-subtitle2 q-mb-sm">{{ $t('settingsPage.attachCamera') }}</div>
                <div
                  v-if="freeCamerasError"
                  class="text-negative q-mb-sm"
                >
                  {{ freeCamerasError.message }}
                </div>
                <q-list
                  v-else-if="freeCamerasList.length > 0"
                  bordered
                  separator
                >
                  <q-item
                    v-for="camera in freeCamerasList"
                    :key="camera.id"
                  >
                    <q-item-section>
                      <q-item-label
                        >{{ $t('editAuditory.cameraId') }}: {{ camera.id }}</q-item-label
                      >
                      <q-item-label caption
                        >{{ $t('editAuditory.cameraMac') }}: {{ camera.mac }}</q-item-label
                      >
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        :label="$t('settingsPage.attach')"
                        color="primary"
                        size="sm"
                        :loading="attachingCameraId === camera.id"
                        @click="attachCamera(camera)"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
                <div
                  v-else-if="!freeCamerasLoading"
                  class="text-grey"
                >
                  {{ $t('settingsPage.noFreeCameras') }}
                </div>
                <div
                  v-else
                  class="text-center q-pa-sm"
                >
                  <q-spinner-dots
                    color="primary"
                    size="24px"
                  />
                </div>
              </template>
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
            @click="onSave"
            :loading="saving"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getRoomTypesInfo } from 'src/composables/GetMainInfo.js'
import { useCamerasInfo, useFreeCamerasInfo } from 'src/composables/useGetCamerasInfo.js'
import {
  useUpdateAuditory,
  useAttachCameraToAuditory,
} from 'src/composables/useGetAuditoriesInfo.js'
import { Notify, Loading } from 'quasar'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  item: {
    type: Object,
    required: true,
  },
  cityId: {
    required: true,
  },
  buildingId: {
    required: true,
  },
})

// const imageUrl = computed(() => `/images/${props.item.id}.jpg`)
const emit = defineEmits(['update:modelValue', 'save'])

const { locale, t } = useI18n()

const localModelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// Create a deep copy of the item for local editing
const localItem = ref(JSON.parse(JSON.stringify(props.item)))

// Watch for prop changes to update local copy
watch(
  () => props.item,
  (newItem) => {
    localItem.value = JSON.parse(JSON.stringify(newItem))
  },
  { deep: true },
)

const selectedLocale = ref(locale.value || 'ru-RU')
const saving = ref(false)
const activeTab = ref('info')

const propsForFetch = computed(() => ({ id: props.item?.id }))
const baseUrl = computed(
  () => `/v1/cities/${props.cityId}/buildings/${props.buildingId}/auditories`,
)
const {
  camerasInfo,
  error: camerasError,
  refetch: refetchAttachedCameras,
} = useCamerasInfo(propsForFetch, baseUrl, { loading: false })
const {
  camerasInfo: freeCamerasInfo,
  error: freeCamerasError,
  loading: freeCamerasLoading,
  reload: reloadFreeCameras,
} = useFreeCamerasInfo({ loading: false, notify: false })
const { updateAuditory } = useUpdateAuditory()
const { attachCamera: attachCameraApi } = useAttachCameraToAuditory()

const freeCamerasList = computed(() => freeCamerasInfo.value || [])
const attachingCameraId = ref(null)

// Locale options
const localeOptions = [
  { label: 'Русский (ru-RU)', value: 'ru-RU' },
  { label: 'English (en-US)', value: 'en-US' },
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
  localItem.value = JSON.parse(JSON.stringify(props.item))
  emit('update:modelValue', false)
}

async function onSave() {
  if (!localItem.value.capacity || localItem.value.capacity <= 0) {
    Notify.create({
      message: t('editAuditory.capacityError'),
      color: 'negative',
      icon: 'error',
    })
    return
  }

  saving.value = true
  Loading.show()

  try {
    const requestBody = {
      floor_number: localItem.value.floor,
      capacity: localItem.value.capacity,
      auditorium_number:
        localItem.value[selectedLocale.value]?.title ?? localItem.value['ru-RU']?.title ?? '',
      type: localItem.value.type,
      image_url: localItem.value.img_url || '',
    }
    await updateAuditory(props.cityId, props.buildingId, localItem.value.id, requestBody)
    Notify.create({
      message: t('editAuditory.saveSuccess'),
      color: 'positive',
      icon: 'check',
    })
    emit('save', localItem.value)
    emit('update:modelValue', false)
  } catch (err) {
    Notify.create({
      message: t('editAuditory.saveError') + ': ' + (err?.message || ''),
      color: 'negative',
      icon: 'error',
    })
  } finally {
    saving.value = false
    Loading.hide()
  }
}

async function attachCamera(camera) {
  if (props.cityId === null || props.buildingId === null || !props.item?.id) return
  attachingCameraId.value = camera.id
  try {
    await attachCameraApi(props.cityId, props.buildingId, props.item.id, camera.id)
    Notify.create({
      message: t('settingsPage.cameraAttachedSuccess'),
      color: 'positive',
      icon: 'check',
    })
    await refetchAttachedCameras()
    await reloadFreeCameras()
  } catch (err) {
    Notify.create({
      message: err?.message || t('settingsPage.attachError'),
      color: 'negative',
      icon: 'error',
    })
  } finally {
    attachingCameraId.value = null
  }
}
</script>
