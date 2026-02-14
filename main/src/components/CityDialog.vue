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
          {{ mode === 'create' ? $t('settingsPage.addCityButton') : $t('settingsPage.editCity') }}
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
            v-model="form.name_ru"
            :label="$t('settingsPage.nameRu')"
            filled
            :rules="[(val) => !!val || $t('editAuditory.titleRequired')]"
          />
          <q-input
            v-model="form.name_en"
            :label="$t('settingsPage.nameEn')"
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
          :label="mode === 'create' ? $t('settingsPage.createCity') : $t('settingsPage.updateCity')"
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
import { useCreateCity, useUpdateCity } from 'src/composables/useGetAuditoriesInfo.js'

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
  city: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'created', 'saved'])

const { createCity } = useCreateCity()
const { updateCity } = useUpdateCity()

const localModelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const form = ref({ name_ru: '', name_en: '' })
const submitInProgress = ref(false)

function updateModelValue(val) {
  emit('update:modelValue', val)
}

function resetForm() {
  form.value = { name_ru: '', name_en: '' }
}

watch(
  () => [props.modelValue, props.mode, props.city],
  () => {
    if (props.modelValue) {
      if (props.mode === 'edit' && props.city) {
        form.value = {
          name_ru: props.city['name_ru-RU'] || '',
          name_en: props.city['name_en-US'] || '',
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
  const { name_ru, name_en } = form.value
  if (!name_ru?.trim() || !name_en?.trim()) return

  submitInProgress.value = true
  try {
    const body = { name_ru: name_ru.trim(), name_en: name_en.trim() }

    if (props.mode === 'create') {
      await createCity(body)
      emit('created')
    } else if (props.mode === 'edit' && props.city?.id !== null) {
      await updateCity(props.city.id, body)
      emit('saved')
    }
    localModelValue.value = false
  } catch (err) {
    console.error('City save failed', err)
  } finally {
    submitInProgress.value = false
  }
}
</script>
