import { Box3, Matrix3, Raycaster, Vector2, Vector3 } from 'three'
import { findTaggedParent } from 'src/composables/graphics3d/findIntersectionElement'
import { rotateToTarget, rotateHeadToTarget } from 'src/composables/graphics3d/rotateToTarget'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { storeToRefs } from 'pinia'
const graphics3DStore = useGraphics3DStore()
const { isAutoMoving } = storeToRefs(graphics3DStore)
const { updateCheckAutoMoving } = graphics3DStore

export const useRaycastInteraction = ({ camera, renderer, controlsObject, collidableMeshes }) => {
  const raycaster = new Raycaster()
  const mouse = new Vector2()
  const targetPos = new Vector3()

  const moveSpeed = 2 // м/с
  let moveTarget = null
  let lookAtTargetPos = null

  const normalizeMouseEvent = (e) => {
    //Переводим координаты мыши в нормализованную систему
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  }

  const onMousedown = async (e) => {
    if (e.button !== 0 || e.target !== renderer.domElement || isAutoMoving.value) return // Только левая кнопка
    normalizeMouseEvent(e)
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(collidableMeshes, true)
    if (intersects.length > 0) {
      const intersect = intersects[0]
      console.log('intersects  =====', intersects)

      const taggedParent = findTaggedParent(intersect.object)
      console.log('taggedParent  =====', taggedParent)
      if (!taggedParent) return

      // Получаем центр картины
      const boundingBox = new Box3().setFromObject(taggedParent)
      boundingBox.getCenter(targetPos)

      // Получаем нормаль поверхности
      const paintingNormal = intersect.face.normal
        .clone()
        .applyMatrix3(new Matrix3().getNormalMatrix(intersect.object.matrixWorld))
        .normalize()

      lookAtTargetPos = targetPos.clone() // Смотрим на центр картины
      moveTarget = targetPos.clone().add(paintingNormal.clone().multiplyScalar(1)) // Двигаемся на метр перед картиной
      updateCheckAutoMoving(true)
      console.log('lookAtTargetPos  ---', lookAtTargetPos)
    }
  }

  const updateMoveToPainting = (delta) => {
    if (!moveTarget || !lookAtTargetPos) return

    rotateToTarget(controlsObject, lookAtTargetPos, delta, moveTarget, moveSpeed)
    const head = controlsObject.getObjectByName('head')
    if (head) {
      rotateHeadToTarget(controlsObject, head, lookAtTargetPos, delta, moveTarget, moveSpeed)
    }

    const dir = moveTarget.clone().sub(controlsObject.position)
    const distance = dir.length()

    if (distance < 0.05) {
      controlsObject.position.copy(moveTarget)
      moveTarget = null
      lookAtTargetPos = null
      updateCheckAutoMoving(false)
    } else {
      dir.normalize()
      controlsObject.position.add(dir.multiplyScalar(moveSpeed * delta))
    }
  }
  const el = renderer.domElement
  el.addEventListener('mousedown', onMousedown)

  const raycastInteractionUnmounted = () => {
    el.removeEventListener('mousedown', onMousedown)
  }
  return { raycastInteractionUnmounted, updateMoveToPainting }
}
