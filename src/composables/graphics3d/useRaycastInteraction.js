import { storeToRefs } from 'pinia'
import { Box3, Quaternion, Raycaster, Vector2, Vector3 } from 'three'
import { createPainting } from 'src/composables/3D/createPainting'
import { clearHighlight, highlightElement } from 'src/composables/3D/removeElement'
import { loadModel } from 'src/composables/3D/loadModel'
import { modelPositioning } from 'src/composables/3D/modelPositioning'
import { findTaggedParent } from 'src/composables/3D/findIntersectionElement'
import { useGraphics3DStore } from 'stores/graphics3D-store'
const graphics3DStore = useGraphics3DStore()
const { selectedGallery } = storeToRefs(graphics3DStore)
const { updateGallery } = graphics3DStore

export const useRaycastInteraction = ({
  camera,
  scene,
  renderer,
  collidableMeshes,
  newElement,
  emit
}) => {
  let isMouseDown = false
  const raycaster = new Raycaster()
  const mouse = new Vector2()
  const offset = new Vector3()
  let selectedElement, normal, point, hoveredElement, wheelTimeout

  const normalizeMouseEvent = (e) => {
    //Переводим координаты мыши в нормализованную систему
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  }
  const updateElement = async () => {
    if (selectedElement && normal && point) {
      const typeStore = selectedElement.userData.isPainting ? 'storeroom' : 'store'
      await updateGallery({
        path: `${selectedGallery.value.galleryId}/${typeStore}/${selectedElement.userData.id}/position`,
        data: { point, normal }
      })
    }
    isMouseDown = false
    selectedElement = null
  }
  const onMousedown = async (e) => {
    normal = null
    point = null
    if (e.button !== 0 || e.target !== renderer.domElement) return // Только левая кнопка
    selectedElement = null
    isMouseDown = true
    normalizeMouseEvent(e)
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(collidableMeshes, true)
    if (intersects.length > 0) {
      const intersect = intersects[0]
      const taggedParent = findTaggedParent(intersect.object)
      if (taggedParent?.userData.isPainting || taggedParent?.userData.isPlaceableObject) {
        selectedElement = taggedParent
        offset.copy(intersect.point).sub(selectedElement.position)
      } else if (newElement.value.url) {
        point = intersect.point
        normal = intersect.face.normal.clone().transformDirection(intersect.object.matrixWorld)
        const rawData = JSON.parse(JSON.stringify(newElement.value))
        if (!newElement.value.targetHeight) {
          selectedElement = await createPainting({
            renderer,
            point,
            normal,
            scene,
            collidableMeshes,
            url: rawData.url,
            width: rawData.width,
            height: rawData.height,
            paintingId: rawData.paintingId
          })
        } else {
          if (normal.y < 0.9) return // Ограничим установку только на "горизонтальные" поверхности
          const modelData = await loadModel({
            url: rawData.url,
            targetHeight: rawData.targetHeight
          })
          selectedElement = await modelPositioning({
            scene,
            modelData,
            point,
            normal,
            objectId: newElement.value.objectId,
            collidableMeshes
          })
        }
        offset.copy(intersect.point).sub(selectedElement.position)
        await updateElement()
        emit('clearNewElement')
      }
    }
  }
  const onMousemove = (e) => {
    normalizeMouseEvent(e)
    raycaster.setFromCamera(mouse, camera)
    // --- Подсветка картины при наведении ---
    const hoverIntersects = raycaster.intersectObjects(scene.children, true)
    // const hovered = hoverIntersects.find((i) => i.object.userData.isPainting)?.object
    hoveredElement = hoverIntersects
      .map((i) => findTaggedParent(i.object))
      .find((obj) => obj !== null)

    if (hoveredElement) {
      highlightElement(hoveredElement)
    } else {
      hoveredElement = null
      clearHighlight()
    }
    if (!isMouseDown || !selectedElement) return
    // Столкновение со стенами
    const intersects = raycaster
      .intersectObjects(collidableMeshes, false)
      .filter((item) => !item.object.userData.isPainting)
    if (intersects.length > 0) {
      const intersect = intersects[0]
      point = intersect.point //точку пересечения
      // нормаль к поверхности
      normal = intersect.face.normal.clone().transformDirection(intersect.object.matrixWorld)
      const spotLight = selectedElement.userData.spotLight
      const target = selectedElement.userData.spotLightTarget
      if (selectedElement.userData.isPainting) {
        // Устанавливаем картину
        selectedElement.position
          .copy(point.clone().sub(offset)) //перемещаем картину так, чтобы она оставалась под курсором, с учётом начального смещения
          .add(normal.clone().multiplyScalar(0.05))
        // Поворачиваем картину так, чтобы она смотрела вперёд от стены
        const forward = new Vector3(0, 0, 1) // "смотрим вперёд"
        const targetQuaternion = new Quaternion().setFromUnitVectors(
          forward,
          normal.clone().normalize()
        )
        selectedElement.quaternion.copy(targetQuaternion)
        if (spotLight && target) {
          target.position.copy(selectedElement.position)
          spotLight.position.copy(
            selectedElement.position
              .clone()
              .add(normal.clone().multiplyScalar(2))
              .add(new Vector3(0, 1, 0))
          )
        }
      } else if (selectedElement.userData.isPlaceableObject && Math.abs(normal.y) > 0.9) {
        // 3D-модель: ставим точно на поверхность, корректируем по высоте
        selectedElement.position.copy(point)
        selectedElement.position.y += 0.01
        if (spotLight && target) {
          const boundingBox = new Box3().setFromObject(selectedElement)
          const modelHeight = boundingBox.max.y - boundingBox.min.y
          const modelCenter = new Vector3()
          boundingBox.getCenter(modelCenter)

          const direction = modelCenter.clone().sub(new Vector3(0, 0, 0)).normalize()
          spotLight.position
            .copy(modelCenter)
            .add(direction.clone().multiplyScalar(-2))
            .add(new Vector3(0, modelHeight / 2 + 2, 0))
          target.position.copy(modelCenter)
        }
      }
    }
  }
  const onWheel = (e) => {
    if (!hoveredElement || !hoveredElement.userData.isPlaceableObject) return
    e.preventDefault()
    const rotationSpeed = 0.02
    hoveredElement.rotation.y += e.deltaY * rotationSpeed * -1
    // Сбросить старый таймер
    clearTimeout(wheelTimeout)
    // Новый таймер для сохранения через 500 мс после последнего скролла
    wheelTimeout = setTimeout(async () => {
      if (!hoveredElement?.userData?.id) return
      await updateGallery({
        path: `${selectedGallery.value.galleryId}/store/${hoveredElement.userData.id}/position/rotation/`,
        data: { y: hoveredElement.rotation.y }
      })
    }, 500)
  }

  const onMouseup = async (e) => {
    if (e.button !== 0) return
    await updateElement()
  }
  const onMouseleave = () => {
    isMouseDown = false
    selectedElement = null
  }

  const el = renderer.domElement
  el.addEventListener('mousedown', onMousedown)
  el.addEventListener('mouseup', onMouseup)
  el.addEventListener('mousemove', onMousemove)
  el.addEventListener('mouseleave', onMouseleave)
  el.addEventListener('wheel', onWheel, { passive: false })

  const raycastInteractionUnmounted = () => {
    const el = renderer.domElement
    el.removeEventListener('mousedown', onMousedown)
    el.removeEventListener('mouseup', onMouseup)
    el.removeEventListener('mousemove', onMousemove)
    el.removeEventListener('mouseleave', onMouseleave)
    el.removeEventListener('wheel', onWheel)
  }
  return { raycastInteractionUnmounted }
}
