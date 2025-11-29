import { useCitiesStore } from 'src/stores/cities'
const routes = [
  {
    path: '/',
    name: "mainMenu",
    alias: ['/mainMenu', '/home', '/index'],
    component: () => import('layouts/AppMenu.vue'),
    children: [{
      path: '',
      name: 'viewMenu',
      component: () => import('src/pages/MainMenu.vue')
    }],
  },
  {
    path: '/occupancy/:cityId(\\d+)/:slug?',
    name: 'showOccupancy',
    component: () => import('layouts/ShowOccupancy.vue'),
    props: route => ({
      cityId: parseInt(route.params.cityId),
      slug: route.params.slug || ''
    }),
    async beforeEnter (to, from, next) {
      const citiesStore = useCitiesStore()

      if (!citiesStore.loaded) {
        try {
          await citiesStore.fetchCities()
        } catch (err) {
          console.error('Cities load failed in route guard', err)
          next({ name: 'Error' })
          return
        }
      }

      const city = citiesStore.findCityById(to.params.cityId)

      if (!city) {
        next( { name: 'Error' } )
        return
      }

      const expectedSlug = citiesStore.getSlugByCityId(city.id)

      if (to.params.slug !== expectedSlug) {
        next({
          name: 'showOccupancy',
          params: { cityId: parseInt(city.id), slug: expectedSlug },
          query: to.query
        })
      } else {
        next()
      }
    },
    children: [
      {
        path: '',
        name: 'NoOccupancySelected',
        component: () => import('pages/NoOccupancySelected.vue')
      },
      {
        path: ':buildingId(\\d+)',
        name: 'viewOccupancy',
        component: () => import('pages/ViewOccupancy.vue'),
        props: route => ({
          cityId: parseInt(route.params.cityId),
          slug: route.params.slug || '',
          buildingId: route.params.buildingId })
      }
    ],
  },
  {
    path: '/statistics',
    name: 'showStatistics',
    component: () => import('layouts/ShowStatistics.vue'),
    children:
    [{
      path: '',
      name: 'viewStatistics',
      component: () => import('src/pages/ViewStatistics.vue')
    }],
  },
  {
    path: '/attendance',
    name: 'showAttendance',
    component: () => import('layouts/ShowAttendance.vue'),
    children: [{
      path: '',
      name: 'viewAttendance',
      component: () => import('src/pages/ViewAttendance.vue')
    }],
  },
  {
    path: '/users',
    name: 'showUsers',
    component: () => import('src/layouts/ShowUsers.vue'),
    children: [{
      path: '',
      name: 'viewUsers',
      component: () => import('src/pages/ViewUsers.vue')
    }],
  },
  {
    path: '/settings',
    name: 'showSettings',
    component: () => import('src/layouts/ShowSettings.vue'),
    children: [{
      path: '',
      name: 'viewSettings',
      component: () => import('src/pages/ViewSettings.vue')
    }],
  },
  {
    path: '/:catchAll(.*)*',
    name: 'Error',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
