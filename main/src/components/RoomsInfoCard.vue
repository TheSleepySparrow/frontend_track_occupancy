<template>
    <div class="q-pa-md row items-start">
        <q-card class="q-mb-md" flat bordered style="width: 100%">
            <q-img
                src="https://cdn.quasar.dev/img/parallax2.jpg"
            />
            <q-card-section horizontal class="justify-between">
                <q-card-section>
                    <div class="text-overline text-primary">{{ props.item[$i18n.locale].type }}</div>
                    <div class="text-h5 q-mt-sm q-mb-xs">{{ props.item[$i18n.locale].title }}</div>
                    <div class="text-caption text-grey">
                    {{ $t('occupationPage.floor') }} {{ props.item.floor }}
                    / {{ props.item[$i18n.locale].description }}
                    </div>
                </q-card-section>
                <q-card-section class="col-4 flex flex-center">
                    <q-circular-progress
                        rounded
                        show-value
                        font-size="18px"
                        :value="occupancyPercent"
                        size="5em"
                        :thickness="0.3"
                        color="positive"
                        track-color="accent"
                        class="q-ma-xs"
                    >
                    {{ occupancyPercent }}%
                    </q-circular-progress>
                </q-card-section>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps(['item', 'occupancy'])

const occupancyPercent = computed(() => {
    //const number = Math.ceil(props.occupancy.numberOfPeople / props.item.capacity * 100)
    const number = 5
    return number > 100 ? 100 : number
})
</script>