import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Box3 } from 'three'

export const loadModelGallery = async (url, scene, collidableMeshes) => {
  try {
    const loader = new GLTFLoader()
    const gltf = await loader.loadAsync(url)
    const model = gltf.scene

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
    console.error(err)
  }
}
