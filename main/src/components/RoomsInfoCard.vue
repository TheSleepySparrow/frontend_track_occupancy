<template>
    <div class="q-pa-md row items-start">
        <q-card class="q-mb-md" flat bordered style="width: 100%">
            <q-img
                src="https://cdn.quasar.dev/img/parallax2.jpg"
            />
            <q-card-section>
                <div class="text-overline text-primary">{{ props.item[locale].overline }}</div>
                <div class="text-h5 q-mt-sm q-mb-xs">{{ props.item[locale].title }}</div>
                <div class="text-caption text-grey">
                {{ props.item[locale].description }}
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const props = defineProps(['item'])
const { locale } = useI18n()
</script>