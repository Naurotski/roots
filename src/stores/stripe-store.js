import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { Loading } from 'quasar'
import { showErrorMessage } from 'src/composables/show-error-message.js'

export const useStripeStore = defineStore('stripe', () => {
  const payStripe = async (paymentDetails) => {
    console.log('payStripe')
    Loading.show()
    try {
      const response = await api.post('/payStripeRoots', { ...paymentDetails })
      console.log(response.data)
      Loading.hide()
    } catch (error) {
      Loading.hide()
      showErrorMessage(error.message)
      throw error
    }
  }
  return { payStripe }
})
