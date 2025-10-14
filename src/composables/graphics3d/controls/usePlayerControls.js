import { Object3D } from 'three'
import { storeToRefs } from 'pinia'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { useStripeStore } from 'stores/stripe-store'
import { createTouchControls } from 'src/composables/graphics3d/controls/touchControls'

export const usePlayerControls = (camera, renderer) => {
  const graphics3DStore = useGraphics3DStore()
  const { isAutoMoving, selectedElementId } = storeToRefs(graphics3DStore)
  const { updateSelectedElementId } = graphics3DStore
  const stripeStore = useStripeStore()
  const { paymentDialogChek } = storeToRefs(stripeStore)

  // === Игрок: тело и голова (камера) ===
  const controlsObject = new Object3D() // тело
  const head = new Object3D() // голова
  const controlsObjectHeight = 1.6
  const keysPressed = {}

  // Добавляем камеру в "голову", голову — в "тело"
  head.add(camera)
  head.name = 'head'
  controlsObject.add(head)
  controlsObject.position.set(5, controlsObjectHeight, 2)

  // Управление мышью
  let isMouseDown = false
  let prevMouseX = 0
  let prevMouseY = 0
  const rotationSpeed = 0.002

  const el = renderer.domElement

  const onMousedownRaycaster = (e) => {
    if (
      e.button !== 0 ||
      e.target !== renderer.domElement ||
      isAutoMoving.value ||
      paymentDialogChek.value
    )
      return
    isMouseDown = true
    prevMouseX = e.clientX
    prevMouseY = e.clientY
  }
  const onMousemoveRaycaster = (e) => {
    if (!isMouseDown || isAutoMoving.value || paymentDialogChek.value) return
    const dx = e.clientX - prevMouseX
    const dy = e.clientY - prevMouseY
    // Вращение тела (влево-вправо)
    controlsObject.rotation.y -= dx * rotationSpeed
    // Вращение головы (вверх-вниз)
    head.rotation.x -= dy * rotationSpeed
    head.rotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, head.rotation.x))
    prevMouseX = e.clientX
    prevMouseY = e.clientY
    if (selectedElementId.value) setTimeout(() => updateSelectedElementId(null), 500)
  }

  const onMouseup = () => {
    isMouseDown = false
  }
  const onMouseleave = () => {
    isMouseDown = false
  }

  // === Управление клавишами ===
  const onKeydown = (e) => {
    if (isAutoMoving.value || paymentDialogChek.value) return
    keysPressed[e.code] = true
    if (selectedElementId.value) setTimeout(() => updateSelectedElementId(null), 500)
  }
  const onKeyup = (e) => {
    if (isAutoMoving.value || paymentDialogChek.value) return
    keysPressed[e.code] = false
  }

  // ==== ТАЧ (мобильный) — без перекрытия кликов
  const touch = createTouchControls({
    el,
    controlsObject,
    head,
    keysPressed,
    isAutoMoving,
    paymentDialogChek,
    selectedElementId
  })
  touch.attach()

  // ==== навесить слушатели
  el.addEventListener('mousedown', onMousedownRaycaster)
  el.addEventListener('mousemove', onMousemoveRaycaster)
  el.addEventListener('mouseleave', onMouseleave)
  window.addEventListener('mouseup', onMouseup)
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('keyup', onKeyup)

  // ==== анмаунт
  const playerControlsUnmounted = () => {
    console.log('playerControlsUnmounted --------------')
    el.removeEventListener('mousedown', onMousedownRaycaster)
    el.removeEventListener('mousemove', onMousemoveRaycaster)
    el.removeEventListener('mouseleave', onMouseleave)
    window.removeEventListener('mouseup', onMouseup)
    document.removeEventListener('keydown', onKeydown)
    document.removeEventListener('keyup', onKeyup)

    // ТАЧ (очистит слушатели и удалит оба визуала)
    touch.detach()
  }

  return {
    controlsObject,
    controlsObjectHeight,
    keysPressed,
    playerControlsUnmounted
  }
}
