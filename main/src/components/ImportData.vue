<template>
  <div class="row q-gutter-x-md items-center">
    <q-btn
      v-for="format in files"
      :key="format.id"
      :label="$t(format.text)"
      @click="format.whatClickIsDoing"
      :color="format.color"
    />
  </div>
</template>

<script setup>
import { mkConfig, generateCsv, download } from 'export-to-csv'

const props = defineProps(['data'])

const files = {
  csv: {
    id: 1,
    text: 'statisticsPage.saveCsv',
    color: 'teal-6',
    whatClickIsDoing: () => saveToCSV(),
  },
  txt: {
    id: 2,
    text: 'statisticsPage.saveTxt',
    color: 'green-6',
    whatClickIsDoing: () => saveToTxt(),
  },
  tsv: {
    id: 3,
    text: 'statisticsPage.saveTsv',
    color: 'light-green-6',
    whatClickIsDoing: () => saveToTsv(),
  },
}

function flattenForExport(data) {
  if (!data?.length) return data
  const first = data[0]
  if (!first.days || !Array.isArray(first.days)) {
    return data
  }
  return data.map((d) => {
    const row = { time: d.time }
    ;(d.days || []).forEach((day, i) => {
      const key = day.dayLabel !== null ? day.dayLabel : `day_${i}`
      row[key] = day.average ?? ''
    })
    return row
  })
}

function saveToCSV() {
  const toExport = flattenForExport(props.data)
  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: 'statistics',
  })
  const csv = generateCsv(csvConfig)(toExport)
  download(csvConfig)(csv)
}

function saveToTxt() {
  const toExport = flattenForExport(props.data)
  const txtConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: 'statistics',
    useTextFile: true,
  })
  const txt = generateCsv(txtConfig)(toExport)
  download(txtConfig)(txt)
}

function saveToTsv() {
  const toExport = flattenForExport(props.data)
  const tsvConfig = mkConfig({
    useKeysAsHeaders: true,
    fileExtension: 'tsv',
    filename: 'statistics',
    delimiter: '\t',
  })
  const tsv = generateCsv(tsvConfig)(toExport)
  download(tsvConfig)(tsv)
}
</script>
