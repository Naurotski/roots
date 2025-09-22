import { AudioLoader, AudioListener, Audio } from 'three'
import { watch } from 'vue'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { storeToRefs } from 'pinia'
const graphics3DStore = useGraphics3DStore()
const { audioList, activeLoading } = storeToRefs(graphics3DStore)
const { updateVideoAudio } = graphics3DStore

export const useAudio = async (camera, dataAudio) => {
  let checkPlay = false
  const listener = new AudioListener()
  camera.add(listener)

  const sound = new Audio(listener)
  const audioLoader = new AudioLoader()

  const buffer = await audioLoader.loadAsync(dataAudio.url)
  sound.setBuffer(buffer)
  sound.setLoop(true)
  sound.setVolume(0.5)

  const stopAudioWatch = watch(
    audioList,
    (newValue) => {
      if (newValue?.[dataAudio.audioId]?.play && activeLoading.value === 0) {
        sound.play()
        checkPlay = true
      } else {
        sound.pause()
        checkPlay = false
      }
    },
    { deep: true, immediate: true }
  )

  const stopActiveWatch = watch(
    activeLoading,
    (nv, ov) => {
      if (ov > 0 && nv === 0) {
        setTimeout(() => {
          updateVideoAudio(dataAudio.audioId, 'play', true, 'audioStore')
        }, 1000)
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
    sound.stop?.()
    sound.disconnect?.()
    sound.parent?.remove(sound)
    camera.remove(listener)
    sound.buffer = null
    sound.source = null
    stopAudioWatch()
    stopActiveWatch()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
}
