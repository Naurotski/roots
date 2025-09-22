import {
  PlaneGeometry,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  LinearFilter,
  LinearMipMapLinearFilter,
  SRGBColorSpace,
  FrontSide
} from 'three'

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
  offset = 0.001 // на сколько отодвинуть от стены
}) => {
  const loader = new TextureLoader()
  loader.setCrossOrigin?.('anonymous')
  const texture = await loader.loadAsync(url)
  await texture.image?.decode?.().catch(() => {})
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
  texture.colorSpace = SRGBColorSpace
  texture.minFilter = LinearMipMapLinearFilter
  texture.magFilter = LinearFilter
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
