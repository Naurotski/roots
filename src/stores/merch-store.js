import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { Loading } from 'quasar'
import { ref as dbRef, onChildAdded, onChildChanged, onChildRemoved, get } from 'firebase/database'
import { db } from 'boot/firebase'
import { apiAxios } from 'boot/axios'
import { useAuthStore } from 'stores/auth-store'
import { useStripeStore } from 'stores/stripe-store'
import printFullToken from 'src/printFullToken'
import { showErrorMessage } from 'src/composables/show-error-message'

export const useMerchStore = defineStore('merch', () => {
  const colorMappingPrintFul = ref({
    'Charcoal-Black Triblend': '#333333', // Тёмно-серый, близкий к чёрному
    'Navy Triblend': '#001F54', // Тёмно-синий
    'Athletic Grey Triblend': '#D3D3D3', // Светло-серый
    'White Fleck Triblend': '#F5F5F5', // Белый с вкраплениями
    Glossy: '#000000',
    Black: '#000000'
  })
  const merchLinks = ref([
    { label: 'links.mugs', name: 'mugs' },
    { label: 'links.bags', name: 'bags' },
    { label: 'links.notebooks', name: 'notebooks' },
    { label: 'links.casesForIPhone', name: 'casesForIPhone' }
  ])
  const authStore = useAuthStore()
  const { loggedIn } = storeToRefs(authStore)
  const stripeStore = useStripeStore()
  const { cart } = storeToRefs(stripeStore)
  const { addProductToCart, updateCart } = stripeStore
  const merchList = ref({})
  const printFulCountries = ref([])
  const shippingRates = ref([])
  const updateMerchList = (product) => {
    if (product.delete === true) {
      delete merchList.value[product.rubric][product.id]
    } else {
      if (!merchList.value[product.rubric]) {
        merchList.value[product.rubric] = {}
      }
      if (product.variants) {
        let maxPrice = Math.max(...product.variants.map((item) => item.price))
        let minPrice = Math.min(...product.variants.map((item) => item.price))
        if (maxPrice === minPrice) {
          product.price = maxPrice
        } else {
          product.price = `${minPrice.toString()} - €${maxPrice.toString()}`
        }
      }
      merchList.value[product.rubric][product.id] = product
    }
  }
  const updateShippingRates = (payload) => (shippingRates.value = payload)
  const listenForChildMerch = (rubric) => {
    let path = `merch/${rubric}`
    onChildAdded(dbRef(db, path), async (data) => {
      // console.log('onChildAdded-merch -', data.key, ':', data.val())
      let productData = data.val()
      if (productData.printFulProductId) {
        const variants = await getProductsPrintFul(productData.printFulProductId)
        updateMerchList({ ...productData, variants })
      } else {
        updateMerchList(productData)
      }
    })
    onChildChanged(dbRef(db, path), async (data) => {
      // console.log('onChildChanged-merch -', data.key, ':', data.val())
      let productData = data.val()
      if (productData.printFulProductId) {
        const variants = await getProductsPrintFul(productData.printFulProductId)
        updateMerchList({ ...productData, variants })
      } else {
        updateMerchList(productData)
      }
    })
    onChildRemoved(dbRef(db, path), async (data) => {
      // console.log('onChildRemoved-merch -', data.key, ':', data.val())
      updateMerchList({ ...data.val(), delete: true })
      if (cart.value[data.key]) {
        if (loggedIn.value) {
          await addProductToCart({ ...data.val(), delete: true })
        } else {
          updateCart({ key: data.val().id, value: 'delete' })
        }
      }
    })
  }
  const checkExistenceMerch = async (path) => {
    const result = await get(dbRef(db, path))
    return result.val()
  }

  const getProductsPrintFul = async (productId) => {
    try {
      Loading.show()
      const response = await apiAxios.post('/printFul', {
        path: `/store/products/${productId}`,
        token: printFullToken
      })
      Loading.hide()
      return response.data.result.sync_variants.map((item) => {
        return {
          variantId: item.id,
          size: item.size,
          price: item.retail_price,
          color: item.color,
          variant_id: item.variant_id
        }
      })
    } catch (error) {
      Loading.hide()
      showErrorMessage(error.message)
      throw error
    }
  }
  const printFul = async (path, payload) => {
    console.log('printFul --', path, payload)
    try {
      if (!payload) {
        const response = await apiAxios.post('/printFul', {
          path,
          token: printFullToken
        })
        if (path === '/countries') {
          printFulCountries.value = response.data.result
        }
      } else {
        const response = await apiAxios.post('/printFul', {
          path,
          payload,
          token: printFullToken
        })
        console.log('printFul-response.data ----', response.data)
        if (path === '/shipping/rates') {
          if (response.data.errorData) {
            updateShippingRates([{ errorMessage: response.data.errorData.result }])
            throw new Error(response.data.errorData.result)
          } else {
            updateShippingRates(response.data.result)
          }
        }
        if (path === '/orders') {
          console.log(response.data)
          return response.data.result.id
        }
      }
    } catch (error) {
      if (error.message !== 'Sorry, shipping to this country has been disabled!') {
        showErrorMessage(error.message)
      }
      throw error
    }
  }
  return {
    colorMappingPrintFul,
    merchLinks,
    merchList,
    printFulCountries,
    shippingRates,
    updateShippingRates,
    listenForChildMerch,
    checkExistenceMerch,
    printFul
  }
})
