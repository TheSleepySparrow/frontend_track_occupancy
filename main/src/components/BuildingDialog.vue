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
            mode === 'create'
              ? $t('settingsPage.addBuildingButton')
              : $t('settingsPage.editBuilding')
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
            v-model="form.address_ru"
            :label="$t('settingsPage.addressRu')"
            filled
            :rules="[(val) => !!val || $t('editAuditory.titleRequired')]"
          />
          <q-input
            v-model="form.address_en"
            :label="$t('settingsPage.addressEn')"
            filled
            :rules="[(val) => !!val || $t('editAuditory.titleRequired')]"
          />
          <q-input
            v-model.number="form.floor_count"
            type="number"
            :label="$t('settingsPage.floorCount')"
            filled
            :rules="[(val) => (val != null && val >= 0) || $t('editAuditory.titleRequired')]"
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
import { useCreateBuilding, useUpdateBuilding } from 'src/composables/useGetBuildingsInfo.js'

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
  cityId: {
    type: Number,
    required: true,
  },
  building: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'created', 'saved'])

const { t } = useI18n()
const $q = useQuasar()
const { createBuilding } = useCreateBuilding()
const { updateBuilding } = useUpdateBuilding()

const localModelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const form = ref({ address_ru: '', address_en: '', floor_count: null })
const submitInProgress = ref(false)

function updateModelValue(val) {
  emit('update:modelValue', val)
}

function resetForm() {
  form.value = { address_ru: '', address_en: '', floor_count: null }
}

watch(
  () => [props.modelValue, props.mode, props.building],
  () => {
    if (props.modelValue) {
      if (props.mode === 'edit' && props.building) {
        form.value = {
          address_ru: props.building['ru-RU']?.title || '',
          address_en: props.building['en-US']?.title || '',
          floor_count: props.building.floorNumber ?? null,
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
  const { address_ru, address_en, floor_count } = form.value
  if (!address_ru?.trim() || !address_en?.trim() || (floor_count !== null && floor_count < 0))
    return
  const fc = floor_count !== null && floor_count >= 0 ? parseInt(floor_count, 10) : 0
  if (Number.isNaN(fc)) return

  submitInProgress.value = true
  try {
    const body = {
      address_ru: address_ru.trim(),
      address_en: address_en.trim(),
      floor_count: fc,
    }

    if (props.mode === 'create') {
      await createBuilding(props.cityId, body)
      $q.notify({
        message: t('settingsPage.buildingCreated'),
        color: 'positive',
        icon: 'check',
      })
      emit('created')
    } else if (props.mode === 'edit' && props.building?.id !== null) {
      await updateBuilding(props.cityId, props.building.id, body)
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
