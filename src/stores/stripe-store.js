import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import stripe from 'src/pk_live.js'
import { Loading } from 'quasar'
import { apiAxios } from 'boot/axios'
import { showErrorMessage } from 'src/composables/show-error-message.js'

export const useStripeStore = defineStore('stripe', () => {
  const shippingDetails = ref({})
  const cart = ref([])

  const cartCounter = computed(() =>
    cart.value.reduce((result, item) => result + +item.quantity, 0)
  )

  const changeShippingDetails = (data) => (shippingDetails.value = data)
  const addProductToCart = (product) => {
    let index = cart.value.findIndex((item) => item.id === product.id)
    if (index === -1) {
      cart.value.push(product)
    } else {
      cart.value[index].quantity += 1
    }
  }
  const changeQuantityProduct = ({ quantity, index }) => (cart.value[index].quantity = quantity)
  const deleteProductToCart = ( index ) => cart.value.splice(index, 1)
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
    cart,
    cartCounter,
    changeShippingDetails,
    addProductToCart,
    changeQuantityProduct,
    deleteProductToCart,
    payStripe
  }
})
