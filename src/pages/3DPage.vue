<template>
  <q-page>
    <gallery3-d />
    <how-to class="absolute-top-right q-mt-xl q-mr-xl" />
  </q-page>
</template>

<script>
import { toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import Gallery3D from 'components/graphics3d/Gallery3D.vue'
import HowTo from 'components/graphics3d/HowTo.vue'

export default {
  name: '3DPage',
  components: {
    HowTo,
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
