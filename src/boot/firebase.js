// import { boot } from 'quasar/wrappers'
import { initializeApp } from 'firebase/app'
import firebaseConfig from 'app/firebaseConfig.js'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getDatabase(app)
export { auth, db }

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
// export default boot(async (/* { app, router, ... } */) => {
// something to do
// })
