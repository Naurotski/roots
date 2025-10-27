import { BoxGeometry, Color, Mesh, MeshStandardMaterial } from 'three'
import { manager } from 'src/composables/graphics3d/loadingManager'
import { useSpotLight } from 'src/composables/graphics3d/useSpotLight'
import { loadTextureSmart } from 'src/composables/graphics3d/ktx2/loadTextureSmart'

export const createPainting = async ({
  renderer,
  point,
  normal,
  scene,
  collidableMeshes,
  url,
  width,
  height,
  paintingId,
  ktx2Variants,
  perfTier
}) => {
  const texture = await loadTextureSmart({ renderer, url, ktx2Variants, perfTier, manager })

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
