<template>
  <q-list
    bordered
    separator
    color="secondary"
  >
    <q-item
      id="lang"
      class="row"
    >
      <q-item-section class="col-3">{{ props.languageName }}</q-item-section>
      <q-item-section
        side
        class="col"
      >
        <q-select
          emit-value
          borderless
          behavior="menu"
          v-model="$i18n.locale"
          :options="localLanguageOptions"
        >
        </q-select>
      </q-item-section>
    </q-item>
    <q-item
      id="theme"
      class="row"
    >
      <q-item-section class="col-3">{{ props.themeName }}</q-item-section>
      <q-item-section
        side
        class="col"
      >
        <q-btn-toggle
          v-model="theme"
          flat
          toggle-color="primary"
          color="accent"
          :options="[
            { icon: 'light_mode', value: false },
            { icon: 'dark_mode', value: true },
          ]"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useGlobalState, setTheme } from 'src/composables/GlobalState'
import { useI18n } from 'vue-i18n'

const { globalState } = useGlobalState()
const $q = useQuasar()
const { locale } = useI18n()
const theme = ref($q.dark.isActive)

const props = defineProps(['languageName', 'themeName'])

const localLanguageOptions = [
  {
    label: 'English',
    value: 'en-US',
  },
  {
    label: 'Русский',
    value: 'ru-RU',
  },
]

watch(theme, (newValue) => {
  $q.dark.set(newValue)
  setTheme(newValue)
})

watch(locale, (newValue) => {
  globalState.value.language = newValue
})
</script>
