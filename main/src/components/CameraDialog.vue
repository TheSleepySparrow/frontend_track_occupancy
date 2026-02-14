<template>
  <q-dialog
    v-model="localModelValue"
    persistent
    @update:model-value="updateModelValue"
  >
    <q-card
      class="q-pa-md"
      style="min-width: 400px"
    >
      <q-card-section class="row items-center">
        <div class="text-h6">
          {{
            mode === 'create' ? $t('settingsPage.addCameraButton') : $t('settingsPage.editCamera')
          }}
        </div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-y-md">
          <q-input
            v-model="form.mac"
            :label="$t('settingsPage.macAddress')"
            filled
            :rules="[(val) => !!val || $t('editAuditory.titleRequired')]"
          />
          <q-input
            v-if="mode === 'edit'"
            v-model="form.ip"
            :label="$t('settingsPage.ipAddress')"
            filled
            :rules="[(val) => !!val || $t('editAuditory.titleRequired')]"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('popUps.cancel')"
          color="grey"
          @click="onCancel"
        />
        <q-btn
          :label="mode === 'create' ? $t('settingsPage.add') : $t('settingsPage.updateCity')"
          color="primary"
          :loading="submitInProgress"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useCreateCamera, useUpdateCamera } from 'src/composables/useGetCamerasInfo.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    validator: (v) => v === 'create' || v === 'edit',
    default: 'create',
  },
  camera: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'created', 'saved'])

const { t } = useI18n()
const $q = useQuasar()
const { createCamera } = useCreateCamera()
const { updateCamera } = useUpdateCamera()

const localModelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const form = ref({ mac: '', ip: '' })
const submitInProgress = ref(false)

function updateModelValue(val) {
  emit('update:modelValue', val)
}

function resetForm() {
  form.value = { mac: '', ip: '' }
}

watch(
  () => [props.modelValue, props.mode, props.camera],
  () => {
    if (props.modelValue) {
      if (props.mode === 'edit' && props.camera) {
        form.value = {
          mac: props.camera.mac || '',
          ip: props.camera.ip || '',
        }
      } else {
        resetForm()
      }
    }
  },
  { immediate: true },
)

function onCancel() {
  localModelValue.value = false
}

async function onSubmit() {
  const { mac } = form.value
  if (!mac?.trim()) return

  submitInProgress.value = true
  try {
    if (props.mode === 'create') {
      await createCamera({ mac: mac.trim() })
      $q.notify({
        message: t('settingsPage.cameraCreated'),
        color: 'positive',
        icon: 'check',
      })
      emit('created')
    } else if (props.mode === 'edit' && props.camera?.id !== null) {
      const { ip } = form.value
      if (!ip?.trim()) return
      await updateCamera(props.camera.id, { mac: mac.trim(), ip: ip.trim() })
      emit('saved')
    }
    localModelValue.value = false
  } catch (err) {
    $q.notify({
      message: err?.message || t('settingsPage.deleteError'),
      color: 'negative',
      icon: 'error',
    })
    localModelValue.value = false
  } finally {
    submitInProgress.value = false
  }
}
</script>
