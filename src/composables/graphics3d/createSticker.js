import {
  PlaneGeometry,
  Mesh,
  MeshStandardMaterial,
  FrontSide
} from 'three'
import { manager } from 'src/composables/graphics3d/loadingManager'
import { loadTextureSmart } from 'src/composables/graphics3d/ktx2/loadTextureSmart'
export const createSticker = async ({
  renderer,
  point,
  normal,
  scene,
  collidableMeshes,
  url,
  width,
  height,
  stickerId,
  rotation,
  offset = 0.001,
  ktx2Variants,
  perfTier // на сколько отодвинуть от стены
}) => {
  const texture = await loadTextureSmart({ renderer, url, ktx2Variants, perfTier, manager })
  const material = new MeshStandardMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.01,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
    side: FrontSide
  })

  const sticker = new Mesh(new PlaneGeometry(+width, +height), material)

  sticker.position.copy(point).add(normal.clone().multiplyScalar(offset))
  sticker.lookAt(point.clone().add(normal))

  if (rotation) {
    sticker.rotation.z = rotation.z
    sticker.userData.rotation = rotation.z
  }

  sticker.userData.isSticker = true
  sticker.userData.id = stickerId
  sticker.userData.normal = normal.clone()

  scene.add(sticker)
  collidableMeshes?.push(sticker)

  return sticker
}
