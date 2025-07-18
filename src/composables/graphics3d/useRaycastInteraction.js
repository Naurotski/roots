import { Box3, Euler, Matrix3, Quaternion, Raycaster, Vector2, Vector3 } from 'three'
import { findTaggedParent } from 'src/composables/graphics3d/findIntersectionElement'

export const useRaycastInteraction = ({ camera, scene, renderer, controlsObject }) => {
  const raycaster = new Raycaster()
  const mouse = new Vector2()

  let moveTarget = null // Хранит цель перемещения (позиции и повороты)
  let moveProgress = 0 // Прогресс анимации от 0 до 1
  const moveDuration = 2 // Время анимации в секундах

  const normalizeMouseEvent = (e) => {
    //Переводим координаты мыши в нормализованную систему
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  }

  const onMousedown = async (e) => {
    if (e.button !== 0 || e.target !== renderer.domElement) return // Только левая кнопка
    normalizeMouseEvent(e)
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children, true)
    console.log('intersects --', intersects)
    if (intersects.length > 0) {
      const intersect = intersects[0]
      const taggedParent = findTaggedParent(intersect.object)
      console.log('taggedParent  =====', taggedParent)
      if (!taggedParent?.userData.isPainting) return

      // Получаем центр картины
      const boundingBox = new Box3().setFromObject(taggedParent)
      const targetPos = new Vector3()
      boundingBox.getCenter(targetPos)

      // Получаем нормаль поверхности
      const paintingNormal = intersect.face.normal
        .clone()
        .applyMatrix3(new Matrix3().getNormalMatrix(intersect.object.matrixWorld))
        .normalize()

      // Смещаем точку назад по нормали на 1 метра (позиция куда нужно встать)
      const newPosition = targetPos.clone().addScaledVector(paintingNormal, 1)

      // Вычисляем направление взгляда на картину
      const lookDirection = newPosition.clone().sub(targetPos).normalize()
      const targetRotation = new Quaternion().setFromEuler(
        new Euler(0, Math.atan2(lookDirection.x, lookDirection.z), 0)
      )

      moveTarget = {
        startPos: controlsObject.position.clone(),
        endPos: newPosition.clone(),
        startQuat: controlsObject.quaternion.clone(),
        endQuat: targetRotation.clone()
      }
      moveProgress = 0 // Сброс прогресса
    }
  }

  const el = renderer.domElement
  el.addEventListener('mousedown', onMousedown)

  const raycastInteractionUnmounted = () => {
    const el = renderer.domElement
    el.removeEventListener('mousedown', onMousedown)
  }
  const updateMoveToPainting = (delta) => {
    if (moveTarget) {
      moveProgress += delta / moveDuration
      const progress = Math.min(moveProgress, 1)

      controlsObject.position.lerpVectors(moveTarget.startPos, moveTarget.endPos, progress)
      controlsObject.quaternion.slerpQuaternions(moveTarget.startQuat, moveTarget.endQuat, progress)

      controlsObject.children[0].rotation.x = 0

      if (progress === 1) {
        moveTarget = null
      }
    }
  }

  return { raycastInteractionUnmounted, updateMoveToPainting }
}
