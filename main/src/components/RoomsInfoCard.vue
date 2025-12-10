<template>
    <div class="q-pa-md row items-start full-width full-height">
        <q-card class="q-mb-md full-width full-height" flat bordered>
            <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" />
            <q-card-section horizontal class="justify-between full-width">
                <q-card-section class="q-pa-md">
                    <div class="text-overline text-primary">{{ props.item[$i18n.locale].type }}</div>
                    <div class="text-h5 q-mt-sm q-mb-xs">{{ props.item[$i18n.locale].title }}</div>
                    <div class="text-caption text-grey">
                    {{ $t('occupationPage.floor') }} {{ props.item.floor }}
                    </div>
                </q-card-section>
                <q-card-section class="flex flex-center">
                    <q-circular-progress
                        class="text-primary"
                        rounded
                        show-value
                        font-size="16x"
                        :value="occupancyPercent"
                        size="5em"
                        :thickness="0.3"
                        :color="progressColor"
                        track-color="accent"
                    >
                        <div v-if="props.occupancy?.isValid">
                            {{ occupancyPercent }}%
                        </div>
                        <div v-else>
                            <q-badge color="red" rounded transparent floating class="cursor-pointer">
                                <q-tooltip>
                                    {{ props.occupancy?.warning || $t('occupationPage.noOccupationWarning') }}
                                </q-tooltip>
                            </q-badge>
                            {{ occupancyPercent }}%
                        </div>
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
    const count = props.occupancy?.count || 0
    const capacity = props.item?.capacity || 1
    const percent = Math.ceil((count / capacity) * 100)
    return percent > 100 ? 100 : percent
})

const progressColor = computed(() => {
  const percent = occupancyPercent.value
  if (percent <= 30) return 'green'       // Зеленый — мало занято
  if (percent <= 60) return 'amber'       // Желтый — средне
  if (percent <= 90) return 'orange'      // Оранжевый — много
  return 'red'                            // Красный — переполнено
})
</script>