<template>
  <q-page>
    <gallery3-d />
    <how-to class="absolute-top-right q-mt-xl q-mr-xl" />
    <gallery-labels />
    <gallery3-d-video-sound />
    <select-gallery />
  </q-page>
</template>

<script>
import { toRefs, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth-store'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import Gallery3D from 'components/graphics3d/Gallery3D.vue'
import HowTo from 'components/graphics3d/HowTo.vue'
import GalleryLabels from 'components/graphics3d/GalleryLabels.vue'
import Gallery3DVideoSound from 'components/graphics3d/Gallery3DVideoSound.vue'
import SelectGallery from 'components/graphics3d/SelectGallery.vue'

export default {
  name: '3DPage',
  components: {
    HowTo,
    Gallery3D,
    GalleryLabels,
    Gallery3DVideoSound,
    SelectGallery
  },
  props: {
    galleryId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { galleryId } = toRefs(props)
    const router = useRouter()
    const authStore = useAuthStore()
    const { loggedIn } = storeToRefs(authStore)
    const graphics3DStore = useGraphics3DStore()
    const { selectedGallery } = storeToRefs(graphics3DStore)
    const { listenForChildEvents, clearSelectedGallery } = graphics3DStore
    if (selectedGallery.value.galleryId !== +galleryId.value) {
      clearSelectedGallery()
      listenForChildEvents(`galleries/${galleryId.value}`)
    }
    watch(loggedIn, (val) => {
      if (!val) router.replace('/')
    })
    return {
      selectedGallery
    }
  }
}
</script>

<style scoped></style>
