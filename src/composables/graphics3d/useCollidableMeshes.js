import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Box3 } from 'three'
import { Loading } from 'quasar'

export const useCollidableMeshes = (scene, collidableMeshes) => {
  const loadModelGallery = async (url) => {
    Loading.show({ message: 'Loading model...' })
    try {
      const loader = new GLTFLoader()
      const gltf = await loader.loadAsync(url)
      const model = gltf.scene

      // Выравнивание модели по землеs
      const box = new Box3().setFromObject(model)
      model.position.set(0, -box.min.y, 0)
      model.scale.set(1, 1, 1)

      scene.add(model)

      // Собираем все меши модели
      model.traverse((child) => {
        if (child.isMesh) {
          child.receiveShadow = true
          collidableMeshes.push(child)
        }
      })
    } catch (err) {
      console.error('Ошибка загрузки модели:', err)
    } finally {
      Loading.hide() // Скрыть лоадер
    }
  }
  return {
    loadModelGallery
  }
}
