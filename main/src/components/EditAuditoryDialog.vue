<template>
  <q-dialog v-model="localModelValue" @update:model-value="updateModelValue">
    <q-card style="min-width: 500px; max-width: 800px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ $t('editAuditory.title') }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <!-- Image Preview Section (similar to RoomsInfoCard) -->
        <q-card flat bordered class="q-mb-md">
          <q-img
            :src="'https://cdn.quasar.dev/img/parallax2.jpg'" 
            :alt="localItem[selectedLocale]?.title"
            style="height: 30%"
          >
          </q-img>
        </q-card>
      </q-card-section>

      <q-card-section>
        <!-- Capacity Input -->
        <q-input
          v-model.number="localItem.capacity"
          type="number"
          :label="$t('editAuditory.capacity')"
          outlined
          dense
          readonly
          :rules="[val => val > 0 || $t('editAuditory.capacityError')]"
        />

        <!-- Image URL Input -->
        <q-input
          v-model="localItem.img_url"
          :label="$t('editAuditory.imageUrl')"
          outlined
          readonly
          dense
        />
        <!-- Floor Display (read-only) -->
        <q-input
          :model-value="localItem.floor"
          :label="$t('occupationPage.floor')"
          outlined
          dense
          readonly
        />
      </q-card-section>

      <q-card-section>
          <!-- Locale Select -->
          <q-select
            v-model="selectedLocale"
            :options="localeOptions"
            :label="$t('editAuditory.locale')"
            outlined
            dense
            option-value="value"
            option-label="label"
            emit-value
            map-options
          />

          <!-- Locale-specific Title Input -->
          <q-input
            v-model="localItem[selectedLocale].title"
            :label="$t('editAuditory.titleInput')"
            outlined
            readonly
            dense
            :rules="[val => !!val || $t('editAuditory.titleRequired')]"
          />

          <!-- Locale-specific Type Select -->
          <q-select
            v-model="localItem[selectedLocale].type"
            :options="localeTypeOptions"
            :label="$t('editAuditory.localeType')"
            outlined
            dense
            readonly
            option-value="label"
            option-label="label"
            emit-value
            map-options
          />
        </q-card-section>

        <q-card-actions align="right">
          <!-- Action Buttons -->
          <div class="row q-mt-lg">
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

<style scoped>
.bg-black-transparent {
  background: rgba(0, 0, 0, 0.5);
}
</style>
