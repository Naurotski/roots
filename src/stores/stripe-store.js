import stripe from 'src/pk_live.js'
import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { Loading, LocalStorage } from 'quasar'
import { get, ref as dbRef, update } from 'firebase/database'
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

  const changeShippingDetails = (data) => (shippingDetails.value = data)
  const updateCart = ({ key, value }) => {
    if (value === 'delete') {
      delete cart.value[key]
    } else if (value === 'logoutUser') {
      cart.value = {}
    } else if (value.change) {
      cart.value[key].quantity = value.quantity
    } else if (cart.value[key] && !LocalStorage.getItem('loggedIn')) {
      cart.value[key].quantity += 1
    } else {
      cart.value[key] = value
    }
    if (!LocalStorage.getItem('loggedIn')) {
      LocalStorage.set('cart', cart.value)
    }
  }

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
      return '--success--'
    } catch (error) {
      showErrorMessage(error.message)
      throw error
    }
  }
  const mergeCarts = async (userId) =>{
    console.log('mergeCarts -=-=-=-=-=-=-=-=')
    try {
      updateCart({ key: 0, value: 'logoutUser' })
      const result = await get(dbRef(db, `users/${userId}/cart`))
      const localObject = result.val()
      let localCart = LocalStorage.getItem('cart')
      const addProducts = Object.keys(localCart).map((key) => {
        if (localObject[key]) {
          localCart[key].quantity += localObject[key].quantity
        }
        return addProductToCart(localCart[key])
      })
      await Promise.all(addProducts)
      LocalStorage.removeItem('cart')
    } catch (e) {
      showErrorMessage(e.message)
      throw e
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
    changeShippingDetails,
    updateCart,
    addProductToCart,
    mergeCarts,
    payStripe
  }
})
