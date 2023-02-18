const routes = [
  {
    path: '/',
    redirect: { name: 'Home' },
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '/home', name: 'Home', component: () => import('pages/HomePage.vue') },
      { path: 'artists', name: 'Artists', component: () => import('pages/ArtistsListPage.vue') },
      {
        path: '/artists/:artistId',
        name: 'ArtistProfile',
        props: true,
        component: () => import('pages/ArtistProfilePage.vue')
      },
      { path: 'about', name: 'About', component: () => import('pages/AboutPage.vue') },
      {
        path: '/exhibitions',
        redirect: '/exhibitions/upcoming',
        name: 'Exhibitions',
        component: () => import('pages/AllExhibitionsPage.vue'),
        children: [
          {
            path: ':timestamp',
            name: 'FilteredDateExhibitionsPage',
            props: true,
            component: () => import('pages/FilteredDateExhibitionsPage.vue')
          }
        ]
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
