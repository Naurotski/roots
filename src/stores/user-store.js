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
  const subscriptionsData = {
    month: {
      name: 'subscription.monthlyAccess',
      price: '€9.99',
      interval: 'subscription.month',
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/roots-a7a88.appspot.com/o/subscription%2FPhotoStub.png?alt=media&token=2e76a26d-2a14-4eda-b613-bdcd17c8af2c',
      list: [
        'subscription.monthList.oneMonth',
        'subscription.monthList.immersive',
        'subscription.monthList.information',
        'subscription.monthList.video',
        'subscription.monthList.purchaseArtworks',
        'subscription.monthList.purchaseNFT'
      ],
      btnLabel: ['subscription.yourCurrentPlan', 'subscription.subscribeNow']
    },
    year: {
      name: 'subscription.annualAccess',
      price: '€99.99',
      interval: 'subscription.year',
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/roots-a7a88.appspot.com/o/subscription%2FARTStub.png?alt=media&token=f062d68a-9242-4271-a220-af4e94e536b2',
      list: [
        'subscription.yearList.fullAccess',
        'subscription.yearList.immersive',
        'subscription.yearList.information',
        'subscription.monthList.video',
        'subscription.monthList.purchaseArtworks',
        'subscription.monthList.purchaseNFT',
        'subscription.yearList.updates',
        'subscription.yearList.possibility',
        'subscription.yearList.choose'
      ],
      btnLabel: ['subscription.upgradePlan', 'subscription.subscribeNow']
    }
  }
  const userData = ref({})
  const listOrders = ref({})
  const listSubscriptions = ref({})

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
  const updateUserData = ({ key, value }) => {
    userData.value[key] = value
  }
  const updateListOrders = ({ key, value }) => {
    if (value === 'logoutUser') {
      listOrders.value = {}
    } else {
      listOrders.value[key] = value
    }
  }
  const updateListSubscriptions = ({ key, value }) => {
    if (value === 'logoutUser') {
      listSubscriptions.value = {}
    } else {
      listSubscriptions.value[key] = value
    }
  }
  const updateUser = async ({ path, payload }) => {
    console.log('updateUser -------', path, payload)
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
    subscriptionsData,
    userData,
    listOrders,
    listSubscriptions,
    setUserData,
    updateUserData,
    updateListOrders,
    updateListSubscriptions,
    updateUser,
    uploadImageToStorage,
    updateUserEmail,
    reauthenticate,
    sendPasswordReset
  }
})
