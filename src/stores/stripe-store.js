import stripe from 'src/pk_live.js'
import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { Loading, LocalStorage } from 'quasar'
import { get, ref as dbRef, update } from 'firebase/database'
import { db, auth } from 'boot/firebase'
import { apiAxios } from 'boot/axios'
import { showErrorMessage } from 'src/composables/show-error-message.js'
import { useUserStore } from 'stores/user-store'

export const useStripeStore = defineStore('stripe', () => {
  const userStore = useUserStore()
  const { userData } = storeToRefs(userStore)

  const shippingDetails = ref({})
  const cart = ref({})

  const cartCounter = computed(() =>
    Object.values(cart.value).reduce((result, item) => result + +item.quantityCart, 0)
  )

  const changeShippingDetails = (data) => (shippingDetails.value = data)
  const updateCart = ({ key, value }) => {
    if (value === 'delete') {
      delete cart.value[key]
    } else if (value === 'logoutUser') {
      cart.value = {}
    } else if (value.change) {
      cart.value[key].quantityCart = value.quantityCart
    } else if (cart.value[key] && !LocalStorage.getItem('loggedIn')) {
      cart.value[key].quantityCart += 1
    } else {
      cart.value[key] = value
    }
    if (!LocalStorage.getItem('loggedIn')) {
      LocalStorage.set('cart', cart.value)
    }
  }

  const addProductToCart = async (product) => {
    try {
      if (product.delete) {
        await update(dbRef(db, `users/${userData.value.userId}/cart`), { [product.id]: null })
      } else if (product.change) {
        await update(dbRef(db, `users/${userData.value.userId}/cart/${product.id}`), {
          quantityCart: +product.quantityCart
        })
      } else if (cart.value[product.id]) {
        await update(dbRef(db, `users/${userData.value.userId}/cart/${product.id}`), {
          quantityCart: +cart.value[product.id].quantityCart + 1
        })
      } else {
        await update(dbRef(db, `users/${userData.value.userId}/cart/${product.id}`), product)
      }
    } catch (error) {
      showErrorMessage(error.message)
      throw error
    }
  }
  const mergeCarts = async (userId) => {
    try {
      const result = await get(dbRef(db, `users/${userId}/cart`))
      const localObject = result.val() || {}
      let localCart = LocalStorage.getItem('cart')
      for (const key in localCart) {
        updateCart({ key, value: 'delete' })
        if (localObject[key]) {
          localCart[key].quantityCart += localObject[key].quantityCart
        }
        await addProductToCart(localCart[key])
      }
      LocalStorage.removeItem('cart')
    } catch (error) {
      showErrorMessage(error.message)
      throw error
    }
  }
  const payStripe = async (paymentDetails) => {
    Loading.show()
    try {
      const accessToken = await auth.currentUser.getIdToken(true)
      const response = await apiAxios.post(
        '/aorta/checkoutSessionsStripe',
        { ...paymentDetails },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
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
  const payStripeTickets = async (paymentDetails) => {
    Loading.show()
    try {
      const response = await apiAxios.post('/tickets/checkoutSessionsStripe', { ...paymentDetails })
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
    updateCart,
    addProductToCart,
    mergeCarts,
    payStripe,
    payStripeTickets
  }
})
