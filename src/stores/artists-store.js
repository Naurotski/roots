import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { db } from 'boot/firebase.js'
import { ref as fbRef, onValue } from 'firebase/database'

export const useArtistsStore = defineStore('artists', () => {
  const artistsList = ref([])
  const filterArtistsDraft = computed(() => artistsList.value.filter((artist) => !artist.draft))
  const getArtists = () => {
    onValue(fbRef(db, 'artists/'), (snapshot) => {
      const data = snapshot.val()
      artistsList.value = Object.values(data)
    })
  }
  return {
    getArtists,
    filterArtistsDraft
  }
})
