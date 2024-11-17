import stripe from 'src/pk_live.js'
import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { Loading } from 'quasar'
import { ref as dbRef, update } from 'firebase/database'
import { db } from 'boot/firebase'
import { apiAxios } from 'boot/axios'
import { showErrorMessage } from 'src/composables/show-error-message.js'
import { useUserStore } from 'stores/user-store'

export const useStripeStore = defineStore('stripe', () => {
  const userStore = useUserStore()
  const { userData } = storeToRefs(userStore)

  const shippingDetails = ref({})
  const cart = ref({})

  const cartCounter = computed(() =>
    Object.values(cart.value).reduce((result, item) => result + +item.quantity, 0)
  )
  const updateCart = ({ key, value }) => {
    if (value === 'delete') {
      delete cart.value[key]
    } else {
      cart.value[key] = value
    }
  }
  const changeQuantityProduct = ({ quantity, index }) => (cart.value[index].quantity = quantity)

  const addProductToCart = async (product) => {
    console.log('addProductToCart --', product)
    try {
      Loading.show()
      if (product.delete) {
        await update(dbRef(db, `users/${userData.value.userId}/cart`), { [product.id]: null })
      } else if (product.change) {
        await update(dbRef(db, `users/${userData.value.userId}/cart/${product.id}`), {
          quantity: +product.quantity
        })
      } else if (cart.value[product.id]) {
        await update(dbRef(db, `users/${userData.value.userId}/cart/${product.id}`), {
          quantity: +cart.value[product.id].quantity + 1
        })
      } else {
        await update(dbRef(db, `users/${userData.value.userId}/cart/${product.id}`), product)
      }
      Loading.hide()
    } catch (error) {
      showErrorMessage(error.message)
      throw error
    }
  }
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
    updateCart,
    addProductToCart,
    changeQuantityProduct,
    payStripe
  }
})
