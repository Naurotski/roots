import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import stripe from 'src/pk_live.js'
import { Loading } from 'quasar'
import { apiAxios } from 'boot/axios'
import { showErrorMessage } from 'src/composables/show-error-message.js'

export const useStripeStore = defineStore('stripe', () => {
  const shippingDetails = ref({})
  const cartWork = ref([])

  const cartCounter = computed(() => cartWork.value.length)

  const changeShippingDetails = (data) => (shippingDetails.value = data)
  const addProductToCartWork = (payLoad) => cartWork.value.push(payLoad)

  const payStripe = async (paymentDetails) => {
    Loading.show()
    try {
      const response = await apiAxios.post('/aorta/checkoutSessionsStripe', { ...paymentDetails })
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
  return {
    shippingDetails,
    cartWork,
    cartCounter,
    changeShippingDetails,
    addProductToCartWork,
    payStripe
  }
})
