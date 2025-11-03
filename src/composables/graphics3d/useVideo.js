import {
  VideoTexture,
  LinearFilter,
  RGBAFormat,
  MeshBasicMaterial,
  PlaneGeometry,
  Mesh,
  FrontSide,
  Vector3,
  Quaternion,
  MathUtils,
  SRGBColorSpace
} from 'three'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Notify } from 'quasar'
import { markStart, markEnd } from 'src/composables/graphics3d/loadingManager'
import { pickKTX2Variant } from 'src/composables/graphics3d/ktx2/pickKTX2'
import { useGraphics3DStore } from 'stores/graphics3D-store'
const graphics3DStore = useGraphics3DStore()
const { videoList } = storeToRefs(graphics3DStore)

export const useVideo = async (scene, renderer, perfTier, dataVideo) => {
  const localUrl = pickKTX2Variant(dataVideo.videoVariants, renderer, perfTier) || dataVideo.url
  console.log('localUrl ---', localUrl)
  const object = scene.getObjectByName(dataVideo.videoId)
  if (!object || !object.geometry) return
  const token = `video:${dataVideo.videoId}`
  markStart(token)
  const video = document.createElement('video')
  try {
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.playsInline = true
    video.preload = 'auto'
    video.muted = true
    video.src = localUrl
    await new Promise((resolve, reject) => {
      const ok = () => {
        cleanup()
        resolve(true)
      }
      const fail = () => {
        cleanup()
        reject(video.error || new Error('video error'))
      }
      const cleanup = () => {
        video.removeEventListener('loadeddata', ok)
        video.removeEventListener('error', fail)
      }
      video.addEventListener('loadeddata', ok, { once: true })
      video.addEventListener('error', fail, { once: true })
    })

    const videoAspect = video.videoWidth / video.videoHeight || 16 / 9 // страховка на случай нулей

    // 2. создаём текстуру и материал
    const videoTexture = new VideoTexture(video)
    videoTexture.minFilter = LinearFilter
    videoTexture.magFilter = LinearFilter
    videoTexture.format = RGBAFormat
    videoTexture.generateMipmaps = false
    videoTexture.colorSpace = SRGBColorSpace
    videoTexture.premultiplyAlpha = false
    const material = new MeshBasicMaterial({
      map: videoTexture,
      side: FrontSide,
      toneMapped: false,
      transparent: false
    })
    // 3. рассчитываем bounding box
    object.geometry.computeBoundingBox()
    const boundingBox = object.geometry.boundingBox
    const size = new Vector3()
    boundingBox.getSize(size)
    const center = new Vector3()
    boundingBox.getCenter(center)
    // 4. определим, на какую ось "смотрит" объект
    // можно взять нормаль первой грани (упрощённо)
    const normal = new Vector3(0, 0, 1) // по умолчанию Z
    if (object.geometry.index && object.geometry.attributes.position) {
      const pos = object.geometry.attributes.position
      const idx = object.geometry.index.array
      const a = new Vector3().fromBufferAttribute(pos, idx[0])
      const b = new Vector3().fromBufferAttribute(pos, idx[1])
      const c = new Vector3().fromBufferAttribute(pos, idx[2])
      normal.copy(c.clone().sub(b).cross(a.clone().sub(b)).normalize())
    }
    // 5. вписываем видео по пропорциям внутрь bounding box
    const planeMaxWidth = normal.x !== 0 ? size.z : size.x
    const planeMaxHeight = normal.y !== 0 ? size.z : size.y

    let width = planeMaxWidth
    let height = width / videoAspect

    if (height > planeMaxHeight) {
      height = planeMaxHeight
      width = height * videoAspect
    }
    const geometry = new PlaneGeometry(width, height)
    const screen = new Mesh(geometry, material)
    // 6. позиция по центру (в мировых координатах)
    const worldCenter = center.clone().applyMatrix4(object.matrixWorld)
    screen.position.copy(worldCenter).add(normal.clone().multiplyScalar(0.01))
    // 7. ориентация по нормали
    const defaultNormal = new Vector3(0, 0, 1)
    const quaternion = new Quaternion().setFromUnitVectors(defaultNormal, normal)
    screen.quaternion.copy(quaternion)
    screen.rotateY(MathUtils.degToRad(-3))
    screen.name = `video-mesh-${dataVideo.videoId}`
    screen.userData.video = video
    screen.userData.videoTexture = videoTexture
    // Добавляем метод обновления текстуры (в основном render loop)
    let lastUpdate = 0
    screen.userData.update = (now) => {
      if (now - lastUpdate > 33) {
        videoTexture.needsUpdate = true
        lastUpdate = now
      }
    }
    scene.add(screen)
  } catch (err) {
    Notify.create({
      type: 'negative',
      message: err.message || 'An error occurred',
      timeout: 5000,
      position: 'bottom',
      icon: 'error'
    })
    console.error('Error loading model:', err)
  } finally {
    markEnd(token)
  }
  let checkPlay
  const stopWatch = watch(
    videoList,
    (newValue) => {
      if (newValue[dataVideo.videoId] && object && object.geometry) {
        if (newValue[dataVideo.videoId]?.play) {
          video.play()
          checkPlay = true
        } else {
          video.pause()
          checkPlay = false
        }
        video.muted = newValue[dataVideo.videoId].muted
      }
    },
    { deep: true }
  )
  const handleVisibilityChange = () => {
    if (document.hidden) {
      if (!video.paused && !video.ended && video.readyState >= 3) {
        video.pause()
      }
    } else {
      if (checkPlay) {
        video.play()
      }
    }
  }
  document.addEventListener('visibilitychange', handleVisibilityChange)
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    stopWatch?.()
  }
}
