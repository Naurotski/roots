import { AudioLoader, AudioListener, Audio } from 'three'
import { watch } from 'vue'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { storeToRefs } from 'pinia'
const graphics3DStore = useGraphics3DStore()
const { audioList } = storeToRefs(graphics3DStore)
const { updateVideoAudio } = graphics3DStore

export const useAudio = async (camera, dataAudio) => {
  console.log('useAudio ----dataAudio-', dataAudio)
  const listener = new AudioListener()
  camera.add(listener)

  const sound = new Audio(listener)
  const audioLoader = new AudioLoader()

  audioLoader.load(dataAudio.url, (buffer) => {
    sound.setBuffer(buffer)
    sound.setLoop(true)
    sound.setVolume(0.5)
    sound.play()
    updateVideoAudio(dataAudio.audioId, 'play', true, 'audioStore')
  })
  const stopWatcher = watch(
    audioList,
    (newValue) => {
      console.log('watch---', newValue)
      if (newValue?.[dataAudio.audioId]) {
        if (newValue?.[dataAudio.audioId]?.play) {
          sound.play()
        } else {
          console.log('watch -----sound-', sound)
          sound.pause()
        }
      }
    },
    { deep: true }
  )
  return () => {
    console.log('cleanupAudio----------------')
    sound.stop?.()
    sound.disconnect?.()
    sound.parent?.remove(sound)
    camera.remove(listener)
    sound.buffer = null
    sound.source = null
    stopWatcher()
  }
}
