<template>
  <q-input
    :model-value="inputValue"
    readonly
    :label="$t('statisticsFilters.periodLabel')"
    :hint="$t('statisticsFilters.format') + ': ' + hintLabel"
    :mask="inputMask"
    fill-mask
    dense
    outlined
    :disable="isCalendarEnabled"
  >
    <template v-slot:append>
      <q-icon
        name="event"
        class="cursor-pointer"
        v-if="!isCalendarEnabled"
      >
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            v-model="model"
            :range="isRangeMode"
            :default-view="defaultView"
            :default-year-month="defaultYearMonth"
            :options="dateOptions"
            :locale="calendarConfigLocale"
            today-btn
          >
            <div class="row items-center justify-end q-gutter-sm q-mt-sm">
              <q-btn
                :label="$t('popUps.close')"
                color="primary"
                flat
                v-close-popup
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
  <q-tooltip>
    {{ $t('statisticsFilters.calendarTooltip') }}
  </q-tooltip>
</template>

<script setup>
import { computed, watch } from 'vue'
import calendarConfig from 'src/config/Calendar.json'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n({ useScope: 'global' })

const calendarConfigLocale = computed(() => {
  return calendarConfig[locale.value]
})

const props = defineProps({
  reportType: { type: Number, default: 1 },
})

const model = defineModel()

const inputValue = computed({
  get() {
    if (props.reportType === 2 && model.value && typeof model.value === 'object') {
      const from = model.value.from
      const to = model.value.to
      if (!from || !to) return ''
      return from + '-' + to
    }
    return typeof model.value === 'string' ? model.value : (model.value ?? '')
  },
  set(val) {
    if (props.reportType === 2) return
    model.value = val
  },
})

const inputMask = computed(() => {
  const maskMap = ['####/##/##', '####/##/## - ####/##/##', '####/##', '####']
  return maskMap[props.reportType - 1] || '####/##/##'
})

const hintLabel = computed(() => {
  if (props.reportType) {
    const hint = ['day', 'period', 'month', 'year']
    return t('statisticsFilters.formatValue.' + hint[props.reportType - 1])
  }
  return t('statisticsFilters.formatValue.default')
})

const isCalendarEnabled = computed(() => {
  return !props.reportType
})

const isRangeMode = computed(() => {
  return props.reportType === 2
})

const defaultView = computed(() => {
  if (props.reportType === 3) return 'Months'
  if (props.reportType === 4) return 'Years'
  return 'Calendar'
})

const defaultYearMonth = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}/${month}`
})

function dateOptions(date) {
  const minDate = calendarConfig.dayThatStartsStatistics
  const today = new Date()
  const maxDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`
  return date >= minDate && date <= maxDate
}

watch(
  () => props.reportType,
  () => {
    model.value = ''
  },
)
</script>
