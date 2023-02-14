import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { onValue, ref as dbRef } from 'firebase/database'
import { db } from 'boot/firebase.js'
import { date } from 'quasar'

export const useExhibitionsStore = defineStore('exhibitions', () => {
  const exhibitionsList = ref([])
  const filterExhibitionsDraft = computed(() => exhibitionsList.value.filter((item) => !item.draft))
  const setExhibitionsList = (exhibitionsData) => {
    exhibitionsList.value = exhibitionsData.map((item) => ({
      ...item,
      openingDate: date.formatDate(item.openingDate, 'DD/MM/YYYY'),
      closingDate: date.formatDate(item.closingDate, 'DD/MM/YYYY')
    }))
  }
  const getExhibitions = () => {
    console.log('getExhibitions')
    onValue(dbRef(db, 'exhibitions/'), (snapshot) => {
      if (snapshot.val()) {
        const data = snapshot.val()
        setExhibitionsList(Object.values(data))
        console.log(exhibitionsList.value)
      }
    })
  }
  return {
    filterExhibitionsDraft,
    getExhibitions
  }
})
