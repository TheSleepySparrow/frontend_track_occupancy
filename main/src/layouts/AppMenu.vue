<template>
    <q-layout view="hHh Lpr lFf">
        <TheHeader :HeaderName="menu" />
        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup>
import TheHeader from 'src/components/TheHeader.vue'
</script>

<style>
    
</style>