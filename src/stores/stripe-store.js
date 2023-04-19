import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { showErrorMessage } from 'src/composables/show-error-message.js'
import stripe from 'src/pk_live.js'
import { Loading } from 'quasar'

export const useStripeStore = defineStore('stripe', () => {
  const payStripe = async (paymentDetails) => {
    Loading.show()
    try {
      const response = await api.post('/payStripePictures', { ...paymentDetails })
      await stripe.redirectToCheckout({
        sessionId: response.data
      })
      Loading.hide()
    } catch (error) {
      Loading.hide()
      showErrorMessage(error.message)
      throw error
    }
  }
  return { payStripe }
})
