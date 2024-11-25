import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ref as dbRef, onChildAdded, onChildChanged, onChildRemoved } from 'firebase/database'
import { db } from 'boot/firebase'

export const useMerchStore = defineStore('merch', () => {
  const merchLinks = ref([
    { label: 'links.mugs', name: 'mugs' },
    { label: 'links.bags', name: 'bags' },
    { label: 'links.catalogues', name: 'catalogues' },
    { label: 'links.baubles', name: 'baubles' }
  ])
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
    onChildRemoved(dbRef(db, path), (data) => {
      // console.log('onChildRemoved-merch -', data.key, ':', data.val())
      updateMerchList({ ...data.val(), delete: true })
    })
  }
  return {
    merchLinks,
    merchList,
    listenForChildMerch
  }
})
