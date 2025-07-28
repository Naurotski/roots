import { useGraphics3DStore } from 'stores/graphics3D-store'
const graphics3DStore = useGraphics3DStore()
const { updateModels3d } = graphics3DStore
const textureKeys = [
  'map',
  'aoMap',
  'alphaMap',
  'bumpMap',
  'displacementMap',
  'emissiveMap',
  'envMap',
  'lightMap',
  'metalnessMap',
  'normalMap',
  'roughnessMap',
  'specularMap',
  'clearcoatMap',
  'clearcoatNormalMap',
  'clearcoatRoughnessMap',
  'sheenColorMap',
  'sheenRoughnessMap',
  'transmissionMap',
  'thicknessMap'
]

const disposeMaterial = (material) => {
  textureKeys.forEach((key) => {
    if (material[key]?.dispose) material[key].dispose()
  })
  material.dispose()
}

const removeElement = async (scene, collidableMeshes, element) => {
  console.log('removeElement ----')
  //ОБЯЗАТЕЛЬНО ДОБАВИТЬ ПРЕДМЕТЫ ИНТЕРЬЕРА
  if (!element || (!element.userData.isPainting && !element.userData.isPlaceableObject)) return
  // Удаляем SpotLight и его цель
  const { spotLight, spotLightTarget, id } = element.userData
  if (spotLight) scene.remove(spotLight)
  if (spotLightTarget) scene.remove(spotLightTarget)

  if (element.userData.isPainting) {
    // Удаляем из collidableMeshes
    const index = collidableMeshes.indexOf(element)
    if (index !== -1) {
      collidableMeshes.splice(index, 1)
    }
    // Освобождаем ресурсы
    if (element.geometry) {
      element.geometry.dispose()
    }
    if (Array.isArray(element.material)) {
      element.material.forEach((mat) => {
        disposeMaterial(mat)
      })
    } else if (element.material) {
      disposeMaterial(element.material)
    }
  } else {
    element.traverse((child) => {
      if (child.isMesh) {
        const index = collidableMeshes.indexOf(child)
        if (index !== -1) {
          collidableMeshes.splice(index, 1)
        }

        if (child.geometry) child.geometry.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach(disposeMaterial)
        } else if (child.material) {
          disposeMaterial(child.material)
        }
      }
    })
    updateModels3d({ id })
  }
  // Обнуляем ссылки
  element.userData.spotLight = null
  element.userData.spotLightTarget = null
  element.userData.mixer?.stopAllAction()
  element.userData.mixer = null
  // Удаляем из сцены
  scene.remove(element)
}

export { removeElement }
