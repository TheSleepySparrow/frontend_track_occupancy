<template>
    <div class="q-gutter-sm row items-center no-wrap" style="width: 100%">
        <q-input v-model="search"
        filled
        clearable
        type="search"
        style="width: 100%">
            <template v-slot:append>
            <q-icon name="search" />
            </template>
        </q-input>
        <q-btn type="submit" color="primary" filled :size="'lg'">{{ $t('searchButton') }}</q-btn>
    </div>
    
</template>

<script setup>
import { ref } from 'vue'

const search = ref('')
</script>