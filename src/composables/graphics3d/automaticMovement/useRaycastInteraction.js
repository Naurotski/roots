import { storeToRefs } from 'pinia'
import { Box3, MathUtils, Matrix3, Matrix4, Raycaster, Vector2, Vector3 } from 'three'
import { Screen } from 'quasar'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { useSharedStore } from 'stores/shared-store'
import { findTaggedParent } from 'src/composables/graphics3d/findIntersectionElement'
import {
  rotateToTarget,
  rotateHeadToTarget
} from 'src/composables/graphics3d/automaticMovement/rotateToTarget'
import { recomputeAndUpdateScreenBounds } from 'src/composables/graphics3d/automaticMovement/screenBounds'
import { watch } from 'vue'

export const useRaycastInteraction = ({
  camera,
  scene,
  renderer,
  controlsObject,
  collidableMeshes
}) => {
  const graphics3DStore = useGraphics3DStore()
  const { isAutoMoving, selectedElementId, videoList } = storeToRefs(graphics3DStore)
  const { updateCheckAutoMoving, updateSelectedElementId, updateVideoAudio } = graphics3DStore
  const sharedStore = useSharedStore()
  const { headerFooterHidden } = storeToRefs(sharedStore)
  const raycaster = new Raycaster()
  const mouse = new Vector2()
  const targetPos = new Vector3()

  const APPROACH_DISTANCE = 1
  const moveSpeed = 2 // м/с
  let moveTarget = null
  let lookAtTargetPos = null
  let taggedParent = null
  let boundingBox = null
  let mainTarget = null // Цель перед картиной
  let isBypassing = false

  const normalizeMouseEvent = (e) => {
    //Переводим координаты мыши в нормализованную систему
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  }
  const onMousedownRaycaster = async (e) => {
    if (e.button !== 0 || e.target !== renderer.domElement || isAutoMoving.value) return // Только левая кнопка
    normalizeMouseEvent(e)
    raycaster.setFromCamera(mouse, camera)
    if (selectedElementId.value) updateSelectedElementId(null)
    const intersects = raycaster.intersectObjects(collidableMeshes, true)
    if (intersects.length > 0) {
      const intersect = intersects[0]
      if (intersect.object.name === 'Smart_TV_1') {
        updateVideoAudio('Smart_TV_1', 'play', !videoList.value['Smart_TV_1']?.play, 'videoStore')
        return
      }
      taggedParent = findTaggedParent(intersect.object)
      if (
        !taggedParent ||
        (Screen.lt.md &&
          !document.fullscreenElement &&
          !document.webkitFullscreenElement &&
          !headerFooterHidden.value)
      ) {
        taggedParent = null
        return
      }

      // Получаем центр картины
      boundingBox = new Box3().setFromObject(taggedParent)
      boundingBox.getCenter(targetPos)

      let normalForApproach = null

      // Получаем нормаль поверхности
      if (taggedParent.userData.isPainting || taggedParent.userData.isSticker) {
        normalForApproach = intersect.face.normal
          .clone()
          .applyMatrix3(new Matrix3().getNormalMatrix(intersect.object.matrixWorld))
          .normalize()
      } else if (taggedParent.userData.isPlaceableObject && taggedParent.userData.normal) {
        normalForApproach = taggedParent.userData.normal.clone().normalize()
      }
      if (!normalForApproach) return

      lookAtTargetPos = targetPos.clone()
      mainTarget = targetPos.clone().addScaledVector(normalForApproach, APPROACH_DISTANCE) // пределяем конечную точку движениях один метр перед картиной по нормали
      moveTarget = mainTarget.clone()

      const result = findClearPathDirection()
      if (!result) {
        console.log('The movement has not started: the road is closed in all directions')
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
        return { direction: testDir, isOriginal: false }
      }
    }
    console.log('No bypass was found - the path is blocked on all sides')
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
        controlsObject.position.clone(),
        mainTarget.clone().sub(controlsObject.position).normalize()
      )
    ) {
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
    if (distance <= 0.01) {
      controlsObject.position.copy(moveTarget)
      moveTarget = null
      lookAtTargetPos = null
      updateCheckAutoMoving(false)
      if (!selectedElementId || selectedElementId.id !== taggedParent.userData.id) {
        recomputeAndUpdateScreenBounds({
          boundingBox,
          scene,
          camera,
          renderer,
          taggedParent
        })
      }
      // taggedParent = null
    } else {
      const maxStep = moveSpeed * delta
      const step = Math.min(maxStep, distance)
      controlsObject.position.add(dir.multiplyScalar(step / (distance || 1)))
    }
  }
  const onWindowResize = () => {
    if (!selectedElementId.value) return
    recomputeAndUpdateScreenBounds({
      boundingBox,
      scene,
      camera,
      renderer,
      taggedParent
    })
  }

  watch(
    () => [Screen.width, Screen.height, headerFooterHidden.value],
    () => {
      if (!selectedElementId.value) return
      if (
        Screen.lt.md &&
        !document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !headerFooterHidden.value
      ) {
        updateSelectedElementId(null)
        taggedParent = null
        return
      }
      recomputeAndUpdateScreenBounds({
        boundingBox,
        scene,
        camera,
        renderer,
        taggedParent
      })
    }
  )

  const onMousemoveRaycaster = (e) => {
    if (isAutoMoving.value) return // Только левая кнопка
    normalizeMouseEvent(e)
    raycaster.setFromCamera(mouse, camera)
    const hoverIntersects = raycaster.intersectObjects(collidableMeshes, true)
    let hovered = hoverIntersects
      .map((i) => findTaggedParent(i.object) || i.object.name === 'Smart_TV_1')
      .find((obj) => obj !== null)
    if (hovered) {
      document.body.style.cursor = 'pointer'
    } else {
      document.body.style.cursor = 'default'
    }
  }
  const el = renderer.domElement
  el.addEventListener('mousedown', onMousedownRaycaster)
  el.addEventListener('mousemove', onMousemoveRaycaster)
  window.addEventListener('resize', onWindowResize)

  const raycastInteractionUnmounted = () => {
    el.removeEventListener('mousedown', onMousedownRaycaster)
    el.removeEventListener('mousemove', onMousemoveRaycaster)
    window.removeEventListener('resize', onWindowResize)
  }
  return { raycastInteractionUnmounted, updateMoveToPainting }
}
