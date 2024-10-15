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
  sendEmailVerification
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
      Loading.hide()
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
      Loading.hide()
      showErrorMessage(error.message)
      throw error
    }
  }
  const updateUserEmail = async (newEmail) => {
    console.log('updateUserEmail - ', newEmail)
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
        showErrorMessage(error.message)
      }
      throw error
    }
  }

  const reauthenticate = async (password) => {
    console.log('reauthenticate - ', userData.value.email, password)
    try {
      if (userData.value.providerId === 'password') {
        const credential = EmailAuthProvider.credential(userData.value.email, password)
        console.log(credential)
        const result = await reauthenticateWithCredential(auth.currentUser, credential)
        console.log(result)
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
  return {
    userData,
    setUserData,
    updateUser,
    uploadImageToStorage,
    updateUserEmail,
    reauthenticate
  }
})
