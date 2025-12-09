<template>
  <q-select
    outlined
    multiple
    clearable
    clear-icon="close"
    behavior="menu"
    v-model="whatIsChosen"
    :label="props.label"
    :options="props.options"
    style="min-width: 17%"
    @clear="sendEmitToParent([])"
  />
</template>

<script setup>
import { watch } from 'vue'
import { ref } from 'vue'
const props = defineProps([
    'label',
    'options'
])

const whatIsChosen = ref([])
const emit = defineEmits(['updateFilter'])

function sendEmitToParent(value) {
  emit('updateFilter', value || [])
}

watch(whatIsChosen, (newValue) => {
  sendEmitToParent(newValue || [])
})
</script>