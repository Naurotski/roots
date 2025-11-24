import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'
import { manager } from 'src/composables/graphics3d/loadingManager'

let cachedLoader = null

export function getGLTFLoader(renderer) {
  if (cachedLoader) return cachedLoader

  // Путь до транскодера — ПОДСТАВЬ свой!
  // Должно указывать на папку, где лежат basis_transcoder.{js,wasm}
  const ktx2Loader = new KTX2Loader(manager).setTranscoderPath('/basis/').detectSupport(renderer)

  const loader = new GLTFLoader(manager)
  loader.setCrossOrigin('anonymous')
  loader.setKTX2Loader(ktx2Loader)

  cachedLoader = loader
  return loader
}
