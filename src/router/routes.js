const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('pages/HomePage.vue') },
      { path: 'artists', name: 'Artists', component: () => import('pages/ArtistsPage.vue') },
      { path: 'about', name: 'About', component: () => import('pages/AboutPage.vue') },
      {
        path: 'exhibitions',
        name: 'Exhibitions',
        component: () => import('pages/ExhibitionsPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
