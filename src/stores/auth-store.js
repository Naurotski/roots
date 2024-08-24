import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Loading, LocalStorage } from 'quasar'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { ref as dbRef, set } from 'firebase/database'
import { auth, db } from 'boot/firebase.js'

import { showErrorMessage } from 'src/composables/show-error-message.js'
export const useAuthStore = defineStore('auth', () => {
  const loggedIn = ref(false)
  const userData = ref({})

  const registerUser = async ({ displayName, email, password }) => {
    console.log('registerUser')
    try {
      Loading.show()
      const response = await createUserWithEmailAndPassword(auth, email, password)
      console.log(response.user.uid)
      await updateProfile(auth.currentUser, { displayName })
      await set(dbRef(db, `users/${response.user.uid}`), {
        email
      })
      Loading.hide()
    } catch (error) {
      showErrorMessage(error.message)
      throw error
    }
  }
  const loginUser = async ({ email, password }) => {
    console.log('loginUser')
    try {
      Loading.show()
      await signInWithEmailAndPassword(auth, email, password)
      Loading.hide()
    } catch (error) {
      showErrorMessage(error.message)
      throw error
    }
  }
  const logoutUser = async () => {
    console.log('logoutUser')
    try {
      Loading.show()
      await signOut(auth)
      Loading.hide()
    } catch (error) {
      showErrorMessage(error.message)
      throw error
    }
  }
  function handleAuthStateChange() {
    console.log('handleAuthStateChange')
    onAuthStateChanged(auth, async (user) => {
      Loading.hide()
      if (user) {
        console.log('onAuthStateChanged-user - ', user)
        loggedIn.value = true
        LocalStorage.set('loggedIn', true)
        userData.value = { userId: user.uid, displayName: user.displayName, email: user.email }
      } else {
        console.log('onAuthStateChanged -  No user')
        console.log(this.router.options.history.location)
        userData.value = {}
        loggedIn.value = false
        LocalStorage.set('loggedIn', false)
        if (this.router.options.history.location === '/account') this.router.replace('/')
      }
    })
  }
  return {
    loggedIn,
    userData,
    registerUser,
    loginUser,
    logoutUser,
    handleAuthStateChange
  }
})
