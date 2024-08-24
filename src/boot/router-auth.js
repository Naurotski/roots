import { boot } from 'quasar/wrappers'
import { LocalStorage } from 'quasar'

export default boot(({ router }) => {
  router.beforeEach((to) => {
    if (!LocalStorage.getItem('loggedIn') && to.name === 'Your Account') return { name: 'Home' }
  })
})
