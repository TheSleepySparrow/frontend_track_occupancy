<template>
    <q-layout view="hHh Lpr lFf">
        <TheHeader HeaderName="mainMenu.statistics" />
        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup>
import TheHeader from 'src/components/TheHeader.vue'
</script>