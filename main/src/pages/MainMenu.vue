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
                        @click="$router.push({ name: item.link })"
                        class="menu-item"
                    >
                        <q-item-section>
                            {{ $t(item.text) }}
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
const text = 'mainMenu'
const menuList = {
    occupancy: {
        id: 1,
        text: text + '.occupancy',
        link: 'viewOccupancy'
    },
    statistics: {
        id: 2,
        text: text + '.statistics',
        link: 'viewStatistics'
    },
    attendance: {
        id: 3,
        text: text + '.attendance',
        link: 'viewAttendance'
    },
    users: {
        id: 4,
        text: text + '.users',
        link: 'viewUsers'
    },
    settings: {
        id: 5,
        text: text + '.settings',
        link: 'viewSettings'
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