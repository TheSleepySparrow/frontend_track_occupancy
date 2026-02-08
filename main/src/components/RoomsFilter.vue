<template>
  <div
    class="q-gutter-y-md items-start"
    style="width: 100%"
  >
    <div
      class="q-gutter-md row items-center no-wrap"
      style="width: 100%"
    >
      <q-input
        v-model="search"
        outlined
        clearable
        clear-icon="close"
        type="search"
        debounce="500"
        style="width: 100%"
        @clear="$emit('search', '')"
        @keyup.enter="$emit('search', search)"
      >
        <template v-slot:before>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn
        type="submit"
        color="primary"
        filled
        :size="'lg'"
        @click="$emit('search', search)"
      >
        {{ $t('occupationPage.searchButton') }}
      </q-btn>
    </div>
    <div class="q-gutter-md row justify-start">
      <RoomsFilterButtons
        :label="$t('occupationPage.floor')"
        :options="props.numberOfFloorsOptions"
        @update-filter="onUpdateFloor"
      />
      <RoomsFilterButtons
        :label="$t('occupationPage.typeOfRoom')"
        :options="typeOfRoomsOptions[$i18n.locale]"
        @update-filter="onUpdateTypeOfRoom"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RoomsFilterButtons from './RoomsFilterButtons.vue'
import { getRoomTypesInfo } from 'src/composables/GetMainInfo'

const props = defineProps({
  numberOfFloorsOptions: {
    type: Array,
    default: () => [],
  },
})

const search = ref('')
const typeOfRoomsOptions = getRoomTypesInfo()
const emit = defineEmits(['updateFloors', 'updateRoom', 'search'])

function onUpdateFloor(floors) {
  emit('updateFloors', floors)
}

function onUpdateTypeOfRoom(typeOfRoom) {
  emit('updateRoom', typeOfRoom)
}
</script>
