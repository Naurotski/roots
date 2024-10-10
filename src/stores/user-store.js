import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Loading } from 'quasar'
import { db } from 'boot/firebase.js'
import { ref as dbRef, update } from 'firebase/database'
import { storage } from 'boot/firebase.js'
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

  return {
    userData,
    setUserData,
    updateUser,
    uploadImageToStorage
  }
})
