<template>
  <div v-if="props.data && props.data.length > 0" class="q-pa-md column items-center">
    <div class="col-2">
      <h5>{{ $t('statisticsPage.title', { period: props.time }) }}</h5>
    </div>
    <div ref="chartWrapperRef" class="col-8" style="width: 100%; min-height: 400px;">
      <div ref="chartRef" :style="chartStyle"></div>
    </div>

    <div class="col-2 q-mt-md">
      <div>Среднее: {{ avgValue.toFixed(1) }}</div>
    </div>
  </div>
  <div v-else class="q-pa-md column items-center">
    <div class="col">
      <h5>{{ $t('statisticsPage.noData') }}</h5>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onBeforeUnmount, watch, nextTick, useTemplateRef } from 'vue'
import * as echarts from 'echarts'
import { useResizeObserver, useElementSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

const { t, locale } = useI18n()

const $q = useQuasar()

const props = defineProps({
  data: { required: true },
  filtersMaxShow: { type: Boolean, default: false },
  filtersMinShow: { type: Boolean, default: false },
  reportType: { type: String, default: '' },
  time: { type: String, default: '' }
})

const theme = computed(() => {
  return $q.dark.isActive ? 'dark' : 'light'
})

const chartRef = useTemplateRef('chartRef')
const instance = ref(null)
const chartWrapperRef = useTemplateRef('chartWrapperRef')
const isChartInitialized = ref(false)

const chartStyle = ref({
  width: '400px',
  height: '200px',
})

onBeforeUnmount(() => {
  if (instance.value) {
    instance.value.dispose()
  }
})

const initChart = () => {
  if (!chartRef.value) {
    return
  }

  if (!instance.value) {
    instance.value = echarts.init(chartRef.value)

    instance.value.setOption({
      title: {
        text: t('statisticsPage.titleChart'),
        left: 'center',
        top: 'top',
        show: false,
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}',
      },
      grid: {
        left: '15%',
        right: '4%',
        bottom: '3%',
        top: '3%',
      },
      xAxis: {
        type: 'category',
        name: t('statisticsPage.xAxis'),
        nameLocation: 'middle',
        nameGap: 30,
        data: [],
      },
      yAxis: {
        type: 'value',
        name: t('statisticsPage.yAxis'),
        nameLocation: 'middle',
        nameGap: 30,
      },
      series: [{
        name: t('statisticsPage.seriesName'),
        type: 'bar',
        data: [],
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      }]
    })
    const { width, height } = useElementSize(chartWrapperRef)
    chartStyle.value = {
      width: width.value ? width.value + 'px' : '700px',
      height: height.value ? height.value + 'px' : '400px',
    }
    instance.value.resize()
    instance.value.setTheme(theme.value)
  }
}

useResizeObserver(chartWrapperRef, (entries) => {
  if (!instance.value) {
    return
  }

  if (!isChartInitialized.value) {
    return
  }

  const entry = entries[0]
  const { width, height } = entry.contentRect
  chartStyle.value = {
    width: width ? width + 'px' : '700px',
    height: height ? height + 'px' : '400px',
  }
  instance.value.resize()
})

const avgValue = computed(() => {
  if (!props.data.value || props.data.value.length === 0) {
    return 0
  }
  const sum = props.data.value.reduce((acc, d) => acc + d.average, 0)
  return sum / props.data.value.length
})

const setChartOption = (data) => {
  if (instance.value) {
    instance.value.setOption({
      xAxis: {
        data: data.map(d => d.time),
      },
      series: [{
        data: data.map(d => d.average.toFixed(1)),
      }],
    })
  }
}

watch(() => props.data, async (newData) => {
  if (newData && newData.length > 0) {
    await nextTick()
    if (!instance.value) {
      initChart()
    }
    isChartInitialized.value = true
    setChartOption(newData)
  } else {
    isChartInitialized.value = false
  }
})

watch(locale, () => {
  if (instance.value) {
    instance.value.setOption({
      title: {
        text: t('statisticsPage.titleChart'),
      },
      xAxis: {
        name: t('statisticsPage.xAxis'),
      },
      yAxis: {
        name: t('statisticsPage.yAxis'),
      },
      series: [{
        name: t('statisticsPage.seriesName'),
      }],
    })
  }
})

watch(theme, () => {
  if (instance.value) {
    instance.value.dispose()
    instance.value = null
    initChart()
    isChartInitialized.value = true
    setChartOption(props.data.value)
  }
})
</script>
