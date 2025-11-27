import { TextureLoader, SRGBColorSpace, LinearFilter, LinearMipMapLinearFilter } from 'three'
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'
import { pickKTX2Variant } from 'src/composables/graphics3d/ktx2/pickKTX2'

let texLoader, ktx2
const getTL = (manager) => texLoader || (texLoader = new TextureLoader(manager))

const getKTX2 = (renderer, manager) => {
  if (!ktx2) {
    ktx2 = new KTX2Loader(manager).setTranscoderPath('/basis/').detectSupport(renderer)
  }
  return ktx2
}

export const loadTextureSmart = async ({ renderer, url, ktx2Variants, perfTier, manager }) => {
  const ktxUrl = pickKTX2Variant(ktx2Variants, perfTier)
  console.log('ktxUrl ---', ktxUrl)
  if (ktxUrl) {
    try {
      const t = await getKTX2(renderer, manager).loadAsync(ktxUrl)
      t.colorSpace = SRGBColorSpace
      t.minFilter = LinearMipMapLinearFilter
      t.magFilter = LinearFilter
      t.anisotropy = renderer.capabilities.getMaxAnisotropy()
      return t
    } catch (e) {
      console.warn('KTX2 failed, fallback to preview:', e)
    }
  }
  console.log('url ====', url)
  const tl = getTL(manager)
  tl.setCrossOrigin?.('anonymous')
  const t = await tl.loadAsync(url)
  await t.image?.decode?.().catch(() => {})
  t.colorSpace = SRGBColorSpace
  t.minFilter = LinearMipMapLinearFilter
  t.magFilter = LinearFilter
  t.anisotropy = renderer.capabilities.getMaxAnisotropy()
  return t
}
