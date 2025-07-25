<template>
  <q-page>
    <gallery3-d />
    <how-to class="absolute-top-right q-mt-xl q-mr-xl" />
    <div
      v-if="selectedGallery.videoStore && Object.keys(selectedGallery.videoStore).length"
      class="absolute-bottom-right q-mb-xl q-mr-xl"
    >
      <div v-for="{ videoId, play, muted } in Object.values(selectedGallery.videoStore)" :key="videoId">
        <q-btn
          v-if="!play"
          size="xl"
          flat
          round
          color="white"
          icon="fa-solid fa-play"
          @click="videoControl(videoId, 'play', true)"
        />
        <q-btn
          v-else
          size="xl"
          flat
          round
          color="white"
          icon="fa-solid fa-pause"
          @click="videoControl(videoId, 'play', false)"
        />
        <q-btn
          v-if="!muted"
          size="xl"
          flat
          round
          color="white"
          icon="fa-solid fa-volume-low"
          @click="videoControl(videoId, 'muted', true)"
        />
        <q-btn
          v-else
          size="xl"
          flat
          round
          color="white"
          icon="fa-solid fa-volume-xmark"
          @click="videoControl(videoId, 'muted', false)"
        />
      </div>
    </div>
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
    const { listenForChildEvents, clearSelectedGallery, updateSelectedGalleryVideo } =
      graphics3DStore
    if (selectedGallery.value.galleryId !== +galleryId.value) {
      clearSelectedGallery()
      listenForChildEvents(`galleries/${galleryId.value}`)
    }
    const videoControl = (key, value, check) => {
      updateSelectedGalleryVideo(key, value, check)
    }
    return {
      selectedGallery,
      videoControl
    }
  }
}
</script>

<style scoped></style>
