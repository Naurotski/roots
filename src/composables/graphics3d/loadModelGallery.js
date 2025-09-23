import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Box3 } from 'three'
import { manager } from 'src/composables/graphics3d/loadingManager'

export const loadModelGallery = async (url, scene, collidableMeshes) => {
  try {
    const loader = new GLTFLoader(manager)
    loader.setCrossOrigin('anonymous')
    const gltf = await loader.loadAsync(url)
    const model = gltf.scene

    model.updateMatrixWorld(true)
    // Выравнивание модели по землеs
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
