import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  DirectionalLight,
  SRGBColorSpace,
  ACESFilmicToneMapping,
  PCFSoftShadowMap,
  AxesHelper,
  GridHelper,
  HemisphereLight
} from 'three'
import { useGraphics3DStore } from 'stores/graphics3D-store'
const graphics3DStore = useGraphics3DStore()
const { selectedGallery } = storeToRefs(graphics3DStore)

export const useSceneSetup = (container) => {
  // Сцена
  const scene = new Scene()

  // Камера
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  const camera = new PerspectiveCamera(60, width / height, 0.1, 100)
  camera.position.set(0, 0, 0)

  // Рендерер
  const renderer = new WebGLRenderer({
    antialias: false,
    powerPreference: 'high-performance',
    alpha: false,
    premultipliedAlpha: false
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap // мягкие тени
  container.value.appendChild(renderer.domElement)

  // Свет
  const hemiLight = new HemisphereLight(0xddddff, 0x222233, 0.7)
  scene.add(hemiLight)
  const directions = [
    [1, 1, 1],
    [-1, 1, 1],
    [1, 1, -1],
    [-1, 1, -1],
    [-0, -1, -0]
  ]
  const directionalLights = []
  directions.forEach(([x, y, z]) => {
    const light = new DirectionalLight(0xffffff, 0.3)
    light.position.set(x * 10, y * 10, z * 10)
    scene.add(light)
    directionalLights.push(light)
  })

  // Адаптация к изменению размера окна
  const onResize = () => {
    if (!container.value || !renderer || !camera) return
    const w = container.value.clientWidth
    const h = container.value.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  let observer = new ResizeObserver(onResize)
  observer.observe(container.value)

  const sceneSetupUnmounted = () => {
    console.log('sceneSetupUnmounted ---------------------')
    if (observer && container.value) {
      observer.unobserve(container.value)
      observer.disconnect()
      observer = null
    }
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry?.dispose()
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
        materials.forEach((m) => {
          if (m.map) m.map.dispose()
          m.dispose()
        })
      }
      if (obj.userData?.update) {
        obj.userData.update = null
      }
    })
    while (scene.children.length > 0) {
      scene.remove(scene.children[0])
    }
    if (renderer) {
      renderer.setAnimationLoop(null)
      renderer.dispose()
      if (container.value?.contains(renderer.domElement)) {
        container.value.removeChild(renderer.domElement)
      }
    }
  }
  // Добавим сетку и оси
  scene.add(new GridHelper(10, 10))
  scene.add(new AxesHelper(5))

  watch(
    selectedGallery,
    (val) => {
      if (val.galleryId) {
        hemiLight.intensity = val.light.intensityAmbient
        directionalLights.forEach((light) => {
          light.intensity = val.light.intensityDirectional
        })
        renderer.toneMappingExposure = val.light.toneMapping || 1
      }
    },
    { immediate: true, deep: true }
  )
  return {
    scene,
    camera,
    renderer,
    sceneSetupUnmounted
  }
}
