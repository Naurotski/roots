import { Box3, MathUtils, Matrix3, Matrix4, Raycaster, Vector2, Vector3 } from 'three'
import { findTaggedParent } from 'src/composables/graphics3d/findIntersectionElement'
import {
  rotateToTarget,
  rotateHeadToTarget
} from 'src/composables/graphics3d/automaticMovement/rotateToTarget'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { storeToRefs } from 'pinia'
const graphics3DStore = useGraphics3DStore()
const { isAutoMoving, selectedElementId } = storeToRefs(graphics3DStore)
const { updateCheckAutoMoving, updateSelectedElementId } = graphics3DStore

export const useRaycastInteraction = ({ camera, renderer, controlsObject, collidableMeshes }) => {
  const raycaster = new Raycaster()
  const mouse = new Vector2()
  const targetPos = new Vector3()

  const moveSpeed = 2 // м/с
  let moveTarget = null
  let lookAtTargetPos = null
  let taggedParent = null
  let mainTarget = null // Цель перед картиной
  let isBypassing = false

  const normalizeMouseEvent = (e) => {
    //Переводим координаты мыши в нормализованную систему
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  }

  const onMousedownRaycaster = async (e) => {
    console.log('onMousedownRaycaster - - - - -')
    if (e.button !== 0 || e.target !== renderer.domElement || isAutoMoving.value) return // Только левая кнопка
    normalizeMouseEvent(e)
    raycaster.setFromCamera(mouse, camera)
    if (selectedElementId.value) updateSelectedElementId(null)
    const intersects = raycaster.intersectObjects(collidableMeshes, true)
    if (intersects.length > 0) {
      const intersect = intersects[0]
      console.log('intersect  ---- ', intersect)
      taggedParent = findTaggedParent(intersect.object)
      console.log('taggedParent  =====', taggedParent)
      if (!taggedParent) return
      // Получаем центр картины
      const boundingBox = new Box3().setFromObject(taggedParent)
      boundingBox.getCenter(targetPos)

      let normalForApproach = null

      // Получаем нормаль поверхности
      if (taggedParent.userData.isPainting) {
        normalForApproach = intersect.face.normal
          .clone()
          .applyMatrix3(new Matrix3().getNormalMatrix(intersect.object.matrixWorld))
          .normalize()
      } else if (taggedParent.userData.isPlaceableObject && taggedParent.userData.normal) {
        normalForApproach = taggedParent.userData.normal.clone().normalize()
      }

      if (!normalForApproach) return

      lookAtTargetPos = targetPos.clone() // Смотрим на центр картины
      mainTarget = targetPos.clone().add(normalForApproach.clone().multiplyScalar(1)) // Двигаемся на метр перед картиной
      moveTarget = mainTarget.clone()

      const result = findClearPathDirection()
      if (!result) {
        console.log('Движение не начато: путь закрыт во всех направлениях')
        moveTarget = null
        lookAtTargetPos = null
        return
      }

      if (!result.isOriginal) {
        const origin = controlsObject.position.clone()
        origin.y += 0.3
        moveTarget = origin
          .clone()
          .add(result.direction.clone().multiplyScalar(origin.distanceTo(moveTarget)))
        isBypassing = true
      } else {
        isBypassing = false
      }
      updateCheckAutoMoving(true)
    }
  }

  const findClearPathDirection = (maxAngleDeg = 60, stepDeg = 10) => {
    if (!moveTarget) return null
    const origin = controlsObject.position.clone()
    const baseDirection = moveTarget.clone().sub(origin).normalize()
    if (isDirectionClear(origin, baseDirection)) {
      return { direction: baseDirection, isOriginal: true }
    }
    const angles = []
    for (let angle = stepDeg; angle <= maxAngleDeg; angle += stepDeg) {
      angles.push(angle)
      angles.push(-angle)
    }
    const rotateDirection = (dir, angleDeg) => {
      const angleRad = MathUtils.degToRad(angleDeg)
      return dir.clone().applyMatrix4(new Matrix4().makeRotationY(angleRad)).normalize()
    }
    for (const angle of angles) {
      const testDir = rotateDirection(baseDirection, angle)
      if (isDirectionClear(origin, testDir)) {
        console.log('Путь найден под углом', angle, 'градусов')
        return { direction: testDir, isOriginal: false }
      }
    }
    console.log('Обход не найден — путь закрыт со всех сторон')
    return null
  }
  const isDirectionClear = (origin, direction) => {
    raycaster.set(origin, direction)
    const intersects = raycaster.intersectObjects(collidableMeshes, true)
    if (intersects.length > 0) {
      const distanceToObstacle = intersects[0].distance
      const distanceToTarget = origin.distanceTo(moveTarget)
      return distanceToObstacle >= distanceToTarget
    }
    return true // Ничего не пересек — путь свободен
  }

  const updateMoveToPainting = (delta) => {
    if (!moveTarget || !lookAtTargetPos) return

    if (
      isBypassing &&
      isDirectionClear(
        controlsObject.position.clone().setY(controlsObject.position.y),
        mainTarget.clone().sub(controlsObject.position).normalize()
      )
    ) {
      console.log('Путь к цели открыт — возвращаемся к ней')
      moveTarget = mainTarget.clone()
      isBypassing = false
    }

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
      if (!selectedElementId || selectedElementId.id !== taggedParent.userData.id) {
        updateSelectedElementId({
          id: taggedParent.userData.id,
          isPainting: taggedParent.userData.isPainting
        })
      }
      taggedParent = null
    } else {
      dir.normalize()
      controlsObject.position.add(dir.multiplyScalar(moveSpeed * delta))
    }
  }

  const onMousemoveRaycaster = (e) => {
    if (isAutoMoving.value) return // Только левая кнопка
    normalizeMouseEvent(e)
    raycaster.setFromCamera(mouse, camera)
    const hoverIntersects = raycaster.intersectObjects(collidableMeshes, true)
    let hovered = hoverIntersects.map((i) => findTaggedParent(i.object)).find((obj) => obj !== null)
    // console.log('hovered --', hovered)
    if (hovered) {
      document.body.style.cursor = 'pointer'
    } else {
      document.body.style.cursor = 'default'
    }
  }
  const el = renderer.domElement
  el.addEventListener('mousedown', onMousedownRaycaster)
  el.addEventListener('mousemove', onMousemoveRaycaster)

  const raycastInteractionUnmounted = () => {
    el.removeEventListener('mousedown', onMousedownRaycaster)
    el.removeEventListener('mousemove', onMousemoveRaycaster)
  }
  return { raycastInteractionUnmounted, updateMoveToPainting }
}
