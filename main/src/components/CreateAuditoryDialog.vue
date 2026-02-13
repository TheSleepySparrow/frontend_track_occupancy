<template>
  <q-dialog
    v-model="localModelValue"
    @update:model-value="updateModelValue"
  >
    <q-card
      class="q-pa-md"
      style="min-width: 50vw; max-width: 50vw; min-height: 60vh"
    >
      <q-card-section class="row items-center">
        <div class="text-h6">{{ $t('settingsPage.createAuditory') }}</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          @click="onClose"
        />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <q-tabs
          v-model="activeTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab
            name="info"
            :label="$t('editAuditory.tabInfo')"
            :disable="stepDone"
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
            class="q-pa-none q-pt-md"
          >
            <div class="q-gutter-y-md">
              <q-input
                v-model="form.auditorium_number"
                :label="$t('editAuditory.titleInput')"
                filled
                :rules="[(val) => !!val || $t('editAuditory.titleRequired')]"
              />
              <q-select
                v-model="form.type"
                :options="localeTypeOptions"
                :label="$t('editAuditory.localeType')"
                filled
                option-value="value"
                option-label="label"
                emit-value
                map-options
              />
              <q-input
                v-model.number="form.capacity"
                type="number"
                :label="$t('editAuditory.capacity')"
                filled
                :rules="[(val) => val > 0 || $t('editAuditory.capacityError')]"
              />
              <q-input
                v-model.number="form.floor_number"
                type="number"
                :label="$t('occupationPage.floor')"
                filled
              />
              <div class="q-gutter-y-sm">
                <div class="text-caption text-grey">{{
                  $t('editAuditory.choosePhotoFromDevice')
                }}</div>
                <div class="column q-gutter-y-sm items-center">
                  <q-uploader
                    v-model="uploaderFiles"
                    class="col-5 full-width"
                    :max-files="1"
                    accept="image/*"
                    :label="$t('editAuditory.imagesOnly')"
                    batch
                    flat
                    bordered
                    @added="onFileAdded"
                    @removed="onFileRemoved"
                  />
                  <q-input
                    v-model="form.image_url"
                    class="col full-width"
                    :label="$t('editAuditory.imageUrl')"
                    filled
                    dense
                  />
                </div>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel
            name="cameras"
            class="q-pa-none q-pt-md"
          >
            <div
              v-if="freeCamerasError"
              class="text-negative"
            >
              {{ freeCamerasError.message }}
            </div>
            <div
              v-else-if="freeCamerasLoading"
              class="text-center q-pa-md"
            >
              <q-spinner-dots
                color="primary"
                size="32px"
              />
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
                  <q-item-label>{{ $t('editAuditory.cameraId') }}: {{ camera.id }}</q-item-label>
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
              v-else
              class="text-grey"
            >
              {{ $t('settingsPage.noFreeCameras') }}
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-card-actions align="right">
        <template v-if="activeTab === 'info'">
          <q-btn
            :label="$t('popUps.cancel')"
            color="grey"
            flat
            @click="onClose"
          />
          <q-btn
            :label="$t('settingsPage.next')"
            color="primary"
            :loading="creating"
            :disable="!canGoNext"
            @click="onNext"
          />
        </template>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Notify } from 'quasar'
import { getRoomTypesInfo } from 'src/composables/GetMainInfo.js'
import {
  useCreateAuditory,
  useAttachCameraToAuditory,
} from 'src/composables/useGetAuditoriesInfo.js'
import { useFreeCamerasInfo } from 'src/composables/useGetCamerasInfo.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  cityId: {
    type: Number,
    default: null,
  },
  buildingId: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'created'])

const { locale, t } = useI18n()
const { createAuditory } = useCreateAuditory()
const { attachCamera: attachCameraApi } = useAttachCameraToAuditory()
const {
  camerasInfo: freeCamerasInfo,
  error: freeCamerasError,
  loading: freeCamerasLoading,
  reload: reloadFreeCameras,
} = useFreeCamerasInfo({ loading: false, notify: false })

const localModelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const activeTab = ref('info')
const stepDone = ref(false)
const createdAuditoryId = ref(null)
const creating = ref(false)
const attachingCameraId = ref(null)

const form = ref({
  auditorium_number: '',
  floor_number: 0,
  capacity: 0,
  type: null,
  image_url: '',
})
const uploaderFiles = ref([])
const previewObjectUrl = ref(null)

function onFileAdded(info) {
  const files = Array.isArray(info) ? info : info?.files || []
  const file = files[0]
  if (file) {
    if (previewObjectUrl.value) URL.revokeObjectURL(previewObjectUrl.value)
    previewObjectUrl.value = URL.createObjectURL(file)
    form.value.image_url = file.name
  }
}

function onFileRemoved() {
  if (previewObjectUrl.value) {
    URL.revokeObjectURL(previewObjectUrl.value)
    previewObjectUrl.value = null
  }
  form.value.image_url = ''
}

const localeTypeOptions = computed(() => {
  const roomTypes = getRoomTypesInfo()
  return roomTypes[locale.value] || roomTypes['ru-RU'] || []
})

const freeCamerasList = computed(() => freeCamerasInfo.value || [])
const canGoNext = computed(() => {
  const f = form.value
  return f.auditorium_number && f.capacity > 0 && f.type
})

function updateModelValue(value) {
  emit('update:modelValue', value)
}

function resetState() {
  activeTab.value = 'info'
  stepDone.value = false
  createdAuditoryId.value = null
  uploaderFiles.value = []
  if (previewObjectUrl.value) {
    URL.revokeObjectURL(previewObjectUrl.value)
    previewObjectUrl.value = null
  }
  form.value = {
    auditorium_number: '',
    floor_number: 0,
    capacity: 0,
    type: null,
    image_url: '',
  }
}

function onClose() {
  const wasCreated = stepDone.value
  resetState()
  emit('update:modelValue', false)
  if (wasCreated) emit('created')
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) resetState()
  },
)

async function onNext() {
  if (!canGoNext.value || props.cityId === null || props.buildingId === null) return
  creating.value = true
  try {
    const body = {
      auditorium_number: form.value.auditorium_number,
      floor_number: Number(form.value.floor_number) || 0,
      capacity: Number(form.value.capacity) || 0,
      type: form.value.type,
      type_ru:
        form.value.type === 'lecture_hall'
          ? 'лекционная'
          : form.value.type === 'coworking'
            ? 'коворкинг'
            : 'учебная',
      image_url: form.value.image_url || '',
    }
    const result = await createAuditory(props.cityId, props.buildingId, body)
    const id = result?.id ?? result?.data?.id
    if (id !== null) {
      createdAuditoryId.value = id
      stepDone.value = true
      await reloadFreeCameras()
      activeTab.value = 'cameras'
    } else {
      Notify.create({ message: t('settingsPage.createError'), color: 'negative', icon: 'error' })
    }
  } catch (err) {
    Notify.create({
      message: err?.message || t('settingsPage.createError'),
      color: 'negative',
      icon: 'error',
    })
  } finally {
    creating.value = false
  }
}

async function attachCamera(camera) {
  if (createdAuditoryId.value === null || props.cityId === null || props.buildingId === null) return
  attachingCameraId.value = camera.id
  try {
    await attachCameraApi(props.cityId, props.buildingId, createdAuditoryId.value, camera.id)
    Notify.create({
      message: t('settingsPage.cameraAttachedSuccess'),
      color: 'positive',
      icon: 'check',
    })
    emit('created')
    emit('update:modelValue', false)
    resetState()
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
