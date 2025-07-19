import { Object3D } from 'three'
export const usePlayerControls = (camera, renderer) => {
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

  const onMousedown = (e) => {
    if (e.button !== 0 || e.target !== renderer.domElement) return
    isMouseDown = true
    prevMouseX = e.clientX
    prevMouseY = e.clientY
  }
  const onMousemove = (e) => {
    if (!isMouseDown) return
    const dx = e.clientX - prevMouseX
    const dy = e.clientY - prevMouseY
    // Вращение тела (влево-вправо)
    controlsObject.rotation.y -= dx * rotationSpeed
    // Вращение головы (вверх-вниз)
    head.rotation.x -= dy * rotationSpeed
    head.rotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, head.rotation.x))
    prevMouseX = e.clientX
    prevMouseY = e.clientY
  }

  const onMouseup = () => {
    isMouseDown = false
  }
  const onMouseleave = () => {
    isMouseDown = false
  }

  // === Управление клавишами ===
  const onKeydown = (e) => (keysPressed[e.code] = true)
  const onKeyup = (e) => (keysPressed[e.code] = false)

  const el = renderer.domElement
  el.addEventListener('mousedown', onMousedown)
  el.addEventListener('mousemove', onMousemove)
  el.addEventListener('mouseleave', onMouseleave)
  window.addEventListener('mouseup', onMouseup)
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('keyup', onKeyup)

  const playerControlsUnmounted = () => {
    el.removeEventListener('mousedown', onMousedown)
    el.removeEventListener('mousemove', onMousemove)
    el.removeEventListener('mouseleave', onMouseleave)
    window.removeEventListener('mouseup', onMouseup)
    document.removeEventListener('keydown', onKeydown)
    document.removeEventListener('keyup', onKeyup)
  }
  return {
    controlsObject,
    controlsObjectHeight,
    keysPressed,
    playerControlsUnmounted
  }
}
