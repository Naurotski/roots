import { AudioLoader, AudioListener, Audio } from 'three'
import { watch } from 'vue'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { storeToRefs } from 'pinia'
const graphics3DStore = useGraphics3DStore()
const { audioList, activeLoading } = storeToRefs(graphics3DStore)
const { updateVideoAudio } = graphics3DStore

export const useAudio = async (camera, dataAudio) => {
  let checkPlay
  let bufferReady = false
  const listener = new AudioListener()
  camera.add(listener)

  const sound = new Audio(listener)
  const audioLoader = new AudioLoader()

  audioLoader.load(dataAudio.url, (buffer) => {
    sound.setBuffer(buffer)
    sound.setLoop(true)
    sound.setVolume(0.5)
    bufferReady = true
  })

  const stopWatcher = watch(
    audioList,
    (newValue) => {
      if (newValue?.[dataAudio.audioId]?.play && activeLoading.value === 0 && bufferReady) {
        sound.play()
        checkPlay = true
      } else {
        sound.pause()
        checkPlay = false
      }
    },
    { deep: true, immediate: true }
  )
  watch(
    activeLoading,
    (newValue) => {
      if (newValue === 0 && bufferReady) {
        setTimeout(() => updateVideoAudio(dataAudio.audioId, 'play', true, 'audioStore'), 1000)
      }
    },
    { immediate: true }
  )
  const handleVisibilityChange = () => {
    if (document.hidden) {
      if (sound.isPlaying) {
        sound.pause()
      }
    } else {
      if (checkPlay) {
        sound.play()
      }
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  return () => {
    console.log('cleanupAudio----------------')
    sound.stop?.()
    sound.disconnect?.()
    sound.parent?.remove(sound)
    camera.remove(listener)
    sound.buffer = null
    sound.source = null
    stopWatcher()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
}
