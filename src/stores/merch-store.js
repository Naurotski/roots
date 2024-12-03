import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { ref as dbRef, onChildAdded, onChildChanged, onChildRemoved, get } from 'firebase/database'
import { db } from 'boot/firebase'
import { useAuthStore } from 'stores/auth-store'
import { useStripeStore } from 'stores/stripe-store'

export const useMerchStore = defineStore('merch', () => {
  const merchLinks = ref([
    { label: 'links.mugs', name: 'mugs' },
    { label: 'links.bags', name: 'bags' },
    { label: 'links.catalogues', name: 'catalogues' },
    { label: 'links.baubles', name: 'baubles' }
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
  return {
    merchLinks,
    merchList,
    listenForChildMerch,
    checkExistenceMerch
  }
})
