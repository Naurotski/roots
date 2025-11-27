import { AnimationMixer, Box3, Vector3 } from 'three'
import { pickKTX2Variant } from 'src/composables/graphics3d/ktx2/pickKTX2'
import { getGLTFLoader } from 'src/composables/graphics3d/loaders/gltfLoader'

export function loadModel({ renderer, url, glbVariants, targetHeight, perfTier }) {
  return new Promise((resolve, reject) => {
    const localUrl = pickKTX2Variant(glbVariants, perfTier) || url
    console.log('localUrl --', localUrl)
    const size = new Vector3()
    const loader = getGLTFLoader(renderer)
    loader.setCrossOrigin('anonymous')
    loader.load(
      localUrl,
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
