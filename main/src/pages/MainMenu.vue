<template>
    <q-page class="column">
        <div class="full-width full-height bg-secondary col items-center"
        style="padding: 10% 20%;">
            <q-card class="q-pa-xl" bordered style="border-radius: 2rem;">
                <q-list separator>
                    <q-item
                        v-for="item in menuList"
                        :key="item.id"
                        :clickable="item.isClickable"
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
            <TheCitySelectDialog
                v-model="chooseCityDialog"
                @citySelected="handleCitySelect"
            />
        </div>
    </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TheCitySelectDialog from 'src/components/TheCitySelectDialog.vue'

const router = useRouter()
const chooseCityDialog = ref(false)
const targetRouteName = ref('')

function pushRoute(routeName, parameters) {
    router.push({ name: routeName, params: parameters })
}

function chooseCity(routeName) {
    targetRouteName.value = routeName
    chooseCityDialog.value = true
}

function handleCitySelect(cityId) {
    pushRoute(targetRouteName.value, { cityId: cityId })
}

const text = 'mainMenu'
const menuList = {
    occupancy: {
        id: 1,
        text: text + '.occupancy',
        whatToDo: () => chooseCity('showOccupancy'),
        isClickable: true
    },
    statistics: {
        id: 2,
        text: text + '.statistics',
        whatToDo: () => chooseCity('viewStatistics'),
        isClickable: true
    },
    attendance: {
        id: 3,
        text: text + '.attendance',
        whatToDo: () => pushRoute('viewAttendance', {}),
        isClickable: false
    },
    users: {
        id: 4,
        text: text + '.users',
        whatToDo: () => pushRoute('viewUsers', {}),
        isClickable: false
    },
    settings: {
        id: 5,
        text: text + '.settings',
        whatToDo: () => pushRoute('viewSettings', {}),
        isClickable: false
    }
}
</script>

<style scoped>
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