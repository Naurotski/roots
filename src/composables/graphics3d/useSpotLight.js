import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { SpotLight, Vector3, Object3D, Box3 } from 'three'
import { useGraphics3DStore } from 'stores/graphics3D-store'

const graphics3DStore = useGraphics3DStore()
const { selectedGallery } = storeToRefs(graphics3DStore)

export const useSpotLight = (scene, element) => {
  let lightPos, modelCenter
  if (element.userData.isFurnitureObject) return
  const spotLight = new SpotLight(0xffffff, 5)
  if (element.userData.isPainting) {
    // Для картин: свет "от стены вперёд и вверх"
    const normal = element.userData.normal.clone()
    lightPos = element.position
      .clone()
      .add(normal.multiplyScalar(2)) // 2 метра от стены
      .add(new Vector3(0, 1, 0)) // 1 метр вверх

    const target = new Object3D()
    target.position.copy(element.position)
    target.updateMatrixWorld()
    spotLight.target = target
    scene.add(target)
  } else {
    // Для объектов: свет спереди и сверху, направлен в центр модели
    const boundingBox = new Box3().setFromObject(element)
    modelCenter = new Vector3()
    boundingBox.getCenter(modelCenter)
    const modelHeight = boundingBox.max.y - boundingBox.min.y

    const normal = element.userData.normal.clone().normalize()

    lightPos = modelCenter
      .clone()
      .add(normal.clone().multiplyScalar(2)) // отступ вперёд
      .add(new Vector3(0, modelHeight / 2, 0)) // приподнять

    const target = new Object3D()
    target.position.copy(modelCenter)
    target.updateMatrixWorld()
    spotLight.target = target
    scene.add(target)
  }

  // Общие настройки света
  spotLight.position.copy(lightPos)
  spotLight.angle = Math.PI / 6
  spotLight.penumbra = 0.5
  spotLight.distance = 20

  if (element.userData.isPlaceableObject) {
    spotLight.castShadow = true
    spotLight.shadow.bias = -0.001
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.camera.near = 0.1
    spotLight.shadow.camera.far = 30
    spotLight.shadow.camera.fov = 40
  }

  scene.add(spotLight)
  element.userData.spotLight = spotLight
  element.userData.spotLightTarget = spotLight.target

  watch(
    selectedGallery,
    (val) => {
      if (val.galleryId) {
        spotLight.intensity = val.light.intensitySpot
        spotLight.angle = Math.PI / val.light.angleSpot
        spotLight.penumbra = val.light.penumbraSpot
      }
    },
    { immediate: true, deep: true }
  )

  // Для отладки:
  // import { SpotLightHelper } from 'three'
  // const helper = new SpotLightHelper(spotLight)
  // scene.add(helper)
}
