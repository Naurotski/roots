import { Box3 } from 'three'
import { pickKTX2Variant } from 'src/composables/graphics3d/ktx2/pickKTX2'
import { getGLTFLoader } from 'src/composables/graphics3d/loaders/gltfLoader'

export const loadModelGallery = async ({
  glbVariants,
  scene,
  collidableMeshes,
  renderer,
  perfTier
}) => {
  try {
    const url = pickKTX2Variant(glbVariants, renderer, perfTier)
    if (!url) throw new Error('No suitable gallery GLB variant')

    const loader = getGLTFLoader(renderer)
    const gltf = await loader.loadAsync(url)
    const model = gltf.scene

    model.updateMatrixWorld(true)
    // Выравнивание модели по земле
    const box = new Box3().setFromObject(model)
    model.position.set(0, -box.min.y, 0)
    model.scale.set(1, 1, 1)

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        collidableMeshes.push(child)
      }
    })
    scene.add(model)
    return true
  } catch (err) {
    console.error('loadModelGallery error:', err)
    return null
  }
}
