import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { showErrorMessage } from 'src/composables/show-error-message.js'
import stripe from 'src/pk_live.js'

export const useStripeStore = defineStore('stripe', () => {
  const payStripe = async (paymentDetails) => {
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
