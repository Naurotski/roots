import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { db } from 'boot/firebase.js'
import { ref as fbRef, onValue } from 'firebase/database'

export const useArtistsStore = defineStore('artists', () => {
  const artistsList = ref([])
  const setArtistList = (artists) => {
    artists.forEach((artist) => artist.works.forEach((work) => (work.artistName = artist.name)))
    artistsList.value = artists
    console.log(artistsList.value)
  }
  const filterArtistsDraft = computed(() => artistsList.value.filter((artist) => !artist.draft))
  const allWorks = computed(() => {
    let localArray = []
    artistsList.value.forEach((artist) => localArray.push(...artist.works))
    return localArray
  }) //заменить artistsList на filterArtistsDraft
  const getArtists = () => {
    onValue(fbRef(db, 'artists/'), (snapshot) => {
      const data = snapshot.val()
      setArtistList(Object.values(data))
    })
  }
  return {
    filterArtistsDraft,
    allWorks,
    getArtists
  }
})
