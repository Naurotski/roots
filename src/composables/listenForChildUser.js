import { ref as dbRef, onChildAdded, onChildChanged, onChildRemoved } from 'firebase/database'
import { db } from 'boot/firebase.js'
import { useUserStore } from 'stores/user-store.js'
import { useStripeStore } from 'stores/stripe-store'

const userStore = useUserStore()
const { updateUserData, updateListOrders } = userStore
const stripeStore = useStripeStore()
const { updateCart } = stripeStore

const localFunction = (parent, data) => {
  if (parent === 'userData') {
    // console.log('onChildAdded-userData -', data.key, ':', data.val())
    updateUserData({ key: data.key, value: data.val() })
  }
  if (parent === 'orders') {
    // console.log('onChildAdded-artWorks -', data.key, ':', data.val())
    updateListOrders({ key: data.key, value: data.val() })
  }
  if (parent === 'cart') {
    // console.log('onChildAdded-cart -', data.key)
    updateCart({ key: data.key, value: data.val() })
  }
}
export const listenForChildUser = (uid, parent) => {
  let path = `users/${uid}/${parent}`
  onChildAdded(dbRef(db, path), (data) => {
    localFunction(parent, data)
  })
  onChildChanged(dbRef(db, path), (data) => {
    localFunction(parent, data)
  })
  onChildRemoved(dbRef(db, path), (data) => {
    if (parent === 'userData') {
      console.log('onChildRemoved-userData -', data.key, ':', data.val())
    }
    if (parent === 'cart') {
      // console.log('onChildRemoved-cart -', data.key, ':', data.val())
      updateCart({ key: data.key, value: 'delete' })
    }
  })
}
