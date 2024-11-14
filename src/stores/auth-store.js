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
  FacebookAuthProvider,
  sendEmailVerification
} from 'firebase/auth'
import { ref as dbRef, set, off } from 'firebase/database'
import { useUserStore } from 'stores/user-store.js'
import { showErrorMessage } from 'src/composables/show-error-message.js'
import { listenForChildUser } from 'src/composables/listenForChildUser'

export const useAuthStore = defineStore('auth', () => {
  const loginDialog = ref(false)
  const loggedIn = ref(false)
  const providerGoogle = new GoogleAuthProvider()
  const providerFacebook = new FacebookAuthProvider()

  const userStore = useUserStore()
  const { userData, ordersArtWorks } = storeToRefs(userStore)
  const { setUserData } = userStore

  watch(loggedIn, (val) => {
    if (val) loginDialog.value = false
  })

  const showLoginDialog = (val) => (loginDialog.value = val)

  const registerUser = async ({ displayName, email, password }) => {
    try {
      Loading.show()
      const response = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(auth.currentUser, { displayName })
      await set(dbRef(db, `users/${response.user.uid}/userData`), {
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
    try {
      const result = await signInWithPopup(auth, providerGoogle)
      if (result._tokenResponse.isNewUser) {
        await set(dbRef(db, `users/${result.user.uid}/userData`), {
          userId: result.user.uid,
          firstName: result.user.displayName.split(' ')[0] || '',
          lastName: result.user.displayName.split(' ')[1] || '',
          displayPhotoURL: result.user.photoURL
        })
      }
      return result
    } catch (error) {
      if (error.message !== 'Firebase: Error (auth/popup-closed-by-user).') {
        showErrorMessage(error.message)
      }
      throw error
    }
  }
  const logInFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, providerFacebook)
      if (result._tokenResponse.isNewUser) {
        await set(dbRef(db, `users/${result.user.uid}/userData`), {
          userId: result.user.uid,
          firstName: result.user.displayName.split(' ')[0] || '',
          lastName: result.user.displayName.split(' ')[1] || '',
          displayPhotoURL: result.user.photoURL
        })
        if (!result.user.emailVerified) {
          await sendEmailVerification(auth.currentUser, {
            url: 'https://aortagallery.com'
          })
        }
      }
      return result
    } catch (error) {
      if (error.message !== 'Firebase: Error (auth/popup-closed-by-user).') {
        showErrorMessage(error.message)
      }
      throw error
    }
  }
  const logoutUser = async () => {
    try {
      Loading.show()
      await off(dbRef(db, `users/${userData.value.userId}/userData`))
      await off(dbRef(db, `users/${userData.value.userId}/orders/artWorks`))
      await off(dbRef(db, `users/${userData.value.userId}/cart`))
      await signOut(auth)
      Loading.hide()
    } catch (error) {
      showErrorMessage(error.message.match(/\((.*?)\)/)[1])
      throw error
    }
  }
  const handleAuthStateChange = () => {
    onAuthStateChanged(auth, (user) => {
      Loading.hide()
      if (user) {
        loggedIn.value = true
        LocalStorage.set('loggedIn', true)
        setUserData({
          displayName: user.displayName?.split(' ')[0] || '',
          email: user.email,
          emailVerified: user.emailVerified,
          providerId: user.providerData[0].providerId,
          userId: user.uid
        })
        listenForChildUser(user.uid, 'userData')
        listenForChildUser(user.uid, 'orders/artWorks')
        listenForChildUser(user.uid, 'cart')
      } else {
        setUserData('logoutUser')
        loggedIn.value = false
        ordersArtWorks.value = {}
        LocalStorage.set('loggedIn', false)
      }
    })
  }
  const checkUserExistence = async (email) => {
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
    logInFacebook,
    logoutUser,
    handleAuthStateChange,
    checkUserExistence
  }
})
