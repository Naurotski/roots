import { ref as dbRef, onChildAdded, onChildChanged, onChildRemoved } from 'firebase/database'
import { db } from 'boot/firebase.js'
import { useUserStore } from 'stores/user-store.js'
import { useStripeStore } from 'stores/stripe-store'

const userStore = useUserStore()
const { updateUserData, updateOrdersArtWorks } = userStore
const stripeStore = useStripeStore()
const { updateCart } = stripeStore

export const listenForChildUser = (uid, parent) => {
  onChildAdded(dbRef(db, `users/${uid}/${parent}`), (data) => {
    if (parent === 'userData') {
      // console.log('onChildAdded-userData -', data.key, ':', data.val())
      updateUserData({ key: data.key, value: data.val() })
    }
    if (parent === 'orders/artWorks') {
      // console.log('onChildAdded-artWorks -', data.key, ':', data.val())
      updateOrdersArtWorks({ key: data.key, value: data.val() })
    }
    if (parent === 'cart') {
      console.log('onChildAdded-cart -', data.key, ':', data.val())
      updateCart({ key: data.key, value: data.val() })
    }
  })
  onChildChanged(dbRef(db, `users/${uid}/${parent}`), (data) => {
    if (parent === 'userData') {
      // console.log('onChildChanged-userData -', data.key, ':', data.val())
      updateUserData({ key: data.key, value: data.val() })
    }
    if (parent === 'orders/artWorks') {
      // console.log('onChildAdded-artWorks -', data.key, ':', data.val())
      updateOrdersArtWorks({ key: data.key, value: data.val() })
    }
    if (parent === 'cart') {
      console.log('onChildAdded-cart -', data.key, ':', data.val())
      updateCart({ key: data.key, value: data.val() })
    }
  })
  onChildRemoved(dbRef(db, `users/${uid}/${parent}`), (data) => {
    if (parent === 'userData') {
      console.log('onChildRemoved-userData -', data.key, ':', data.val())
    }
    if (parent === 'cart') {
      console.log('onChildRemoved-cart -', data.key, ':', data.val())
      updateCart({ key: data.key, value: 'delete' })
    }
  })
}
