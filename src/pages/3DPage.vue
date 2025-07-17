<template>
  <gallery3-d />
</template>

<script>
import { toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import Gallery3D from 'components/graphics3d/Gallery3D.vue'

export default {
  name: '3DPage',
  components: {
    Gallery3D
  },
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
