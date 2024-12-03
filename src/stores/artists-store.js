import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { db } from 'boot/firebase.js'
import { ref as fbRef, onValue, query, orderByChild, equalTo } from 'firebase/database'

export const useArtistsStore = defineStore('artists', () => {
  const artistsList = ref([])
  const setArtistList = (artists) => {
    artists.forEach((artist) => {
      let [firstName, lastName] = artist.name.split(' ')
      artist.firstName = firstName.split(/(?!^)(?=\p{Lu})/u).join(' ')
      artist.lastName = lastName.split(/(?!^)(?=\p{Lu})/u).join(' ')
      artist.works.forEach((work, index) => {
        work.firstName = artist.firstName
        work.lastName = artist.lastName
        work.artistName = artist.name
        work.artistId = artist.artistId
        work.index = index
      })
    })
    artistsList.value = artists
  }
  const allWorks = computed(() => {
    let localArray = []
    artistsList.value.forEach((artist) => localArray.push(...artist.works))
    return localArray.sort((a, b) => {
      if (a.id < b.id) return 1
      if (a.id === b.id) return 0
      if (a.id > b.id) return -1
    })
  })
  const getArtists = async () => {
    onValue(query(fbRef(db, 'artists'), orderByChild('draft'), equalTo(false)), (snapshot) => {
      const data = snapshot.val()
      setArtistList(Object.values(data))
    })
  }
  return {
    artistsList,
    allWorks,
    getArtists
  }
})
