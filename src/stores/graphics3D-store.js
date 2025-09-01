import { defineStore, storeToRefs } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import { Loading, date } from 'quasar'
import { ref as dbRef, onChildAdded, onChildChanged, onChildRemoved, off } from 'firebase/database'
import { db } from 'boot/firebase.js'
import { useUserStore } from 'stores/user-store'

export const useGraphics3DStore = defineStore('graphics3D', () => {
  const userStore = useUserStore()
  const { listSubscriptions, listPayments } = storeToRefs(userStore)
  const listGalleries = ref({})
  const selectedGallery = ref({})
  const models3d = ref({})
  const isAutoMoving = ref(false)
  const selectedElementId = ref(null)
  const videoList = ref({})
  const audioList = ref({})
  const activeLoading = ref(0)

  const filteredListGalleriesNonDraft = computed(() =>
    Object.fromEntries(
      Object.entries(listGalleries.value).filter(
        ([, value]) =>
          !value.draft && value.openingDate <= date.formatDate(new Date(), 'YYYY/MM/DD')
      )
    )
  )
  const filteredListGalleriesMonthlySubscription = computed(() =>
    Object.values(filteredListGalleriesNonDraft.value)
      .sort((a, b) => b.closingDate.localeCompare(a.closingDate))
      .slice(0, 3)
  )

  watchEffect(() => {
    let newSubscription = listSubscriptions.value?.['Virtual Gallery'] || {}
    let newPayment = listPayments.value?.virtualGalleries || {}
    if (newSubscription?.interval === 'year' && newSubscription.status === 'active') {
      Object.keys(listGalleries.value).forEach(
        (key) => (listGalleries.value[key]['payment'] = 'year')
      )
    } else {
      Object.keys(listGalleries.value).forEach((key) => {
        if (
          Object.keys(newPayment).find(
            (keyPay) => keyPay === key && newPayment[keyPay] >= Date.now()
          )
        ) {
          listGalleries.value[key].payment = 'pay'
        } else {
          listGalleries.value[key].payment = ''
        }
      })
      if (newSubscription?.interval === 'month' && newSubscription.status === 'active') {
        Object.keys(listGalleries.value).forEach((key) => {
          console.log(key)
          if (
            filteredListGalleriesMonthlySubscription.value.find((item) => item.galleryId === key)
          ) {
            listGalleries.value[key].payment = 'month'
          }
        })
      }
    }
  })
  const startLoading = (message = 'Загружаем экспозицию…') => {
    if (activeLoading.value === 0) {
      Loading.show({ group: 'gallery', message })
    }
    activeLoading.value++
  }
  const endLoading = () => {
    activeLoading.value = Math.max(0, activeLoading.value - 1)
    if (activeLoading.value === 0) {
      Loading.hide('gallery')
    }
  }
  const updateListGalleries = (data, check) => {
    if (check === 'delete') {
      delete listGalleries.value[data.galleryId]
    } else {
      listGalleries.value[data.galleryId] = data
    }
  }
  const updateSelectedGallery = (key, value, check) => {
    if (check === 'delete') {
      delete selectedGallery.value[key]
    } else {
      selectedGallery.value[key] = value
    }
  }
  const updateVideoAudio = (id, key, value, typeStore) => {
    const targetList = typeStore === 'videoStore' ? videoList : audioList
    const otherList = typeStore === 'videoStore' ? audioList : videoList
    if (!targetList.value[id]) targetList.value[id] = {}
    targetList.value[id][key] = value
    if (key === 'play' && value === true) {
      for (const otherId in otherList.value) {
        if (otherList.value[otherId]?.play) {
          otherList.value[otherId].play = false
        }
      }
    }
  }
  const updateModels3d = ({ id, modelData }) => {
    if (!modelData) {
      delete models3d.value[id]
    } else {
      models3d.value[id] = modelData
    }
  }
  const clearListGalleries = () => (listGalleries.value = {})
  const clearSelectedGallery = async () => {
    await deleteListen(`galleries/${selectedGallery.value.galleryId}`)
    selectedGallery.value = {}
    models3d.value = {}
    videoList.value = {}
    audioList.value = {}
  }
  const updateCheckAutoMoving = (val) => (isAutoMoving.value = val)
  const updateSelectedElementId = (val) => (selectedElementId.value = val)
  const listenForChildEvents = (parent) => {
    console.log('listenForChildEvents - ', parent)
    let path = `graphics3D/${parent}`
    onChildAdded(dbRef(db, path), async (data) => {
      console.log('onChildAdded-- ', data.key, data.val())
      if (parent === 'listGalleries') {
        updateListGalleries({ galleryId: data.key, ...data.val() })
      } else {
        updateSelectedGallery(data.key, data.val())
      }
    })
    onChildChanged(dbRef(db, path), async (data) => {
      console.log('onChildChanged-- ', data.key, data.val())
      if (parent === 'listGalleries') {
        updateListGalleries({ galleryId: data.key, ...data.val() })
      } else {
        updateSelectedGallery(data.key, data.val())
      }
    })
    onChildRemoved(dbRef(db, path), async (data) => {
      console.log('onChildRemoved-- ', data.key, data.val())
      if (parent === 'listGalleries') {
        updateListGalleries({ galleryId: data.key, ...data.val() }, 'delete')
      } else {
        updateSelectedGallery(data.key, data.val(), 'delete')
      }
    })
  }
  const deleteListen = async (parent) => {
    await off(dbRef(db, `graphics3D/${parent}`))
  }
  return {
    listGalleries,
    filteredListGalleriesNonDraft,
    selectedGallery,
    models3d,
    isAutoMoving,
    selectedElementId,
    videoList,
    audioList,
    activeLoading,
    startLoading,
    endLoading,
    updateVideoAudio,
    updateModels3d,
    updateCheckAutoMoving,
    updateSelectedElementId,
    listenForChildEvents,
    clearListGalleries,
    clearSelectedGallery
  }
})
