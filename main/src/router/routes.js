import { useCitiesStore } from 'src/stores/cities.store'

async function checkCityId (to, from, next) {
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
      name: to.name,
      params: { cityId: parseInt(city.id), slug: expectedSlug },
      query: to.query
    })
  } else {
    next()
  }
}

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
    component: () => import('src/layouts/OccupancyLayout.vue'),
    props: route => ({
      cityId: parseInt(route.params.cityId),
      slug: route.params.slug || ''
    }),
    beforeEnter : [checkCityId],
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
          buildingId: parseInt(route.params.buildingId) })
      },
      {
        path: 'error',
        name: 'viewOccupancyError',
        component: () => import('pages/ViewOccupancyError.vue')
      }
    ],
  },
  {
    path: '/statistics/:cityId(\\d+)/:slug?',
    name: 'showStatistics',
    component: () => import('src/layouts/StatisticsLayout.vue'),
    props: route => ({
      cityId: parseInt(route.params.cityId),
      slug: route.params.slug || ''
    }),
    beforeEnter : [checkCityId],
    children: [
      {
        path: '',
        name: 'viewStatistics',
        component: () => import('pages/ViewStatistics.vue'),
        props: route => ({
          cityId: parseInt(route.params.cityId),
          slug: route.params.slug || ''
        })
      }
    ],
  },
  {
    path: '/attendance',
    name: 'showAttendance',
    component: () => import('src/layouts/AttendanceLayout.vue'),
    children: [{
      path: '',
      name: 'viewAttendance',
      component: () => import('src/pages/ViewAttendance.vue')
    }],
  },
  {
    path: '/users',
    name: 'showUsers',
    component: () => import('src/layouts/UsersLayout.vue'),
    children: [{
      path: '',
      name: 'viewUsers',
      component: () => import('src/pages/ViewUsers.vue')
    }],
  },
  {
    path: '/settings',
    name: 'showSettings',
    component: () => import('src/layouts/SettingsLayout.vue'),
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
