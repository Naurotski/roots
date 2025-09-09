import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { Loading } from 'quasar'
import { useRoute } from 'vue-router'
import {
  ref as dbRef,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  get,
  query,
  orderByChild,
  equalTo
} from 'firebase/database'
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
  // если меняем merchLinks надо поменять правила в Realtime Database
  const merchLinks = ref([
    { label: 'links.mugs', name: 'mugs' },
    { label: 'links.bags', name: 'bags' },
    { label: 'links.notebooks', name: 'notebooks' },
    { label: 'links.casesForIPhone', name: 'casesForIPhone' },
    { label: 'links.tShirts', name: 'tShirts' },
    { label: 'links.hats', name: 'hats' },
    { label: 'links.pins', name: 'pins' }
  ])
  const listStatusOrderPrintFul = {
    archived: 'ordersPrintFul.archived',
    canceled: 'ordersPrintFul.canceled',
    draft: 'ordersPrintFul.draft',
    failed: 'ordersPrintFul.failed',
    fulfilled: 'ordersPrintFul.fulfilled',
    inprocess: 'ordersPrintFul.inprocess',
    onhold: 'ordersPrintFul.onhold',
    partial: 'ordersPrintFul.partial',
    pending: 'ordersPrintFul.pending',
    package_returned: 'ordersPrintFul.packageReturned',
    package_shipped: 'ordersPrintFul.packageShipped'
  }
  const route = useRoute()
  const authStore = useAuthStore()
  const { loggedIn } = storeToRefs(authStore)
  const stripeStore = useStripeStore()
  const { cart } = storeToRefs(stripeStore)
  const { addProductToCart, updateCart } = stripeStore
  const merchList = ref({})
  const merchHomePageList = ref([])
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
  const updateMerchHomePageList = (item) => {
    if (item.variants) {
      let maxPrice = Math.max(...item.variants.map((item) => item.price))
      let minPrice = Math.min(...item.variants.map((item) => item.price))
      if (maxPrice === minPrice) {
        item.price = maxPrice
      } else {
        item.price = `${minPrice.toString()} - €${maxPrice.toString()}`
      }
    }
    merchHomePageList.value.push(item)
  }
  const updateShippingRates = (payload) => (shippingRates.value = payload)
  const listenForChildMerch = (rubric) => {
    let path = `merch/${rubric}`
    onChildAdded(
      query(dbRef(db, path), orderByChild('notForSale'), equalTo(false)),
      async (data) => {
        // console.log('onChildAdded-merch -', data.key, ':', data.val())
        let productData = data.val()
        if (productData.printFulProductId) {
          const variants = await getProductsPrintFul(productData.printFulProductId)
          updateMerchList({ ...productData, variants })
        } else {
          updateMerchList(productData)
        }
      }
    )
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
      if (route.name === 'Shop') Loading.show()
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
    try {
      if (!payload) {
        const response = await apiAxios.post('/printFul', {
          path,
          token: printFullToken
        })
        if (path === '/countries') {
          printFulCountries.value = response.data.result
        }
        return response.data.result
      } else {
        const response = await apiAxios.post('/printFul', {
          path,
          payload,
          token: printFullToken
        })
        if (path === '/shipping/rates') {
          if (response.data.errorData) {
            updateShippingRates([{ errorMessage: response.data.errorData.result }])
            throw new Error(response.data.errorData.result)
          } else {
            updateShippingRates(response.data.result)
          }
        }
        if (path === '/orders') {
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
    listStatusOrderPrintFul,
    merchList,
    merchHomePageList,
    printFulCountries,
    shippingRates,
    updateMerchHomePageList,
    updateShippingRates,
    listenForChildMerch,
    checkExistenceMerch,
    getProductsPrintFul,
    printFul
  }
})
