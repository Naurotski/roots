import { toRaw } from 'vue'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { useSpotLight } from 'src/composables/graphics3d/useSpotLight'
const graphics3DStore = useGraphics3DStore()
const { updateModels3d } = graphics3DStore

export const modelPositioning = async ({
  scene,
  modelData,
  point,
  normal,
  objectId,
  collidableMeshes,
  rotation
}) => {
  const model = toRaw(modelData.model)
  model.position.copy(point)
  model.position.y += 0.01 // немного поднять над поверхностью
  if (rotation) model.rotation.y = rotation.y
  model.userData.isPlaceableObject = true
  model.userData.id = objectId
  model.userData.normal = normal.clone()
  model.userData.rotation = rotation
  scene.add(model)

  useSpotLight(scene, model)
  model.traverse((child) => {
    if (child.isMesh) {
      child.receiveShadow = true
      collidableMeshes.push(child)
    }
  })
  updateModels3d({
    id: objectId,
    modelData: {
      ...modelData
    }
  })
  return model
}
