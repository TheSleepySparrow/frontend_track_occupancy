<template>
  <div
    v-if="props.data && props.data.length > 0"
    class="q-pa-xs column items-center"
  >
    <div class="col-2">
      <h5>{{ $t('statisticsPage.title', { period: timeDisplay }) }}</h5>
    </div>
    <div
      ref="chartWrapperRef"
      class="col-6"
      style="width: 100%; min-height: 500px"
    >
      <div
        ref="chartRef"
        :style="chartStyle"
      ></div>
    </div>

    <div class="col-2 q-mt-md column items-center">
      <div>{{ $t('statisticsPage.Average') }}: {{ avgValue }} </div>
      <div>{{ $t('statisticsPage.MaxPeopleMarkline') }}: {{ maxNumberOfPeopleInAuditory }}</div>
    </div>
    <div class="col-2 q-mt-md">
      <ImportData
        :data="props.data"
        :reportType="props.reportType"
      />
    </div>
  </div>
  <div
    v-else
    class="q-pa-md column items-center"
  >
    <div class="col">
      <h5>{{ $t('statisticsPage.noData') }}</h5>
    </div>
  </div>
</template>

<script setup>
import ImportData from './ImportData.vue'
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
  time: {},
  auditoryInfo: { require: true },
})

const theme = computed(() => {
  return $q.dark.isActive ? 'dark' : 'light'
})

const timeDisplay = computed(() => {
  function returnNeededDateFormat(date) {
    const str = date.split('/')
    return `${str[0]}-${str[1]}-${str[2]}`
  }
  if (typeof props.time === 'object') {
    return returnNeededDateFormat(props.time.from) + '  -  ' + returnNeededDateFormat(props.time.to)
  }
  return returnNeededDateFormat(props.time)
})

const chartRef = useTemplateRef('chartRef')
const instance = ref(null)
const chartWrapperRef = useTemplateRef('chartWrapperRef')
const isChartInitialized = ref(false)

const maxNumberOfPeopleInAuditory = computed(() => {
  if (!props.auditoryInfo) {
    return 30
  }
  return props.auditoryInfo.capacity
})

const chartStyle = ref({
  width: '400px',
  height: '200px',
})

function initChart() {
  if (!chartRef.value) {
    return
  }

  if (!instance.value) {
    instance.value = echarts.init(chartRef.value)
    // main bar chart options
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
        nameGap: 50,
        max: 30,
      },
      series: [
        {
          name: t('statisticsPage.seriesName'),
          type: 'bar',
          data: [],
          showBackground: true,
          backgroundStyle: { color: 'rgba(180, 180, 180, 0.2)' },
        },
      ],
      toolbox: {
        show: true,
        feature: {
          dataView: { show: true, readOnly: true },
          saveAsImage: { show: true },
        },
      },
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
  if (!isChartInitialized.value) {
    return
  }
  if (!instance.value) {
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

// Calculate average value
const avgValue = ref(0)
function calculateAvgValue(data) {
  if (!data || data.length === 0) {
    return 0
  }

  const sum = data.reduce((acc, d) => acc + d.average, 0)
  return Math.ceil(sum / data.length)
}
// calculate maximum in data
const maxValue = ref(0)
function calculateMaxValue(data) {
  if (!data || data.length === 0) {
    return 0
  }

  return Math.max(data)
}

function setChartOption(data) {
  if (!instance.value) {
    return
  }
  // if max in props.data is greater than max number of people in auditory
  const maxYAxisValue =
    maxValue.value > maxNumberOfPeopleInAuditory.value
      ? Math.ceil(maxValue.value * 1.1)
      : Math.ceil(maxNumberOfPeopleInAuditory.value * 1.1)

  // get gradient colors for bar based on its data
  function getGradientColors(average) {
    const occupancyRate = average / maxNumberOfPeopleInAuditory.value

    if (occupancyRate >= 0.9) {
      return { start: '#63544C', end: '#FCA470' }
    }
    if (occupancyRate >= 0.7) {
      return { start: '#CCB68F', end: '#FED080' }
    }
    if (occupancyRate >= 0.5) {
      return { start: '#828A51', end: '#E9EFC1' }
    }
    if (occupancyRate >= 0.3) {
      return { start: '#4A7075', end: '#A9D4DB' }
    }
    return { start: '#8CA6C2', end: '#80B9F4' }
  }

  instance.value.setOption({
    xAxis: {
      data: data.map((d) => d.time),
    },
    yAxis: {
      max: maxYAxisValue,
    },
    series: [
      {
        data: data.map((d) => {
          const colorsForColorStops = getGradientColors(d.average)
          return {
            value: Math.ceil(d.average),
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: colorsForColorStops.end, // color at 0%
                  },
                  {
                    offset: 1,
                    color: colorsForColorStops.start, // color at 100%
                  },
                ],
                global: false, // default is false
              },
            },
          }
        }),
      },
    ],
  })
}

// set up for horizontal lines (max number of people in auditory and average number)
function setSeriesMarkLine() {
  if (!instance.value) {
    return
  }

  // always show max number of people in auditory
  const whatIsShownInMarkLine = [
    { name: t('statisticsPage.MaxPeopleMarkline'), yAxis: maxNumberOfPeopleInAuditory.value },
  ]
  // if average is not tooo small show it
  if (avgValue.value > 1) {
    whatIsShownInMarkLine.push({ name: t('statisticsPage.Average'), type: 'average' })
  }

  instance.value.setOption({
    series: [
      {
        markLine: {
          lineStyle: { color: '#EB1400' },
          data: whatIsShownInMarkLine,
        },
      },
    ],
  })
}

function createChart(data) {
  if (!instance.value) {
    initChart()
  }
  isChartInitialized.value = true
  avgValue.value = calculateAvgValue(data)
  maxValue.value = calculateMaxValue(data.map((d) => d.average))
  setChartOption(data)
  setSeriesMarkLine()
}

watch(
  () => props.data,
  async (newData) => {
    if (newData && newData.length > 0) {
      await nextTick()
      createChart(newData)
    } else {
      isChartInitialized.value = false
    }
  },
)

watch(locale, () => {
  if (instance.value) {
    instance.value.setOption({
      title: { text: t('statisticsPage.titleChart') },
      xAxis: { name: t('statisticsPage.xAxis') },
      yAxis: { name: t('statisticsPage.yAxis') },
      series: [
        {
          name: t('statisticsPage.seriesName'),
        },
      ],
    })
    setSeriesMarkLine() // need to reset horizontal lines because of locale in names
  }
})

watch(theme, () => {
  if (!isChartInitialized.value) {
    return
  }
  // need to reset chart
  if (instance.value) {
    isChartInitialized.value = false
    instance.value.dispose()
    instance.value = null
    createChart(props.data)
  }
})

onBeforeUnmount(() => {
  if (instance.value) {
    instance.value.dispose()
  }
})
</script>
