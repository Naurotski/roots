import {
  BoxGeometry,
  Color,
  LinearFilter,
  LinearMipMapLinearFilter,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  SRGBColorSpace
} from 'three'
import { manager } from 'src/composables/graphics3d/loadingManager'
import { useSpotLight } from 'src/composables/graphics3d/useSpotLight'

export const createPainting = async ({
  renderer,
  point,
  normal,
  scene,
  collidableMeshes,
  url,
  width,
  height,
  paintingId
}) => {
  const loader = new TextureLoader(manager)
  loader.setCrossOrigin?.('anonymous')

  const texture = await loader.loadAsync(url)
  await texture.image?.decode?.().catch(() => {})

  texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
  texture.colorSpace = SRGBColorSpace
  texture.minFilter = LinearMipMapLinearFilter
  texture.magFilter = LinearFilter

  const sideMaterial = new MeshStandardMaterial({ color: new Color(0xffffff) })

  const painting = new Mesh(new BoxGeometry(+width, +height, 0.02), [
    sideMaterial,
    sideMaterial,
    sideMaterial,
    sideMaterial,
    new MeshStandardMaterial({ map: texture }),
    sideMaterial
  ])

  painting.position.copy(point).add(normal.clone().multiplyScalar(0.01))
  painting.lookAt(point.clone().add(normal))
  painting.userData.isPainting = true
  painting.userData.id = paintingId
  painting.userData.normal = normal.clone()

  scene.add(painting)
  useSpotLight(scene, painting)
  collidableMeshes.push(painting)

  return painting
}
