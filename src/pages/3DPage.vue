<template>
  <h1>{{ galleryId }}</h1>
  <pre>selectedGallery - {{ selectedGallery }}</pre>
</template>

<script>
import { toRefs } from 'vue'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { storeToRefs } from 'pinia'

export default {
  name: '3DPage',
  props: {
    galleryId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { galleryId } = toRefs(props)
    const graphics3DStore = useGraphics3DStore()
    const { selectedGallery } = storeToRefs(graphics3DStore)
    const { listenForChildEvents, clearSelectedGallery } = graphics3DStore
    console.log('selectedGallery.value.galleryId ----', selectedGallery.value.galleryId)
    console.log('galleryId.value ----', galleryId.value)
    if (selectedGallery.value.galleryId !== +galleryId.value) {
      clearSelectedGallery()
      listenForChildEvents(`galleries/${galleryId.value}`)
    }
    return {
      selectedGallery
    }
  }
}
</script>

<style scoped></style>
