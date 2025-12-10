<template>
    <q-form @submit.prevent="handleSubmit"
    class="q-gutter-y-md bg-white"
    style="padding: 5%">
    <div class="col-12 col-md-4">
      <q-select
        v-model="localFilters.reportType"
        :options="reportTypes"
        label="Тип отчета"
        dense
        outlined
      />
    </div>

    <div class="col-12 col-md-4">
      <q-input
        v-model="localFilters.month"
        label="Месяц"
        mask="##/####"
        fill-mask
        hint="Формат: ММ/ГГГГ"
        dense
        outlined
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date
                v-model="localFilters.monthModel"
                mask="MM/YYYY"
                @update:model-value="updateMonthFromCalendar"
              >
                <div class="row items-center justify-end q-gutter-sm q-mt-sm">
                  <q-btn label="Закрыть" color="primary" flat v-close-popup />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>

    <div class="col-12">
      <q-checkbox
        v-model="localFilters.showMax"
        label="Показывать максимальное значение"
        class="q-mr-md"
      />
      <q-checkbox
        v-model="localFilters.showMin"
        label="Показывать минимальное значение"
      />
    </div>

    <div class="col-12 row items-center justify-between">
        <q-btn
        label="Скачать"
        color="secondary"
        class="col q-ml-sm"
        unelevated
        disabled
        />
        <q-btn
        type="submit"
        label="Построить"
        disabled
        color="primary"
        class="col q-ml-sm"
        unelevated
        />
    </div>
  </q-form>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  reportTypes: {
    type: Array,
    required: true
  }
})

const localFilters = ref({ ...props.modelValue })
const emit = defineEmits(['update:modelValue', 'build-chart'])

watch(localFilters, (newVal) => {
  emit('update:modelValue', { ...newVal })
}, { deep: true })

function updateMonthFromCalendar(val) {
  const [year, month] = val.split('/')
  localFilters.value.month = `${month}/${year}`
  localFilters.value.monthModel = val
}

function handleSubmit() {
  const payload = { ...localFilters.value }
  emit('build-chart', payload)
}

</script>