<template>
    <q-page>
        <div class="q-pa-md bg-secondary column items-center"
        style="padding: 10% 20%; min-width: 100%; min-height: 100%;">
            <q-card class="menu-card q-pa-md">
                <q-list separator>
                    <q-item
                        v-for="item in menuList"
                        :key="item.id"
                        clickable
                        v-ripple
                        @click="item.whatToDo"
                        class="menu-item"
                    >
                        <q-item-section>
                            {{ $t(item.text) }}
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card>
            <q-dialog v-model="chooseCityDialog" persistent>
                <q-card class="menu-card q-pa-md">
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
                            @click="pushRoute('showOccupancy', { cityId: parseInt(city.id) })">
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
                        <q-btn flat :label="$t('popUps.cancel')" color="primary" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
    </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCitiesStore } from 'src/stores/cities'

const router = useRouter()
const chooseCityDialog = ref(false)
const loading = ref(false)
const error = ref(false)
const citiesStore = useCitiesStore()

function pushRoute(routeName, parameters) {
    router.push({ name: routeName, params: parameters })
}

async function chooseCity() {
    chooseCityDialog.value = true
    await loadCities()
}

async function loadCities() {
    loading.value = true
    try {
        await citiesStore.fetchCities()
    } catch (err) {
        console.error('Cities load failed in route guard', err)
        error.value = true
    } finally {
        loading.value = false
    }
}

const text = 'mainMenu'
const menuList = {
    occupancy: {
        id: 1,
        text: text + '.occupancy',
        whatToDo: chooseCity
    },
    statistics: {
        id: 2,
        text: text + '.statistics',
        whatToDo: () => pushRoute('viewStatistics', {})
    },
    attendance: {
        id: 3,
        text: text + '.attendance',
        whatToDo: () => pushRoute('viewAttendance', {})
    },
    users: {
        id: 4,
        text: text + '.users',
        whatToDo: () => pushRoute('viewUsers', {})
    },
    settings: {
        id: 5,
        text: text + '.settings',
        whatToDo: () => pushRoute('viewSettings', {}),
    }
}
</script>

<style scoped>
.menu-card {
  border-radius: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: #fff;
  min-width: 100%;
  padding: 5% 10%;
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