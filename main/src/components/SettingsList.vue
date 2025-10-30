<template>
    <q-list bordered separator color="secondary">
        <q-item id="lang">
            <q-item-section>
                <q-item-label>{{ $t('language') }}</q-item-label>
            </q-item-section>
            <q-select outlined
            emit-value
            v-model="languageModel"
            :options="localLanguageOptions"/>
        </q-item>
        <q-item id="theme">
            <q-item-section>
                <q-item-label>{{ $t('theme') }}</q-item-label>
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
import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'

const { locale } = useI18n()

const themeModel = ref('lightTheme')
const languageModel = ref('en-US')

const localLanguageOptions = [{
        label: 'English',
        value: 'en-US'
    }, {
        label: 'Русский',
        value: 'ru-RU'
}]

watch(languageModel, () => {
    console.log('languageModel', locale)
    locale.value = languageModel.value
    localStorage.setItem('locale', languageModel.value)
}, { immediate: true })
</script>