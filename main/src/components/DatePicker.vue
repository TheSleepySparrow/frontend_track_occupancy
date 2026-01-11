<template>
  <q-input
    v-model="model"
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
            v-model="model"
            :mask="qDateMask"
            :range="isRangeMode"
            :default-view="defaultView"
            :default-year-month="defaultYearMonth"
            :options="dateOptions"
            :locale="calendarConfigLocale"
            today-btn
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
  reportType: { type: String, default: 'day' }
})

const model = defineModel()

const inputMask = computed(() => {
  const maskMap = {
    'day': '##/##/####',
    'week': '##/##/#### - ##/##/####',
    'month': '##/####',
    'year': '####'
  }
  return maskMap[props.reportType] || '##/##/####'
})

const hintLabel = computed(() => {
  if (props.reportType) {
    return t('statisticsFilters.formatValue.' + props.reportType)
  }
  return t('statisticsFilters.formatValue.default')
})

const isCalendarEnabled = computed(() => {
  return !props.reportType
})

const qDateMask = computed(() => {
  if (props.reportType === 'month') {
    return 'MM/YYYY'
  }
  if (props.reportType === 'week') {
    return 'DD/MM/YYYY - DD/MM/YYYY'
  }
  if (props.reportType === 'year') {
    return 'YYYY'
  }
  return 'DD/MM/YYYY'
})

const isRangeMode = computed(() => {
  return props.reportType === 'week'
})

const defaultView = computed(() => {
  if (props.reportType === 'month') return 'Months'
  if (props.reportType === 'year') return 'Years'
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

watch(() => props.reportType, () => {
  model.value = ''
})
</script>
