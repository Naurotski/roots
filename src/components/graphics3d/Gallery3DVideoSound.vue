<template>
  <div class="row" style="max-width: 300px; bottom: 3%; right: 5%; position: absolute">
    <div v-if="selectedGallery.audioStore && Object.keys(selectedGallery.audioStore).length">
      <div v-for="{ audioId } in Object.values(selectedGallery.audioStore)" :key="audioId">
        <q-btn
          v-if="!audioList[audioId]?.play"
          size="xl"
          flat
          round
          color="white"
          icon="mdi-music-off"
          @click="videoAudioControl(audioId, 'play', true, 'audioStore')"
        />
        <q-btn
          v-else
          size="xl"
          flat
          round
          color="white"
          icon="mdi-music"
          @click="videoAudioControl(audioId, 'play', false, 'audioStore')"
        />
      </div>
    </div>
    <div v-if="selectedGallery.videoStore && Object.keys(selectedGallery.videoStore).length">
      <div v-for="{ videoId } in Object.values(selectedGallery.videoStore)" :key="videoId">
        <q-btn
          v-if="!videoList[videoId]?.play"
          size="xl"
          flat
          round
          color="white"
          icon="fa-solid fa-video"
          @click="videoAudioControl(videoId, 'play', true, 'videoStore')"
        />
        <q-btn
          v-else
          size="xl"
          flat
          round
          color="white"
          icon="fa-solid fa-pause"
          @click="videoAudioControl(videoId, 'play', false, 'videoStore')"
        />
        <q-btn
          v-if="!videoList[videoId]?.muted"
          size="xl"
          flat
          round
          color="white"
          icon="fa-solid fa-volume-low"
          @click="videoAudioControl(videoId, 'muted', true, 'videoStore')"
        />
        <q-btn
          v-else
          size="xl"
          flat
          round
          color="white"
          icon="fa-solid fa-volume-xmark"
          @click="videoAudioControl(videoId, 'muted', false, 'videoStore')"
        />
      </div>
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
    const { selectedGallery, videoList, audioList } = storeToRefs(graphics3DStore)
    const { updateVideoAudio } = graphics3DStore
    const videoAudioControl = (id, key, value, typeStore) => {
      updateVideoAudio(id, key, value, typeStore)
    }
    return {
      selectedGallery,
      videoList,
      audioList,
      videoAudioControl
    }
  }
}
</script>

<style scoped></style>
