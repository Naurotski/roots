import { defineStore } from 'pinia'
import { db } from 'boot/firebase.js'
import { ref as fbRef, onValue } from 'firebase/database'

import { computed, ref } from 'vue'

export const useArtistsStore = defineStore('artists', () => {
  const artists = ref([])
  const filterArtistsDraft = computed(() => artists.value.filter((artist) => !artist.draft))
  const getArtists = () => {
    onValue(fbRef(db, 'artists/'), (snapshot) => {
      const data = snapshot.val()
      artists.value = Object.values(data)
    })
  }
  return {
    getArtists,
    filterArtistsDraft
  }
})
