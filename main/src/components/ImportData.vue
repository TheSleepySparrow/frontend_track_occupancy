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

function saveToCSV() {
  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: 'statistics',
  })
  const csv = generateCsv(csvConfig)(props.data)
  download(csvConfig)(csv)
}

function saveToTxt() {
  const txtConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: 'statistics',
    useTextFile: true,
  })
  const txt = generateCsv(txtConfig)(props.data)
  download(txtConfig)(txt)
}

function saveToTsv() {
  const tsvConfig = mkConfig({
    useKeysAsHeaders: true,
    fileExtension: 'tsv',
    filename: 'statistics',
    delimiter: '\t',
  })
  const tsv = generateCsv(tsvConfig)(props.data)
  download(tsvConfig)(tsv)
}
</script>
