<template>
    <q-list bordered separator color="secondary">
        <q-item id="lang">
            <q-item-section>
                <q-item-label>{{ $t('header.language') }}</q-item-label>
            </q-item-section>
            <q-select outlined
            emit-value
            v-model="$i18n.locale"
            :options="localLanguageOptions"/>
        </q-item>
        <q-item id="theme">
            <q-item-section>
                <q-item-label>{{ $t('header.theme') }}</q-item-label>
            </q-item-section>
            <q-item-section section side>
                <q-btn-toggle v-model="themeModel"
                flat
                toggle-color="primary"
                color="accent"
                :options="[
                    {icon: 'light_mode', value: 'lightTheme'},
                    {icon: 'dark_mode', value: 'darkTheme'},
                ]"/>
            </q-item-section>
        </q-item>
    </q-list>
</template>

<script setup>
import { ref } from 'vue'

const themeModel = ref('lightTheme')

const localLanguageOptions = [{
        label: 'English',
        value: 'en-US'
    }, {
        label: 'Русский',
        value: 'ru-RU'
}]
</script>