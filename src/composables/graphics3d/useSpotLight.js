import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { SpotLight, Vector3, Object3D, Box3 } from 'three'
import { useGraphics3DStore } from 'stores/graphics3D-store'
const graphics3DStore = useGraphics3DStore()
const { selectedGallery } = storeToRefs(graphics3DStore)

export const useSpotLight = (scene, element) => {
  let lightPos, modelCenter
  if (element.userData.isPainting) {
    const normal = element.userData.normal.clone()
    // Позиция света: 1 метр от картины по нормали и +0.5м по вертикали
    lightPos = element.position
      .clone()
      .add(normal.clone().multiplyScalar(2)) // отступ назад на 1 метр
      .add(new Vector3(0, 1, 0)) // +0.5м вверх
  } else {
    // Bounding box для определения размеров и центра модели
    const boundingBox = new Box3().setFromObject(element)
    const modelHeight = boundingBox.max.y - boundingBox.min.y
    modelCenter = new Vector3()
    boundingBox.getCenter(modelCenter)
    // Направление света: от центра галереи к модели
    const direction = modelCenter.clone().sub(new Vector3(0, 0, 0)).normalize()
    // Позиция света: немного отступить от модели в сторону центра и приподнять
    lightPos = modelCenter
      .clone()
      .add(direction.clone().multiplyScalar(-2)) // отступ от модели в сторону центра
      .add(new Vector3(0, modelHeight / 2 + 2, 0)) // приподнять на 1 метр
  }

  const spotLight = new SpotLight(0xffffff, 5)
  spotLight.position.copy(lightPos)
  // spotLight.target.position.copy(painting.position)
  // Угол рассеивания света (меньше — уже луч)
  spotLight.angle = Math.PI / 6 // ~15 градусов
  // Размытие границ света от 0.0 до 1.0:
  spotLight.penumbra = 0.5
  // Дальность действия
  spotLight.distance = 20

  if (element.userData.isPlaceableObject) {
    spotLight.castShadow = true
    spotLight.shadow.bias = -0.001 // часто помогает избежать артефактов
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.camera.near = 0.1
    spotLight.shadow.camera.far = 30
    spotLight.shadow.camera.fov = 40 // угол обзора "теневой" камеры
  }

  const target = new Object3D()
  target.position.copy(element.userData.isPainting ? element.position : modelCenter)
  target.updateMatrixWorld()
  spotLight.target = target

  scene.add(spotLight)
  scene.add(target) // Обязательно!
  element.userData.spotLight = spotLight
  element.userData.spotLightTarget = target

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
  // const spotLightHelper = new SpotLightHelper(spotLight, 0.5, 0xff0000)
  // scene.add(spotLightHelper)
}
