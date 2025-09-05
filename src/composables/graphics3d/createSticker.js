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

export const createSticker = ({
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
  const texture = new TextureLoader().setCrossOrigin('anonymous').load(url, (t) => {
    t.anisotropy = renderer.capabilities.getMaxAnisotropy()
    t.colorSpace = SRGBColorSpace
    t.minFilter = LinearMipMapLinearFilter // или LinearFilter для чётких изображений
    t.magFilter = LinearFilter
  })

  const material = new MeshStandardMaterial({
    map: texture,
    transparent: true, // у картинки есть альфа
    alphaTest: 0.01, // отбрасываем почти полностью прозрачные пиксели (меньше лишнего овердро)
    depthWrite: false, // наклейка не «портит» буфер глубины
    polygonOffset: true, // убираем мерцание с поверхностью стены
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
    side: FrontSide
  })

  const sticker = new Mesh(new PlaneGeometry(+width, +height), material)

  // позиционируем вплотную к стене
  sticker.position.copy(point).add(normal.clone().multiplyScalar(offset))
  // ориентируем плоскость лицом наружу (как у картины)
  sticker.lookAt(point.clone().add(normal))

  if (rotation) {
    sticker.rotateZ(rotation.z)
    sticker.userData.rotation = rotation.z
  }

  sticker.userData.isSticker = true
  sticker.userData.id = stickerId
  sticker.userData.normal = normal.clone()

  scene.add(sticker)
  collidableMeshes?.push(sticker)

  return sticker
}
