import { boot } from 'quasar/wrappers'
import { initializeApp } from 'firebase/app'
import firebaseConfig from 'app/firebaseConfig.js'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getAnalytics } from 'firebase/analytics'
import { useAuthStore } from 'stores/auth-store.js'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getDatabase(app)
const analytics = getAnalytics(app)
export { auth, db, analytics }

export default boot(() => {
  const { handleAuthStateChange } = useAuthStore()
  handleAuthStateChange()
})
