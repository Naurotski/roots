import { boot } from 'quasar/wrappers'
import { initializeApp } from 'firebase/app'
import firebaseConfig from 'app/firebaseConfig.js'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'
import { getAnalytics, logEvent } from 'firebase/analytics'
import { useAuthStore } from 'stores/auth-store.js'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getDatabase(app)
const storage = getStorage(app)
const analytics = getAnalytics(app)
export { auth, db, storage, analytics }

export default boot(({ router }) => {
  const { handleAuthStateChange } = useAuthStore()
  handleAuthStateChange()
  router.afterEach((to) => {
    logEvent(analytics, 'page_view', {
      page_path: to.fullPath
    })
  })
})
