// import { boot } from 'quasar/wrappers'
import { initializeApp } from 'firebase/app'
import firebaseConfig from 'app/firebaseConfig.js'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getAnalytics } from 'firebase/analytics'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getDatabase(app)
const analytics = getAnalytics(app)
export { auth, db, analytics }

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
// export default boot(async (/* { app, router, ... } */) => {
// something to do
// })
