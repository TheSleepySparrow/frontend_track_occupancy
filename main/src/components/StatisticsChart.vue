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
      <q-btn
        flat
        unelevated
        @click="restoreChartConfig"
        >{{ $t('statisticsPage.restore') }}</q-btn
      >
    </div>
    <div class="col-2 q-mt-md column items-center">
      <div v-if="!props.isDetailMode">{{ $t('statisticsPage.Average') }}: {{ avgValue }} </div>
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
  isDetailMode: { type: Boolean, default: false },
  reportType: { type: String, default: '' },
  time: {},
  auditoryInfo: { require: true },
  showMaxPeople: { type: Boolean },
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
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        position: function (pt) {
          return [pt[0], '10%']
        },
      },
      xAxis: {
        type: 'category',
        name: t('statisticsPage.xAxis'),
        nameLocation: 'middle',
        nameGap: 30,
        axisLine: { show: false },
        data: [],
      },
      yAxis: {
        type: 'value',
        name: t('statisticsPage.yAxis'),
        nameLocation: 'middle',
        nameGap: 50,
        max: 30,
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          name: t('statisticsPage.seriesName'),
          type: 'bar',
          data: [],
          showBackground: true,
          backgroundStyle: { color: 'rgba(180, 180, 180, 0.2)' },
          barGap: 0,
          emphasis: {
            focus: 'series',
          },
        },
      ],
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack'] },
          saveAsImage: { show: true },
        },
      },
      // Инициализация dataZoom с явным диапазоном предотвращает ошибку
      // "this._percentWindow is undefined" при переключении magicType (line/bar/stack).
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
      ],
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
  if (props.isDetailMode && data[0]?.days) {
    const values = data.flatMap((d) => d.days.map((x) => x.average))
    if (values.length === 0) return 0
    const sum = values.reduce((acc, v) => acc + v, 0)
    return Math.ceil(sum / values.length)
  }
  const sum = data.reduce((acc, d) => acc + d.average, 0)
  return Math.ceil(sum / data.length)
}
// calculate maximum in data (valuesArray = array of numbers)
const maxValue = ref(0)
function calculateMaxValue(valuesArray) {
  if (!valuesArray || valuesArray.length === 0) {
    return 0
  }
  return Math.max(...valuesArray)
}

// set up for horizontal lines (max number of people in auditory and average number)
function setSeriesMarkLine(option) {
  if (!instance.value) {
    return
  }

  const whatIsShownInMarkLine = []
  if (props.showMaxPeople) {
    whatIsShownInMarkLine.push({
      name: t('statisticsPage.MaxPeopleMarkline'),
      yAxis: maxNumberOfPeopleInAuditory.value,
    })
  }
  if (avgValue.value > 1 && !props.isDetailMode) {
    whatIsShownInMarkLine.push({ name: t('statisticsPage.Average'), type: 'average' })
  }
  if (whatIsShownInMarkLine.length > 0) {
    option.series.push({
      markLine: {
        lineStyle: { color: '#EB1400' },
        data: whatIsShownInMarkLine,
      },
    })
  }
  return option
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

  const xAxisData = data.map((d) => d.time)

  if (props.isDetailMode && data[0]?.days) {
    const dayEntries = data[0].days
    const series = dayEntries.map((dayEntry, dayIndex) => ({
      type: 'bar',
      barGap: 0,
      emphasis: {
        focus: 'series',
      },
      showBackground: true,
      backgroundStyle: { color: 'rgba(180, 180, 180, 0.2)' },
      name: dayEntry.dayLabel,
      data: data.map((d) => Math.ceil(d.days[dayIndex]?.average ?? 0)),
    }))
    const detailModeOption = {
      legend: {
        show: true,
        type: 'scroll',
        data: dayEntries.map((d) => d.dayLabel),
        top: 'top',
        width: '40%',
        height: '20%',
        //orient: 'vertical'
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
      ],
      brush: {
        toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
        xAxisIndex: 0,
      },
      colorBy: 'series',
      xAxis: { data: xAxisData },
      yAxis: { max: props.showMaxPeople ? maxYAxisValue : null },
      series,
    }
    instance.value.setOption(setSeriesMarkLine(detailModeOption))
    return
  }

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
  const option = {
    xAxis: {
      data: xAxisData,
    },
    yAxis: {
      max: props.showMaxPeople ? maxYAxisValue : null,
    },
    series: [
      {
        name: t('statisticsPage.Average'),
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
  }
  if (props.filtersMaxShow) {
    option.series.push({
      name: t('statisticsPage.maxLabel'), // или просто 'Max', если ключа нет
      type: 'line',
      data: data.map((d) => d.max),
    })
  }
  if (props.filtersMinShow) {
    option.series.push({
      name: t('statisticsPage.minLabel'), // или 'Min'
      type: 'line',
      data: data.map((d) => d.min),
    })
  }
  if (props.filtersMinShow || props.filtersMaxShow) {
    option.legend = {
      show: true,
      top: 'top',
      data: [
        t('statisticsPage.Average'),
        t('statisticsPage.maxLabel'),
        t('statisticsPage.minLabel'),
      ].filter((_, i) => {
        if (i === 0) return true
        if (i === 1) return props.filtersMaxShow
        return props.filtersMinShow
      }),
    }
  }
  instance.value.setOption(setSeriesMarkLine(option))
}

function createChart(data) {
  if (!instance.value) {
    initChart()
  }
  isChartInitialized.value = true
  avgValue.value = calculateAvgValue(data)
  const valuesForMax =
    props.isDetailMode && data[0]?.days
      ? data.flatMap((d) => d.days.map((x) => x.average))
      : data.map((d) => d.average)
  maxValue.value = calculateMaxValue(valuesForMax)
  setChartOption(data)
  //setMaxAndMinLine(data)
}

watch(
  () => props.data,
  async (newData) => {
    if (newData && newData.length > 0) {
      await nextTick()
      createChart(newData)
    } else if (isChartInitialized.value) {
      isChartInitialized.value = false
      instance.value.dispose()
      instance.value = null
    }
  },
)

watch(locale, () => {
  if (instance.value) {
    const option = {
      title: { text: t('statisticsPage.titleChart') },
      xAxis: { name: t('statisticsPage.xAxis') },
      yAxis: { name: t('statisticsPage.yAxis') },
    }
    if (!props.isDetailMode) {
      option.series = [{ name: t('statisticsPage.seriesName') }]
    }
    instance.value.setOption(option)
    // setSeriesMarkLine() // need to reset horizontal lines because of locale in names
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

function restoreChartConfig() {
  if (!instance.value) {
    return
  }
  instance.value.dispatchAction({
    type: 'restore',
  })
  setChartOption(props.data)
  setSeriesMarkLine()
}

onBeforeUnmount(() => {
  if (instance.value) {
    instance.value.dispose()
  }
})
</script>
