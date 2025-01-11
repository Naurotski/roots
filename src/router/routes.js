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
          {
            path: '/home',
            name: 'Home',
            alias: '',
            component: () => import('pages/HomePage.vue')
          },
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
          {
            path: 'about',
            name: 'About',
            props: true,
            component: () => import('pages/AboutPage.vue')
          },
          {
            path: '/actions/:typeAction',
            name: 'ActionsPage',
            props: true,
            component: () => import('pages/ActionsPage.vue')
          },
          {
            path: 'work/:workId',
            name: 'Work',
            props: true,
            component: () => import('pages/WorkPage.vue')
          },
          {
            path: 'merch/:rubric/:id',
            name: 'Merch',
            props: true,
            component: () => import('pages/MerchPage.vue')
          },
          {
            path: 'sale',
            name: 'Sale',
            props: true,
            component: () => import('pages/SalePage.vue')
          },
          {
            path: 'shop',
            name: 'Shop',
            props: true,
            component: () => import('pages/ShopPage.vue')
          },
          {
            path: 'basket',
            name: 'Basket',
            props: true,
            component: () => import('pages/BasketPage.vue')
          },
          {
            path: 'account',
            name: 'Your Account',
            component: () => import('pages/YourAccountPage.vue')
          },

          {
            path: 'press/:idPress',
            name: 'Press',
            props: true,
            component: () => import('pages/PressPage.vue')
          },
          {
            path: 'privacy',
            name: 'Privacy',
            component: () => import('pages/PrivacyPolicy.vue')
          },
          {
            path: 'termsSale',
            name: 'Terms of Sale',
            component: () => import('pages/TermsOfSale.vue')
          }
        ]
      },
      {
        path: '/thankYou/:id',
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
