import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { Loading } from 'quasar'
import { showErrorMessage } from 'src/composables/show-error-message.js'
import stripe from 'src/pk_live.js'

export const useStripeStore = defineStore('stripe', () => {
  const payStripe = async (paymentDetails) => {
    console.log('payStripe')
    Loading.show()
    try {
      const response = await api.post('/payStripePictures', { ...paymentDetails })
      await stripe.redirectToCheckout({
        sessionId: response.data
      })
    } catch (error) {
      showErrorMessage(error.message)
      throw error
    }
  }
  return { payStripe }
})
