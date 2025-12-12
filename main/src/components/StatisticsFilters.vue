<template>
    <q-form @submit.prevent="handleSubmit"
    class="q-gutter-y-md bg-white"
    style="padding: 5%">
    <div class="col-12 col-md-4">
      <q-select
        v-model="localFilters.reportType"
        :options="typeOptions"
        :label="$t('statisticsFilters.typeLabel')"
        dense
        outlined
        behavior="menu"
        option-value="value"
        option-label="label"
      />
    </div>

    <div class="col-12 col-md-4">
      <q-input
        v-model="localFilters.dateModel"
        :label="$t('statisticsFilters.periodLabel')"
        :hint="$t('statisticsFilters.format') + ': ' + hintLabel"
        :mask="inputMask"
        fill-mask
        dense
        outlined
        :disable="isCalendarEnabled"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer" v-if="!isCalendarEnabled">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date
                v-model="calendarModel"
                mask="DD/MM/YYYY"
                @update:model-value="updateMonthFromCalendar"
              >
                <div class="row items-center justify-end q-gutter-sm q-mt-sm">
                  <q-btn :label="$t('popUps.close')" color="primary" flat v-close-popup />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-tooltip>
        {{ $t('statisticsFilters.calendarTooltip') }}
      </q-tooltip>
    </div>

    <div class="col-12">
      <q-checkbox
        v-model="localFilters.showMax"
        disable
        :label="$t('statisticsFilters.showMaxLabel')"
        class="q-mr-md"
      />
      <q-checkbox
        v-model="localFilters.showMin"
        disable
        :label="$t('statisticsFilters.showMinLabel')"
        class="q-mr-md"
      />
    </div>

    <div class="col-12 row items-center justify-between">
        <q-btn
        :label="$t('statisticsFilters.download')"
        color="secondary"
        class="col q-ml-sm"
        unelevated
        disabled
        />
        <q-btn
        type="submit"
        :label="$t('statisticsFilters.build')"
        :disabled="!isButtonEnabled"
        color="primary"
        class="col q-ml-sm"
        unelevated
        />
    </div>
  </q-form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n({ useScope: 'global' })

const props = defineProps({
  modelValue: { type: Object, required: true },
  reportTypes: { type: Array, required: true }
})

const calendarModel = ref('')
const localFilters = ref({ ...props.modelValue })
const emit = defineEmits(['update:modelValue', 'build-chart'])

const typeOptions = computed(() => {
  return props.reportTypes.map(type => {
    return { label: t(type.labelName), value: type.value }
  })
})

const inputMask = computed(() => {
  const reportTypeValue = localFilters.value.reportType?.value
  const maskMap = {
    'day': '##/##/####',
    'week': '##/##/#### - ##/##/####',
    'month': '##/####',
    'year': '####'
  }
  return maskMap[reportTypeValue] || '##/##/####'
})

const hintLabel = computed(() => {
  const reportTypeValue = localFilters.value.reportType?.value
  if (reportTypeValue) {
    return t('statisticsFilters.formatValue.' + reportTypeValue)
  }
  return t('statisticsFilters.formatValue.default')
})

const isCalendarEnabled = computed(() => {
  return !localFilters.value.reportType
})

const isButtonEnabled = computed(() => {
  return !!(localFilters.value.reportType && (localFilters.value.dateModel || calendarModel.value))
})

function updateMonthFromCalendar(val) {
  if (!val) return
  
  const reportTypeValue = localFilters.value.reportType?.value
  const [day, month, year] = val.split('/')
  
  switch (reportTypeValue) {
    case 'day':
      // Format: DD/MM/YY
      localFilters.value.dateModel = `${day}/${month}/${year}`
      break
    case 'week': {
      // Format: DD/MM/YY - DD/MM/YY (start date - end date)
      const endDay = String(parseInt(day) + 6).padStart(2, '0')
      localFilters.value.dateModel = `${day}/${month}/${year} - ${endDay}/${month}/${year}`
      break
    }
    case 'month':
      // Format: MM/YY
      localFilters.value.dateModel = `${month}/${year}`
      break
    case 'year':
      // Format: YY
      localFilters.value.dateModel = year
      break
    default:
      // Default format: DD/MM/YY
      localFilters.value.dateModel = `${day}/${month}/${year}`
  }
  calendarModel.value = `${day}/${month}/${year}`
}

function handleSubmit() {
  const payload = { ...localFilters.value }
  emit('build-chart', payload)
}

watch(localFilters, (newVal) => {
  emit('update:modelValue', { ...newVal })
}, { deep: true })

watch(() => localFilters.value.reportType, () => {
  localFilters.value.dateModel = ''
  calendarModel.value = ''
})

watch(locale, () => {
  if (localFilters.value.reportType?.value) {
    const matchingOption = typeOptions.value.find(
      option => option.value === localFilters.value.reportType.value
    )
    if (matchingOption) {
      localFilters.value.reportType = matchingOption
    }
  }
})

watch(() => localFilters.value.dateModel, (newVal) => {
  calendarModel.value = newVal || ''
})
</script>