import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { onValue, ref as dbRef } from 'firebase/database'
import { db } from 'boot/firebase.js'
import { date, Loading } from 'quasar'

export const useActionStore = defineStore('Action', () => {
  const exhibitionsList = ref([])
  const eventList = ref([])
  const filterExhibitionsDraft = computed(() => exhibitionsList.value.filter((item) => !item.draft))
  const filterEventsDraft = computed(() => eventList.value.filter((item) => !item.draft))
  const setActionsList = ({ actionsData, typeAction }) => {
    const localList = actionsData
      .sort((a, b) => {
        if (new Date(a.openingDate) < new Date(b.openingDate)) return 1
        if (new Date(a.openingDate) === new Date(b.openingDate)) return 0
        if (new Date(a.openingDate) > new Date(b.openingDate)) return -1
      })
      .map((item) => ({
        ...item,
        lifeTime:
          date.formatDate(item.openingDate, 'x') > Date.now()
            ? 'upcoming'
            : new Date(
                new Date(item.closingDate).setDate(new Date(item.closingDate).getDate() + 1)
              ) < Date.now()
            ? 'archive'
            : 'current',
        openingDate: date.formatDate(item.openingDate, 'DD/MM/YYYY'),
        closingDate: date.formatDate(item.closingDate, 'DD/MM/YYYY'),
        works: item.works.map((work) => {
          if (work.artistName) {
            let [firstName, lastName] = work.artistName.split(' ')
            work.firstName = firstName.split(/(?!^)(?=\p{Lu})/u).join(' ')
            work.lastName = lastName.split(/(?!^)(?=\p{Lu})/u).join(' ')
          }
          return { ...work }
        })
      }))
    if (typeAction === 'exhibitions') {
      exhibitionsList.value = localList
    } else {
      eventList.value = localList
    }
  }
  const getExhibitions = () => {
    Loading.show({
      backgroundColor: 'black'
    })
    onValue(dbRef(db, 'exhibitions/'), (snapshot) => {
      if (snapshot.val()) {
        Loading.hide()
        const data = snapshot.val()
        setActionsList({ actionsData: Object.values(data), typeAction: 'exhibitions' })
      }
    })
  }
  const getEvents = () => {
    Loading.show({
      backgroundColor: 'black'
    })
    onValue(dbRef(db, 'events/'), (snapshot) => {
      if (snapshot.val()) {
        Loading.hide()
        const data = snapshot.val()
        setActionsList({ actionsData: Object.values(data), typeAction: 'events' })
      }
    })
  }
  return {
    filterExhibitionsDraft,
    filterEventsDraft,
    getExhibitions,
    getEvents
  }
})
