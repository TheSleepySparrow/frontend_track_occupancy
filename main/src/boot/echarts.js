import { defineBoot } from '#q-app/wrappers'
import ECharts from 'vue-echarts'

export default defineBoot(({ app }) => {
  app.component('VChart', ECharts)
})
