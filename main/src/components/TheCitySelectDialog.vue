<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
        <q-card class="menu-card q-pa-xl">
            <q-card-section>
                <div v-if="loading">
                    {{ $t('menu.loading') }}
                </div>
                <div v-else-if="error" class="q-pa-md text-center">
                    {{ $t('menu.error') }}
                </div>
                <q-list v-else-if="citiesStore.cities.length > 0">
                    <q-item
                        v-for="city in citiesStore.cities"
                        :key="city.id"
                        clickable
                        class="menu-item"
                        @click="handleCitySelect(city.id)"
                    >
                        <q-item-section>
                            {{ city[`name_${$i18n.locale}`] }}
                        </q-item-section>
                    </q-item>
                </q-list>
                <div v-else>
                    {{ $t('menu.noCities') }}
                </div>
            </q-card-section>
            <q-card-actions align="center">
                <q-btn flat :label="$t('popUps.cancel')"
                    color="primary"
                    v-close-popup
                    size="lg"
                    class="full-width"
                    />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useCitiesStore } from 'src/stores/cities.store'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'citySelected'])

const citiesStore = useCitiesStore()
const loading = ref(false)
const error = ref(false)

async function loadCities() {
    loading.value = true
    error.value = false
    try {
        await citiesStore.fetchCities()
    } catch (err) {
        console.error('Cities load failed', err)
        error.value = true
    } finally {
        loading.value = false
    }
}

function handleCitySelect(cityId) {
    emit('update:modelValue', false)
    emit('citySelected', parseInt(cityId))
}

watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        loadCities()
    }
})
</script>

<style scoped>
.menu-card {
  border-radius: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: #fff;
  min-width: 60%;
}

.menu-item {
  border-radius: 1rem;
  background: #e3e9f5;
  text-align: center;
  margin-bottom: 5%;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: #d0d9e7;
}

.menu-item:last-child {
    margin-bottom: 0;
}
</style>

