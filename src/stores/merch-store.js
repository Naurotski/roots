import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { ref as dbRef, onChildAdded, onChildChanged, onChildRemoved, get } from 'firebase/database'
import { db } from 'boot/firebase'
import { apiAxios } from 'boot/axios'
import { useAuthStore } from 'stores/auth-store'
import { useStripeStore } from 'stores/stripe-store'
import { Loading } from 'quasar'
import { showErrorMessage } from 'src/composables/show-error-message'

export const useMerchStore = defineStore('merch', () => {
  const merchLinks = ref([
    { label: 'links.mugs', name: 'mugs' },
    { label: 'links.bags', name: 'bags' },
    { label: 'links.catalogues', name: 'taccuini' },
    { label: 'links.casesForIPhone', name: 'Custodie per iphone' }
  ])
  const authStore = useAuthStore()
  const { loggedIn } = storeToRefs(authStore)
  const stripeStore = useStripeStore()
  const { cart } = storeToRefs(stripeStore)
  const { addProductToCart, updateCart } = stripeStore
  const merchList = ref({})
  const updateMerchList = (product) => {
    if (product.delete === true) {
      delete merchList.value[product.rubric][product.id]
    } else {
      if (!merchList.value[product.rubric]) {
        merchList.value[product.rubric] = {}
      }
      merchList.value[product.rubric][product.id] = product
    }
  }
  const listenForChildMerch = (rubric) => {
    let path = `merch/${rubric}`
    onChildAdded(dbRef(db, path), (data) => {
      // console.log('onChildAdded-merch -', data.key, ':', data.val())
      updateMerchList(data.val())
    })
    onChildChanged(dbRef(db, path), (data) => {
      // console.log('onChildChanged-merch -', data.key, ':', data.val())
      updateMerchList(data.val())
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

  const printFul = async () => {
    console.log('printFul----')
    try {
      Loading.show()
      const response = await apiAxios.post('/printFul', {
        path: '/store/products/370010662',
        // token: 'XR0WXqjegp0MlCfqrf6sNW1Qff3CIbz28P6cOcHW'
        token: 'Dt1B3dgZGl3KuWTIUiU5h3U6PzFkaSxmiFqrfa5s'
      })
      console.log('response======', response.data)
      Loading.hide()
    } catch (error) {
      Loading.hide()
      showErrorMessage(error.message)
      throw error
    }
  }

  return {
    merchLinks,
    merchList,
    listenForChildMerch,
    checkExistenceMerch,
    printFul
  }
})
