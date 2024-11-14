import { ref as dbRef, onChildAdded, onChildChanged, onChildRemoved } from 'firebase/database'
import { db } from 'boot/firebase.js'
import { useUserStore } from 'stores/user-store.js'

const userStore = useUserStore()
const { updateUserData, updateOrdersArtWorks } = userStore

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
  })
  onChildRemoved(dbRef(db, `users/${uid}/${parent}`), (data) => {
    if (parent === 'userData') {
      console.log('onChildRemoved-userData -', data.key, ':', data.val())
    }
  })
}
