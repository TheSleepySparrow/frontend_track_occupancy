<template>
    <div class="q-pa-md row items-start">
        <q-card class="q-mb-md" flat bordered style="width: 100%">
            <q-img
                src="https://cdn.quasar.dev/img/parallax2.jpg"
            />
            <q-card-section>
                <div class="text-overline text-primary">{{ props.item[$i18n.locale].overline }}</div>
                <div class="text-h5 q-mt-sm q-mb-xs">{{ props.item[$i18n.locale].title }}</div>
                <div class="text-caption text-grey">
                {{ props.item[$i18n.locale].description }}
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
const props = defineProps(['item'])
</script>