const routes = [
  {
    path: '/',
    name: "mainMenu",
    component: () => import('layouts/AppMenu.vue'),
    children: [{
      path: '',
      name: 'viewMenu',
      component: () => import('src/pages/MainMenu.vue')
    }],
  },
  {
    path: '/occupancy',
    name: 'showOccupancy',
    component: () => import('layouts/ShowOccupancy.vue'),
    children: [
    {
      path: '',
      name: 'viewOccupancy',
      component: () => import('pages/ViewOccupancy.vue')
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
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
