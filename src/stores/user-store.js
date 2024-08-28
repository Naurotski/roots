import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ref as dbRef, update } from 'firebase/database'
import { db } from 'boot/firebase.js'
import { showErrorMessage } from 'src/composables/show-error-message.js'
import { Loading } from 'quasar'

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
    console.log('updateUser - ', path, payload)
    try {
      Loading.show()
      await update(dbRef(db, path), payload)
      Loading.hide()
    } catch (error) {
      showErrorMessage(error.message)
      throw error
    }
  }
  return {
    userData,
    setUserData,
    updateUser
  }
})
