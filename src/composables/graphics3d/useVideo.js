import {
  VideoTexture,
  LinearFilter,
  RGBFormat,
  MeshBasicMaterial,
  PlaneGeometry,
  Mesh,
  DoubleSide,
  Vector3,
  Quaternion,
  MathUtils, SRGBColorSpace
} from 'three'

export const useVideo = async (scene, dataVideo) => {
  console.log('useVideo-dataVideo--', dataVideo)
  const object = scene.getObjectByName(dataVideo.videoId)
  if (!object || !object.geometry) {
    console.warn(`Объект ${dataVideo.videoId} не найден или не имеет геометрии`)
    return
  }

  // 1. создаём и запускаем видео
  const video = document.createElement('video')
  video.src = dataVideo.url
  video.loop = true
  video.muted = false
  video.autoplay = false
  video.playsInline = true
  video.crossOrigin = 'anonymous'
  video.preload = 'auto'
  // Ждём пока загрузятся данные видео
  await new Promise((resolve) => {
    video.addEventListener('loadeddata', () => {
      video.play().catch((e) => console.warn('Видео play() error', e))
      resolve()
    })
  })

  const videoAspect = video.videoWidth / video.videoHeight || 16 / 9 // страховка на случай нулей

  // 2. создаём текстуру и материал
  const videoTexture = new VideoTexture(video)
  videoTexture.minFilter = LinearFilter
  videoTexture.magFilter = LinearFilter
  videoTexture.format = RGBFormat
  videoTexture.generateMipmaps = false
  videoTexture.colorSpace = SRGBColorSpace

  const material = new MeshBasicMaterial({ map: videoTexture, side: DoubleSide })

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

  // 8. добавить в сцену
  scene.add(screen)

  // 9. Добавляем метод обновления текстуры (в основном render loop)
  screen.userData.update = () => {
    videoTexture.needsUpdate = true
  }
}
export const stopAllSceneVideos = (scene) => {
  scene.children.forEach((child) => {
    if (child.userData.video) {
      child.userData.video.pause()
    }
  })
}

export const playAllSceneVideos = (scene) => {
  scene.children.forEach((child) => {
    if (child.userData.video) {
      child.userData.video.play().catch((e) => console.warn('Видео play() error', e))
    }
  })
}
