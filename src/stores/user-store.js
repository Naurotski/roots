import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Loading } from 'quasar'
import { auth, db, storage } from 'boot/firebase.js'
import {
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  FacebookAuthProvider,
  reauthenticateWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth'
import { ref as dbRef, update } from 'firebase/database'
import { getDownloadURL, ref as storageRef, uploadString } from 'firebase/storage'
import { showErrorMessage } from 'src/composables/show-error-message.js'

export const useUserStore = defineStore('user', () => {
  const userData = ref({})

  const setUserData = (data) => {
    if (data === 'logoutUser') {
      userData.value = {}
    } else {
      userData.value = {
        ...userData.value,
        ...data
      }
    }
  }
  const updateUser = async ({ path, payload }) => {
    try {
      Loading.show()
      await update(dbRef(db, path), payload)
      Loading.hide()
    } catch (error) {
      showErrorMessage(error.message)
      throw error
    }
  }
  const uploadImageToStorage = async ({ path, url, stringEncodingType, contentType }) => {
    try {
      Loading.show()
      if (url) {
        let imagesRef = storageRef(storage, `${path}`)
        await uploadString(imagesRef, url, stringEncodingType, { contentType })
        return await getDownloadURL(imagesRef)
      }
      Loading.hide()
    } catch (error) {
      showErrorMessage(error.message)
      throw error
    }
  }
  const updateUserEmail = async (newEmail) => {
    try {
      Loading.show()
      await updateEmail(auth.currentUser, newEmail)
      Loading.hide()
      await sendEmailVerification(auth.currentUser, {
        url: 'https://aortagallery.com'
      })
    } catch (error) {
      Loading.hide()
      if (error.message.match(/\((.*?)\)/)[1] !== 'auth/requires-recent-login') {
        if (error.name === 'FirebaseError') {
          showErrorMessage(error.message.match(/\(([^)]+)\)/)[1].replace(/auth\/|-/g, ' '))
        } else {
          showErrorMessage(error.message)
        }
      }
      throw error
    }
  }

  const reauthenticate = async (password) => {
    try {
      if (userData.value.providerId === 'password') {
        const credential = EmailAuthProvider.credential(userData.value.email, password)
        await reauthenticateWithCredential(auth.currentUser, credential)
      } else {
        let provider
        if (userData.value.providerId === 'google.com') {
          provider = new GoogleAuthProvider()
        } else if (userData.value.providerId === 'facebook.com') {
          provider = new FacebookAuthProvider()
        }
        await reauthenticateWithPopup(auth.currentUser, provider)
      }
    } catch (error) {
      showErrorMessage(error.message)
      throw error
    }
  }
  const sendPasswordReset = async (email = userData.value.email) => {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: 'https://aortagallery.com'
      })
    } catch (error) {
      if (error.message !== 'Firebase: Error (auth/user-not-found).') {
        showErrorMessage(error.message)
      }
      throw error
    }
  }
  return {
    userData,
    setUserData,
    updateUser,
    uploadImageToStorage,
    updateUserEmail,
    reauthenticate,
    sendPasswordReset
  }
})
