<template>
  <q-form
    @submit.prevent="handleSubmit"
    class="q-gutter-y-md"
    style="padding: 5%"
  >
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
      <DatePicker
        v-model="localFilters.dateModel"
        :report-type="localFilters.reportType?.value || 1"
      />
    </div>

    <div class="col-12 col-md-4">
      <q-select
        v-model="localFilters.statisticsType"
        :options="statOptions"
        :label="$t('statisticsFilters.typeLabel')"
        dense
        outlined
        behavior="menu"
        option-value="value"
        option-label="label"
      />
    </div>

    <div class="col-12 col-md-4">
      <q-toggle
        v-model="localFilters.detail"
        :disable="localFilters.reportType?.value === 1"
        :label="$t('statisticsFilters.detailLabel')"
        class="q-mr-md"
      />
    </div>

    <div class="col-12">
      <q-checkbox
        v-model="localFilters.maxNumberShow"
        :label="$t('statisticsFilters.showMaxPeople')"
        class="q-mr-md"
      />
      <q-checkbox
        v-model="localFilters.showMax"
        :disable="!localFilters.detail"
        :label="$t('statisticsFilters.showMaxLabel')"
        class="q-mr-md"
      />
      <q-checkbox
        v-model="localFilters.showMin"
        :disable="!localFilters.detail"
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
import { watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DatePicker from './DatePicker.vue'

const { t, locale } = useI18n({ useScope: 'global' })

const props = defineProps({
  reportTypes: { type: Array, required: true },
  statisticsTypes: { type: Array, required: true },
})

const localFilters = defineModel()
const emit = defineEmits(['build-chart'])

const typeOptions = computed(() => {
  return props.reportTypes.map((type) => {
    return { label: t(type.labelName), value: type.value }
  })
})

const statOptions = computed(() => {
  return props.statisticsTypes.map((type) => {
    return { label: t(type.labelName), value: type.value }
  })
})

const isButtonEnabled = computed(() => {
  return !!(localFilters.value.reportType && localFilters.value.dateModel)
})

function handleSubmit() {
  emit('build-chart')
}

watch(
  () => localFilters.value.reportType,
  () => {
    localFilters.value.dateModel = ''
  },
)

watch(
  () => localFilters.value.detail,
  () => {
    if (!localFilters.value.detail) {
      localFilters.value.showMax = false
      localFilters.value.showMin = false
    }
  },
)

watch(locale, () => {
  if (localFilters.value.dateModel) {
    return
  }
  if (localFilters.value.reportType?.value) {
    const matchingOption = typeOptions.value.find(
      (option) => option.value === localFilters.value.reportType.value,
    )
    if (matchingOption) {
      localFilters.value.reportType = matchingOption
    }
  }
  if (localFilters.value.statisticsType?.value) {
    const matchingStatOption = statOptions.value.find(
      (option) => option.value === localFilters.value.statisticsType.value,
    )
    if (matchingStatOption) {
      localFilters.value.statisticsType = matchingStatOption
    }
  }
})
</script>
