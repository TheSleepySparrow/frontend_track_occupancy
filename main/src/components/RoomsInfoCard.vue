<template>
    <div class="q-pa-md row items-start full-width full-height">
        <q-card class="q-mb-md full-width full-height" flat bordered>
            <!--<q-img :src="props.item.img_url || 'https://cdn.quasar.dev/img/parallax2.jpg'" />-->
            <q-img :src="imageUrl" />
            <q-card-section horizontal class="justify-between full-width">
                <q-card-section class="q-pa-md full-width">
                    <div :class="$q.dark.isActive ? 'text-overline grey-6' : 'text-overline text-primary'">
                      {{ props.item[$i18n.locale].type }}
                    </div>
                    <div class="text-h5 q-mt-sm q-mb-xs">
                        {{ props.item[$i18n.locale].title }}
                    </div>
                    <div class="text-caption text-grey">
                    {{ $t('occupationPage.floor') }} {{ props.item.floor }}
                    </div>
                    <div style="padding-top: 5%;">
                        <q-btn
                            outline
                            :color="$q.dark.isActive ? 'blue-grey-4' : 'primary'"
                            :label="$t('editAuditory.title')"
                            size="sm"
                            @click="showEditDialog = true"
                        />
                    </div>
                </q-card-section>
                <q-card-section class="row items-center justify-center">
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
                        <div v-if="occupancyItem?.isValid">
                            {{ occupancyPercent }}%
                        </div>
                        <div v-else>
                            <q-badge color="red" rounded transparent floating class="cursor-pointer">
                                <q-tooltip>
                                    {{ occupancyItem?.warning || $t('occupationPage.noOccupationWarning') }}
                                </q-tooltip>
                            </q-badge>
                            {{ occupancyPercent }}%
                        </div>
                    </q-circular-progress>
                </q-card-section>
            </q-card-section>
        </q-card>

        <!-- Edit Dialog -->
        <EditAuditoryDialog
            v-model="showEditDialog"
            :item="props.item"
            :city-id="props.cityId"
            :building-id="props.buildingId"
            @save="onSave"
        />
    </div>
</template>

<script setup>
import { computed, watch, onUnmounted, ref } from 'vue'
import { useAuditoryOccupancy } from 'src/composables/useGetAuditoriesInfo'
import EditAuditoryDialog from './EditAuditoryDialog.vue'

const props = defineProps(['item', 'occupancy', 'url', 'cityId', 'buildingId'])
const showEditDialog = ref(false)
// Local updates to merge with props.occupancy
const localOccupancyUpdate = ref(null)

// occupancyItem is reactive to props.occupancy and merges with local updates
const occupancyItem = computed(() => {
    const baseOccupancy = props.occupancy || null
    if (!baseOccupancy) return null
    if (!localOccupancyUpdate.value) return baseOccupancy

    return {
        ...baseOccupancy,
        ...localOccupancyUpdate.value
    }
})

const imageUrl = computed(() => props.item.id ?
  `src/assets/images/${props.item.id}.jpg` :
  'https://cdn.quasar.dev/img/parallax2.jpg')

const occupancyPercent = computed(() => {
    const count = occupancyItem.value?.count || 0
    const capacity = props.item.capacity || 1
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
const differenceIntime = ref(occupancyItem.value?.differenceIntime ?? 0)

// Ref to trigger useAuditoryOccupancy when refresh is needed
const refreshTrigger = ref({ id: props.item?.id })

// Use the composable with the trigger ref
const { auditoryOccupancy } = useAuditoryOccupancy(
    refreshTrigger,
    props.url,
    {
        optionalUrl: 'occupancy',
        loading: false,
        notify: true
    }
)

// Watch the result from useAuditoryOccupancy and merge fields
watch(auditoryOccupancy, (newOccupancy) => {
    if (newOccupancy) {
        localOccupancyUpdate.value = {
            id: newOccupancy.id,
            count: newOccupancy.count,
            timestamp: newOccupancy.timestamp,
            isValid: newOccupancy.isValid,
            differenceIntime: newOccupancy.differenceIntime,
            warning: newOccupancy.warning
        }
    }
})

// Function to trigger refresh
function refreshOccupancy() {
    refreshTrigger.value = { id: props.item?.id, _refresh: Date.now() }
}

const interval = setInterval(() => {
    differenceIntime.value = differenceIntime.value + 0.1
    if (differenceIntime.value >= 2) {
        refreshOccupancy()
    }
}, 10 * 1000)

onUnmounted(() => clearInterval(interval))

function onSave(updatedItem) {
    console.log(updatedItem)
}
</script>
