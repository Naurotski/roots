import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { db } from 'boot/firebase.js'
import { ref as fbRef, onValue } from 'firebase/database'

export const useArtistsStore = defineStore('artists', () => {
  const artistsList = ref([])
  const setArtistList = (artists) => {
    artists.forEach((artist) =>
      artist.works.forEach((work, index) => {
        work.artistName = artist.name
        work.artistId = artist.artistId
        work.index = index
      })
    )
    artistsList.value = artists
  }
  const filterArtistsDraft = computed(() => artistsList.value.filter((artist) => !artist.draft))
  const allWorks = computed(() => {
    let localArray = []
    filterArtistsDraft.value.forEach((artist) => localArray.push(...artist.works))
    return localArray.sort((a, b) => {
      if (a.id < b.id) return 1
      if (a.id === b.id) return 0
      if (a.id > b.id) return -1
    })
  })
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
