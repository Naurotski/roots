import { Object3D } from 'three'
import { storeToRefs } from 'pinia'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { useStripeStore } from 'stores/stripe-store'
const graphics3DStore = useGraphics3DStore()
const { isAutoMoving, selectedElementId } = storeToRefs(graphics3DStore)
const { updateSelectedElementId } = graphics3DStore
const stripeStore = useStripeStore()
const { paymentDialogChek } = storeToRefs(stripeStore)
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

  // ==== утилиты
  const clampPitch = (v) => Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, v))

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
  const el = renderer.domElement

  const host = el.parentNode || document.body
  // if (!host.style.position) host.style.position = 'relative'

  // пороги/чувствительность
  const MOVE_ACTIVATE_PX = 10 // когда drag становится жестом
  const TAP_MAX_TIME_MS = 250 // максимум для "тапа"
  const TAP_MAX_MOVE_PX = 6 // допуск движения для "тапа"
  const lookK = 0.002 // чувствительность обзора
  const maxRadius = 60,
    deadZone = 8

  // трекинг пальцев
  let leftId = null,
    rightId = null
  let joyCenter = { x: 0, y: 0 },
    joyVec = { x: 0, y: 0 }
  let startPos = {},
    startTime = {},
    lastPos = {}
  let lookPrev = { x: 0, y: 0 }

  // визуал джойстика (не перехватывает события)
  const joyBase = document.createElement('div')
  const joyThumb = document.createElement('div')
  Object.assign(joyBase.style, {
    position: 'absolute',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,.35)',
    background: 'rgba(0,0,0,.2)',
    transform: 'translate(-50%,-50%)',
    display: 'none',
    pointerEvents: 'none',
    zIndex: 3
  })
  Object.assign(joyThumb.style, {
    position: 'absolute',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,.6)',
    background: 'rgba(255,255,255,.25)',
    transform: 'translate(-50%,-50%)',
    display: 'none',
    pointerEvents: 'none',
    zIndex: 4
  })
  host.appendChild(joyBase)
  host.appendChild(joyThumb)

  const showJoy = (x, y) => {
    joyBase.style.left = x + 'px'
    joyBase.style.top = y + 'px'
    joyThumb.style.left = x + 'px'
    joyThumb.style.top = y + 'px'
    joyBase.style.display = 'block'
    joyThumb.style.display = 'block'
  }
  const moveThumb = (x, y) => {
    const dx = x - joyCenter.x,
      dy = y - joyCenter.y
    const len = Math.hypot(dx, dy)
    const c = len > maxRadius ? maxRadius / len : 1
    joyThumb.style.left = joyCenter.x + dx * c + 'px'
    joyThumb.style.top = joyCenter.y + dy * c + 'px'
  }
  const hideJoy = () => {
    joyBase.style.display = 'none'
    joyThumb.style.display = 'none'
  }

  const norm = (dx, dy) => {
    const len = Math.hypot(dx, dy)
    if (len < deadZone) return { x: 0, y: 0 }
    const k = Math.min(1, len / maxRadius)
    return { x: (dx / (len || 1)) * k, y: (dy / (len || 1)) * k }
  }
  const applyJoystickToKeys = () => {
    keysPressed.KeyW = keysPressed.KeyA = keysPressed.KeyS = keysPressed.KeyD = false
    if (joyVec.y < -0.25) keysPressed.KeyW = true
    if (joyVec.y > 0.25) keysPressed.KeyS = true
    if (joyVec.x < -0.25) keysPressed.KeyA = true
    if (joyVec.x > 0.25) keysPressed.KeyD = true
  }

  const touchOpts = { passive: false }

  const onTouchStart = (e) => {
    if (isAutoMoving.value || paymentDialogChek.value) return
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i]
      startPos[t.identifier] = lastPos[t.identifier] = { x: t.clientX, y: t.clientY }
      startTime[t.identifier] = performance.now()
    }
  }

  const onTouchMove = (e) => {
    if (isAutoMoving.value || paymentDialogChek.value) return
    const rect = el.getBoundingClientRect()
    let active = false

    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i]
      const id = t.identifier
      const sp = startPos[id]
      if (!sp) continue
      const dx0 = t.clientX - sp.x,
        dy0 = t.clientY - sp.y
      lastPos[id] = { x: t.clientX, y: t.clientY }

      // уже назначены роли
      if (id === leftId) {
        joyVec = norm(t.clientX - joyCenter.x, t.clientY - joyCenter.y)
        applyJoystickToKeys()
        moveThumb(t.clientX, t.clientY)
        active = true
        continue
      }
      if (id === rightId) {
        const ddx = t.clientX - lookPrev.x
        const ddy = t.clientY - lookPrev.y
        controlsObject.rotation.y -= ddx * lookK
        head.rotation.x = clampPitch(head.rotation.x - ddy * lookK)
        lookPrev = { x: t.clientX, y: t.clientY }
        active = true
        continue
      }

      // ещё не назначены: проверяем порог активации
      if (Math.hypot(dx0, dy0) >= MOVE_ACTIVATE_PX) {
        const isLeftHalf = t.clientX - rect.left < rect.width * 0.5
        if (isLeftHalf && leftId === null) {
          leftId = id
          joyCenter = { x: sp.x, y: sp.y }
          joyVec = { x: 0, y: 0 }
          showJoy(joyCenter.x, joyCenter.y)
          moveThumb(joyCenter.x, joyCenter.y)
          applyJoystickToKeys()
          active = true
        } else if (!isLeftHalf && rightId === null) {
          rightId = id
          lookPrev = { x: t.clientX, y: t.clientY }
          active = true
        }
      }
    }

    if (active) {
      e.preventDefault() // блокируем скролл только для активных жестов
      if (selectedElementId.value) setTimeout(() => updateSelectedElementId(null), 500)
    }
  }

  const onTouchEnd = (e) => {
    if (isAutoMoving.value || paymentDialogChek.value) return
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i]
      const id = t.identifier
      const sp = startPos[id]
      const lp = lastPos[id]
      const dt = performance.now() - (startTime[id] || 0)
      const move = sp && lp ? Math.hypot(lp.x - sp.x, lp.y - sp.y) : 1e9

      if (id === leftId) {
        leftId = null
        joyVec = { x: 0, y: 0 }
        applyJoystickToKeys()
        hideJoy()
        e.preventDefault()
      } else if (id === rightId) {
        rightId = null
        e.preventDefault()
      } else if (sp && dt <= TAP_MAX_TIME_MS && move <= TAP_MAX_MOVE_PX) {
        // синтез клика → ваш raycaster обработает "выбор/автопереход"
        const clickEvt = new MouseEvent('click', {
          clientX: sp.x,
          clientY: sp.y,
          button: 0,
          bubbles: true,
          cancelable: true
        })
        el.dispatchEvent(clickEvt)
      }

      delete startPos[id]
      delete lastPos[id]
      delete startTime[id]
    }
  }
  const onTouchCancel = onTouchEnd

  // ==== навесить слушатели
  el.addEventListener('mousedown', onMousedownRaycaster)
  el.addEventListener('mousemove', onMousemoveRaycaster)
  el.addEventListener('mouseleave', onMouseleave)
  window.addEventListener('mouseup', onMouseup)
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('keyup', onKeyup)

  el.addEventListener('touchstart', onTouchStart, touchOpts)
  el.addEventListener('touchmove', onTouchMove, touchOpts)
  el.addEventListener('touchend', onTouchEnd, touchOpts)
  el.addEventListener('touchcancel', onTouchCancel, touchOpts)

  // ==== анмаунт
  const playerControlsUnmounted = () => {
    console.log('playerControlsUnmounted --------------')
    el.removeEventListener('mousedown', onMousedownRaycaster)
    el.removeEventListener('mousemove', onMousemoveRaycaster)
    el.removeEventListener('mouseleave', onMouseleave)
    window.removeEventListener('mouseup', onMouseup)
    document.removeEventListener('keydown', onKeydown)
    document.removeEventListener('keyup', onKeyup)

    el.removeEventListener('touchstart', onTouchStart, touchOpts)
    el.removeEventListener('touchmove', onTouchMove, touchOpts)
    el.removeEventListener('touchend', onTouchEnd, touchOpts)
    el.removeEventListener('touchcancel', onTouchCancel, touchOpts)

    // убрать визуал
    if (joyBase.parentNode) joyBase.parentNode.removeChild(joyBase)
    if (joyThumb.parentNode) joyThumb.parentNode.removeChild(joyThumb)
  }

  return {
    controlsObject,
    controlsObjectHeight,
    keysPressed,
    playerControlsUnmounted
  }
}
