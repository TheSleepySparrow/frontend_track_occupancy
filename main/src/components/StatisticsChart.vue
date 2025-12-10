<template>
  <div class="q-pa-md column items-center bg-white"
  v-if="props.data.length > 0">
    <div class="col-2">
      <h5>{{ reportType }}</h5>
    </div>
    <div class="col full-height">
        <v-chart :option="chartOption" autoresize />
    </div>
    
    <div class="col-4 q-mt-md">
      <div v-if="filtersMaxShow">
        Макс: {{ stats.maxValue }} ({{ stats.maxDate }})
      </div>
      <div v-if="filtersMinShow">
        Мин: {{ stats.minValue }} ({{ stats.minDate }})
      </div>
      <div>Среднее: {{ stats.avgValue.toFixed(1) }}</div>
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
  reportType: { type: String, default: '' },
  stats: { type: Object, required: true }
})

const chartOption = computed(() => {
  const dates = props.data.map(d => d.date)
  const values = props.data.map(d => d.value)

  const markPointData = []
  if (props.filtersMaxShow) {
    const maxIndex = values.indexOf(props.stats.maxValue)
    if (maxIndex !== -1) {
      markPointData.push({ xAxis: maxIndex, yAxis: props.stats.maxValue, itemStyle: { color: 'red' } })
    }
  }
  if (props.filtersMinShow) {
    const minIndex = values.indexOf(props.stats.minValue)
    if (minIndex !== -1) {
      markPointData.push({ xAxis: minIndex, yAxis: props.stats.minValue, itemStyle: { color: 'green' } })
    }
  }

  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category',  dates },
    yAxis: { type: 'value' },
    series: [{
      name: props.reportType,
      type: 'bar',
       values,
      markPoint: markPointData.length ? {  markPointData } : undefined
    }]
  }
})
</script>