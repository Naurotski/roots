const isMaintenanceMode = false

const routes = isMaintenanceMode
  ? [
      {
        path: '/:catchAll(.*)*',
        component: () => import('pages/MaintenancePage.vue')
      }
    ]
  : [
      {
        path: '/',
        component: () => import('layouts/Layout.vue'),
        children: [
          { path: '/home', name: 'Home', alias: '', component: () => import('pages/HomePage.vue') },
          {
            path: 'artists',
            name: 'Artists',
            component: () => import('pages/ArtistsListPage.vue')
          },
          {
            path: '/artists/:artistId',
            name: 'ArtistProfile',
            props: true,
            component: () => import('pages/ArtistProfilePage.vue')
          },
          { path: 'about', name: 'About', component: () => import('pages/AboutPage.vue') },
          {
            path: '/actions/:typeAction',
            name: 'ActionsPage',
            props: true,
            component: () => import('pages/ActionsPage.vue')
          },
          { path: 'sale', name: 'Sale', component: () => import('pages/SalePage.vue') },
          {
            path: 'account',
            name: 'Your Account',
            component: () => import('pages/YourAccountPage.vue')
          },
          {
            path: 'work/:workId',
            props: true,
            name: 'Work',
            component: () => import('pages/WorkPage.vue')
          },
          {
            path: 'press/:idPress',
            props: true,
            name: 'Press',
            component: () => import('pages/PressPage.vue')
          },
          {
            path: 'privacy',
            props: true,
            name: 'Privacy',
            component: () => import('pages/PrivacyPolicy.vue')
          },
          {
            path: 'termsSale',
            props: true,
            name: 'Terms of Sale',
            component: () => import('pages/TermsOfSale.vue')
          }
        ]
      },
      {
        path: '/thankYou/:workId',
        name: 'ThankYou',
        props: true,
        component: () => import('pages/ThankYouPage.vue')
      },
      // Always leave this as last one,
      // but you can also remove it
      {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue')
      }
    ]

export default routes
