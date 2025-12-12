<template>
  <div class="q-pa-md column items-center bg-white"
  v-if="props.data.length > 0">
    <div class="col-2">
      <h5>{{ props.reportType }}</h5>
    </div>
    <div class="col" style="height: 400px; min-height: 400px;">
        <v-chart :option="chartOption" autoresize style="width: 100%; height: 100%;" />
    </div>
    
    <div class="col-4 q-mt-md">
      <div v-if="props.filtersMaxShow">
        Макс: {{ maxStats.value }} ({{ maxStats.time }})
      </div>
      <div v-if="props.filtersMinShow">
        Мин: {{ minStats.value }} ({{ minStats.time }})
      </div>
      <div>Среднее: {{ avgValue.toFixed(1) }}</div>
    </div>
  </div>
  <div class="q-pa-md column items-center bg-white" v-else>
    <div class="col">
      <h5>Нет данных</h5>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'

echarts.use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
])
import VChart from 'vue-echarts'

const props = defineProps({
  data: { type: Array, required: true },
  filtersMaxShow: { type: Boolean, default: false },
  filtersMinShow: { type: Boolean, default: false },
  reportType: { type: String, default: '' }
})

// Calculate stats from data
const maxStats = computed(() => {
  if (!props.data || props.data.length === 0) {
    return { value: 0, time: '' }
  }
  const maxValues = props.data.map(d => d.max)
  const maxValue = Math.max(...maxValues)
  const maxItem = props.data.find(d => d.max === maxValue)
  return {
    value: maxValue,
    time: maxItem?.max_time || ''
  }
})

const minStats = computed(() => {
  if (!props.data || props.data.length === 0) {
    return { value: 0, time: '' }
  }
  const minValues = props.data.map(d => d.min)
  const minValue = Math.min(...minValues)
  const minItem = props.data.find(d => d.min === minValue)
  return {
    value: minValue,
    time: minItem?.min_time || ''
  }
})

const avgValue = computed(() => {
  if (!props.data || props.data.length === 0) {
    return 0
  }
  const sum = props.data.reduce((acc, d) => acc + d.average, 0)
  return sum / props.data.length
})

const chartOption = computed(() => {
  if (!props.data || props.data.length === 0) {
    return {}
  }

  // Extract time intervals for Y-axis (category)
  const timeIntervals = props.data.map(d => d.time)
  
  // Extract average values for X-axis (value)
  const averageValues = props.data.map(d => d.average)

  // Custom tooltip formatter
  const tooltipFormatter = (params) => {
    if (!params || params.length === 0) return ''
    const param = params[0]
    const dataIndex = param.dataIndex
    const dataItem = props.data[dataIndex]
    
    if (!dataItem) return ''
    
    return `
      <div style="padding: 8px;">
        <div><strong>${dataItem.time}</strong></div>
        <div>Среднее: ${dataItem.average}</div>
        <div>Мин: ${dataItem.min} (${dataItem.min_time})</div>
        <div>Макс: ${dataItem.max} (${dataItem.max_time})</div>
      </div>
    `
  }

  // Mark point data for max/min indicators
  const markPointData = []
  if (props.filtersMaxShow) {
    const maxValues = props.data.map(d => d.max)
    const maxValue = Math.max(...maxValues)
    const maxIndex = maxValues.indexOf(maxValue)
    if (maxIndex !== -1) {
      markPointData.push({ 
        yAxis: maxIndex, 
        xAxis: maxValue, 
        itemStyle: { color: 'red' },
        label: { formatter: 'Макс' }
      })
    }
  }
  if (props.filtersMinShow) {
    const minValues = props.data.map(d => d.min)
    const minValue = Math.min(...minValues)
    const minIndex = minValues.indexOf(minValue)
    if (minIndex !== -1) {
      markPointData.push({ 
        yAxis: minIndex, 
        xAxis: minValue, 
        itemStyle: { color: 'green' },
        label: { formatter: 'Мин' }
      })
    }
  }

  return {
    tooltip: { 
      trigger: 'axis',
      formatter: tooltipFormatter
    },
    grid: {
      left: '15%',
      right: '4%',
      bottom: '3%',
      top: '3%'
    },
    xAxis: { 
      type: 'value',
      name: 'Среднее значение'
    },
    yAxis: { 
      type: 'category',
      data: timeIntervals,
      inverse: true
    },
    series: [{
      name: props.reportType || 'Статистика',
      type: 'bar',
      data: averageValues,
      markPoint: markPointData.length > 0 ? { 
        data: markPointData 
      } : undefined
    }]
  }
})
</script>