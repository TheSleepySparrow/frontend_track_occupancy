<template>
    <q-list bordered separator color="secondary">
        <q-item id="lang"
        class="row">
            <q-item-section class="col-3">{{ $t('header.language') }}</q-item-section>
            <q-item-section
            side
            class="col">
                <q-select
                emit-value
                borderless
                v-model="$i18n.locale"
                :options="localLanguageOptions">
                </q-select>
            </q-item-section>
        </q-item>
        <q-item id="theme"
        class="row">
            <q-item-section class="col-3">{{ $t('header.theme') }}</q-item-section>
            <q-item-section
            side
            class="col">
                <q-btn-toggle v-model="theme"
                flat
                toggle-color="primary"
                color="accent"
                :options="[
                    {icon: 'light_mode', value: false},
                    {icon: 'dark_mode', value: true},
                ]"/>
            </q-item-section>
        </q-item>
    </q-list>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const theme = ref($q.dark.isActive)

const localLanguageOptions = [{
        label: 'English',
        value: 'en-US'
    }, {
        label: 'Русский',
        value: 'ru-RU'
}]

watch(theme, () => {
    $q.dark.set(theme.value)
})
</script>