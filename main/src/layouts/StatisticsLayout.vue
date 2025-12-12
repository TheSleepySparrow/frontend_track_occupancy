<template>
    <q-layout view="hHh Lpr lFf">
        <TheHeader HeaderName="mainMenu.statistics"
        :showBreadcrumbs="false"
        :city="null"
        :buildingName="null"
        default-route-name="viewStatistics" />
        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup>
import TheHeader from 'src/components/TheHeader.vue'
import { useRoute, useRouter } from 'vue-router'
import { useCitiesStore } from 'src/stores/cities.store'
import { onMounted } from 'vue'

const citiesStore = useCitiesStore()

const router = useRouter()
const route = useRoute()

onMounted(() => {
    router.push({ name: 'viewStatistics', params: { 
        cityId: parseInt(route.params.cityId),
        slug: citiesStore.getSlugByCityId(route.params.cityId)
      }
    })
})
</script>