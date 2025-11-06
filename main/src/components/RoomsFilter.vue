<template>
    <div class="q-gutter-md row items-center no-wrap" style="width: 100%">
        <q-input v-model="search"
        filled
        clearable
        clear-icon="close"
        type="search"
        debounce="500"
        style="width: 100%"
        @clear="$emit('search', '')"
        @keyup.enter="$emit('search', search)">
            <template v-slot:before>
            <q-icon name="search" />
            </template>
        </q-input>
        <q-btn type="submit" color="primary"
        filled
        :size="'lg'"
        @click="$emit('search', search)">
            {{ $t('occupationPage.searchButton') }}
        </q-btn>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const search = ref('')
</script>