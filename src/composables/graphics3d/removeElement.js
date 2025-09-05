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
  if (
    !element ||
    (!element.userData.isPainting &&
      !element.userData.isSticker &&
      !element.userData.isPlaceableObject &&
      !element.userData.isFurnitureObject)
  )
    return

  const { spotLight, spotLightTarget, id } = element.userData
  if (spotLight) scene.remove(spotLight)
  if (spotLightTarget) scene.remove(spotLightTarget)

  const removeFromCollidable = (mesh) => {
    const i = collidableMeshes.indexOf(mesh)
    if (i !== -1) collidableMeshes.splice(i, 1)
  }
  const disposeMesh = (mesh) => {
    if (mesh.geometry) mesh.geometry.dispose()
    if (Array.isArray(mesh.material)) mesh.material.forEach(disposeMaterial)
    else if (mesh.material) disposeMaterial(mesh.material)
  }

  if (element.userData.isPainting || element.userData.isSticker) {
    removeFromCollidable(element)
    disposeMesh(element)
  } else {
    element.traverse((child) => {
      if (child.isMesh) {
        removeFromCollidable(child)
        disposeMesh(child)
      }
    })
    updateModels3d({ id })
  }
  element.userData.spotLight = null
  element.userData.spotLightTarget = null
  element.userData.mixer?.stopAllAction()
  element.userData.mixer = null

  scene.remove(element)
}

export { removeElement }
