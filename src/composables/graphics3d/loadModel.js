import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { AnimationMixer, Box3, Vector3 } from 'three'

export function loadModel({ url, targetHeight }) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    const size = new Vector3()

    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene
        const box = new Box3().setFromObject(model)
        box.getSize(size)
        model.scale.setScalar(targetHeight / size.y)
        let mixer = null
        const animations = gltf.animations
        if (animations?.length > 0) {
          mixer = new AnimationMixer(model)
          const action = mixer.clipAction(animations[0])
          action.play()
        }
        // тени
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
          }
        })
        resolve({ model, mixer, size })
      },
      undefined,
      (error) => {
        console.error('Ошибка при загрузке модели:', error)
        reject(error)
      }
    )
  })
}
