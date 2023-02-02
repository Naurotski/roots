import { defineStore } from 'pinia'
import { db } from 'boot/firebase.js'
import { ref as fbRef, onValue } from 'firebase/database'

import { ref } from 'vue'

export const useArtistsStore = defineStore('artists', () => {
  const artists = ref(null)
  const getArtists = () => {
    onValue(fbRef(db, 'artists/'), (snapshot) => {
      const data = snapshot.val()
      artists.value = Object.values(data)
    })
  }
  return {
    artists,
    getArtists
  }
})
