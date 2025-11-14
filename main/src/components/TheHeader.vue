<template>
    <q-header elevated>
      <q-toolbar class="bg-primary text-white">
        <q-btn flat dense round
            color="secondary"
            icon="arrow_back"
            aria-label="Menu"
        />
        <q-toolbar-title>{{ $t(headerText.headerName) }}</q-toolbar-title>

        <q-space/>

        <div class="q-gutter-sm row items-center no-wrap">
            <q-btn-dropdown
                push flat dense
                color="accent"
                :label="$t(headerText.settings)"
                padding="xs md"
                content-style="background-color: accent"
            >
                <SettingsList
                    :languageName="$t(headerText.language)"
                    :themeName="$t(headerText.theme)"
                />
            </q-btn-dropdown>
            <q-btn
                flat dense
                icon-right="logout"
                :label="$t(headerText.logout)"
                @click="logout" padding="xs md"
            />
        </div>
      </q-toolbar>
    </q-header>
</template>

<script setup>
import SettingsList from 'src/components/SettingsList.vue'
import { computed } from 'vue'

const props = defineProps(['HeaderName'])

const headerText = computed(() => {
    return {
        headerName: props.HeaderName + '.headerName',
        settings: props.HeaderName + '.settings',
        language: props.HeaderName + '.language',
        theme: props.HeaderName + '.theme',
        logout: props.HeaderName + '.logout'
    }
})

function logout() {
  console.log('logout')
}
</script>
