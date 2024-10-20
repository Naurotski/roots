import { defineStore, storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { Loading, LocalStorage } from 'quasar'
import { auth, db } from 'boot/firebase.js'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  sendEmailVerification
} from 'firebase/auth'
import { ref as dbRef, set, onValue, off } from 'firebase/database'
import { useUserStore } from 'stores/user-store.js'
import { showErrorMessage } from 'src/composables/show-error-message.js'
export const useAuthStore = defineStore('auth', () => {
  const loginDialog = ref(false)
  const loggedIn = ref(false)
  const providerGoogle = new GoogleAuthProvider()

  const userStore = useUserStore()
  const { userData } = storeToRefs(userStore)
  const { setUserData } = userStore

  watch(loggedIn, (val) => {
    if (val) loginDialog.value = false
  })

  const showLoginDialog = (val) => (loginDialog.value = val)

  const registerUser = async ({ displayName, email, password }) => {
    console.log('registerUser')
    try {
      Loading.show()
      const response = await createUserWithEmailAndPassword(auth, email, password)
      console.log(response.user.uid)
      await updateProfile(auth.currentUser, { displayName })
      await set(dbRef(db, `users/${response.user.uid}`), {
        userId: response.user.uid
      })
      setUserData({
        displayName
      })
      await sendEmailVerification(auth.currentUser, {
        url: 'https://aortagallery.com'
      })
      Loading.hide()
    } catch (error) {
      showErrorMessage(error.message.match(/\((.*?)\)/)[1])
      throw error
    }
  }
  const loginUser = async ({ email, password }) => {
    console.log('loginUser')
    try {
      Loading.show()
      const result = await signInWithEmailAndPassword(auth, email, password)
      Loading.hide()
      return result
    } catch (error) {
      showErrorMessage(error.message.match(/\((.*?)\)/)[1])
      throw error
    }
  }
  const logInGoogle = async () => {
    console.log('logInGoogle')
    try {
      Loading.show()
      const result = await signInWithPopup(auth, providerGoogle)
      console.log(result)
      if (result._tokenResponse.isNewUser) {
        console.log(result._tokenResponse.isNewUser)
        await set(dbRef(db, `users/${result.user.uid}`), {
          userId: result.user.uid,
          firstName: result.user.displayName.split(' ')[0] || '',
          lastName: result.user.displayName.split(' ')[1] || '',
          displayPhotoURL: result.user.photoURL
        })
      }
      Loading.hide()
      return result
    } catch (error) {
      if (error.message !== 'Firebase: Error (auth/popup-closed-by-user).') {
        showErrorMessage(error.message)
      } else {
        Loading.hide()
      }
      throw error
    }
  }
  const logoutUser = async () => {
    console.log('logoutUser')
    try {
      Loading.show()
      await off(dbRef(db, `users/${userData.value.userId}`))
      await signOut(auth)
      Loading.hide()
    } catch (error) {
      showErrorMessage(error.message.match(/\((.*?)\)/)[1])
      throw error
    }
  }
  const handleAuthStateChange = () => {
    console.log('handleAuthStateChange')
    onAuthStateChanged(auth, (user) => {
      Loading.hide()
      if (user) {
        console.log('onAuthStateChanged-user - ', user)
        loggedIn.value = true
        LocalStorage.set('loggedIn', true)
        setUserData({
          displayName: user.displayName?.split(' ')[0] || '',
          email: user.email,
          emailVerified: user.emailVerified,
          providerId: user.providerData[0].providerId
        })
        onValue(dbRef(db, `users/${user.uid}`), (snapshot) => {
          const data = snapshot.val()
          console.log('onValue-userUid - ', data)
          setUserData(data)
        })
      } else {
        console.log('onAuthStateChanged -  No user')
        setUserData('logoutUser')
        loggedIn.value = false
        LocalStorage.set('loggedIn', false)
      }
    })
  }
  const checkUserExistence = async (email) => {
    console.log('checkUserExistence =======', email)
    try {
      Loading.show()
      const result = await fetchSignInMethodsForEmail(auth, email)
      Loading.hide()
      return result
    } catch (error) {
      showErrorMessage(error.message)
      throw error
    }
  }
  return {
    loginDialog,
    loggedIn,
    userData,
    showLoginDialog,
    registerUser,
    loginUser,
    logInGoogle,
    logoutUser,
    handleAuthStateChange,
    checkUserExistence
  }
})
