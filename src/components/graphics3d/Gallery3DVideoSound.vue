<template>
  <div
    v-if="selectedGallery.videoStore && Object.keys(selectedGallery.videoStore).length"
    class="absolute-bottom-right q-mb-xl q-mr-xl"
  >
    <div v-for="{ videoId } in Object.values(selectedGallery.videoStore)" :key="videoId">
      <q-btn
        v-if="!videoList[videoId]?.play"
        size="xl"
        flat
        round
        color="white"
        icon="fa-solid fa-video"
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
        v-if="!videoList[videoId]?.muted"
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
</template>

<script>
import { storeToRefs } from 'pinia'
import { useGraphics3DStore } from 'stores/graphics3D-store'

export default {
  name: 'Gallery3DVideoSound',
  setup() {
    const graphics3DStore = useGraphics3DStore()
    const { selectedGallery, videoList } = storeToRefs(graphics3DStore)
    const { updateVideoList } = graphics3DStore
    const videoControl = (key, value, check) => {
      updateVideoList(key, value, check)
    }
    return {
      selectedGallery,
      videoList,
      videoControl
    }
  }
}
</script>

<style scoped></style>
