import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ref as dbRef, onChildAdded, onChildChanged, onChildRemoved, off } from 'firebase/database'
import { db } from 'boot/firebase.js'

export const useGraphics3DStore = defineStore('graphics3D', () => {
  const listGalleries = ref({})
  const selectedGallery = ref({})
  const models3d = ref({})
  const isAutoMoving = ref(false)
  const selectedElementId = ref(null)
  const videoList = ref({})
  const audioList = ref({})

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
        updateListGalleries({ galleryId: data.key, galleryName: data.val() })
      } else {
        updateSelectedGallery(data.key, data.val())
      }
    })
    onChildChanged(dbRef(db, path), async (data) => {
      console.log('onChildChanged-- ', data.key, data.val())
      if (parent === 'listGalleries') {
        updateListGalleries({ galleryId: data.key, galleryName: data.val() })
      } else {
        updateSelectedGallery(data.key, data.val())
      }
    })
    onChildRemoved(dbRef(db, path), async (data) => {
      console.log('onChildRemoved-- ', data.key, data.val())
      if (parent === 'listGalleries') {
        updateListGalleries({ galleryId: data.key, galleryName: data.val() }, 'delete')
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
    selectedGallery,
    models3d,
    isAutoMoving,
    selectedElementId,
    videoList,
    audioList,
    updateVideoAudio,
    updateModels3d,
    updateCheckAutoMoving,
    updateSelectedElementId,
    listenForChildEvents,
    clearListGalleries,
    clearSelectedGallery
  }
})
