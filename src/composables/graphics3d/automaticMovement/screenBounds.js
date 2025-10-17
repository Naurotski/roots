import { Vector2, Vector3 } from 'three'
import { useGraphics3DStore } from 'stores/graphics3D-store'

export function recomputeAndUpdateScreenBounds({
  boundingBox,

  camera,
  renderer,
  taggedParent
}) {
  const graphics3DStore = useGraphics3DStore()
  const { updateSelectedElementId } = graphics3DStore
  // scene.updateMatrixWorld(true)
  // camera.updateProjectionMatrix()
  // camera.updateMatrixWorld(true)

  const { min, max } = boundingBox
  const corners = [
    new Vector3(min.x, min.y, min.z),
    new Vector3(min.x, min.y, max.z),
    new Vector3(min.x, max.y, min.z),
    new Vector3(min.x, max.y, max.z),
    new Vector3(max.x, min.y, min.z),
    new Vector3(max.x, min.y, max.z),
    new Vector3(max.x, max.y, min.z),
    new Vector3(max.x, max.y, max.z)
  ]
  const size = renderer.getSize(new Vector2())
  const pts = corners.map((v) => {
    const p = new Vector3().copy(v).project(camera)
    return { x: (p.x * 0.5 + 0.5) * size.x, y: (-p.y * 0.5 + 0.5) * size.y }
  })
  const xs = pts.map((p) => p.x)
  const ys = pts.map((p) => p.y)

  updateSelectedElementId({
    id: taggedParent.userData.id,
    isPainting: !!taggedParent.userData.isPainting,
    isSticker: !!taggedParent.userData.isSticker,
    screenBounds: {
      xMin: Math.min(...xs),
      xMax: Math.max(...xs),
      yMin: Math.min(...ys),
      yMax: Math.max(...ys)
    }
  })
}
