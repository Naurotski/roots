export function createTouchControls({
  el, // renderer.domElement
  controlsObject,
  head,
  keysPressed,
  isAutoMoving, // ref<boolean>
  paymentDialogChek, // ref<boolean>
  selectedElementId, // ref<any>
  updateSelectedElementId // fn
}) {
  const MOVE_ACTIVATE_PX = 10 // когда drag становится жестом
  const TAP_MAX_TIME_MS = 250 // максимум для "тапа"
  const TAP_MAX_MOVE_PX = 6 // допуск движения для "тапа"
  const lookK = 0.006 // чувствительность обзора
  const maxRadius = 60,
    deadZone = 8

  const host = el.parentNode || document.body

  // --- utils
  const clampPitch = (v) => Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, v))

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
  const clearSelectionSoon = () => {
    if (selectedElementId?.value) setTimeout(() => updateSelectedElementId(null), 500)
  }

  // --- UI helpers
  const makePad = (baseBorder = 'rgba(255,255,255,.35)', thumbBorder = 'rgba(255,255,255,.6)') => {
    const base = document.createElement('div')
    const thumb = document.createElement('div')
    Object.assign(base.style, {
      position: 'absolute',
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      border: `2px solid ${baseBorder}`,
      background: 'rgba(0,0,0,.2)',
      transform: 'translate(-50%,-50%)',
      display: 'none',
      pointerEvents: 'none',
      zIndex: 3
    })
    Object.assign(thumb.style, {
      position: 'absolute',
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      border: `2px solid ${thumbBorder}`,
      background: 'rgba(255,255,255,.25)',
      transform: 'translate(-50%,-50%)',
      display: 'none',
      pointerEvents: 'none',
      zIndex: 4
    })
    host.appendChild(base)
    host.appendChild(thumb)
    return {
      base,
      thumb,
      show: (x, y) => {
        base.style.left = x + 'px'
        base.style.top = y + 'px'
        thumb.style.left = x + 'px'
        thumb.style.top = y + 'px'
        base.style.display = 'block'
        thumb.style.display = 'block'
      },
      move: (x, y) => {
        thumb.style.left = x + 'px'
        thumb.style.top = y + 'px'
      },
      hide: () => {
        base.style.display = 'none'
        thumb.style.display = 'none'
      },
      destroy: () => {
        base.parentNode && base.parentNode.removeChild(base)
        thumb.parentNode && thumb.parentNode.removeChild(thumb)
      }
    }
  }

  // left: move pad (with clamped radius)
  const movePad = makePad('rgba(255,255,255,.35)', 'rgba(255,255,255,.6)')
  const lookPad = makePad('rgba(255,255,255,.25)', 'rgba(255,255,255,.5)')

  const moveThumbClamped = (x, y) => {
    const dx = x - joyCenter.x,
      dy = y - joyCenter.y
    const len = Math.hypot(dx, dy)
    const c = len > maxRadius ? maxRadius / len : 1
    movePad.thumb.style.left = joyCenter.x + dx * c + 'px'
    movePad.thumb.style.top = joyCenter.y + dy * c + 'px'
  }

  // state
  let leftId = null,
    rightId = null
  let joyCenter = { x: 0, y: 0 },
    joyVec = { x: 0, y: 0 }
  let startPos = {},
    startTime = {},
    lastPos = {}
  let lookPrev = { x: 0, y: 0 }
  const touchOpts = { passive: false }

  // --- handlers
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

      if (id === leftId) {
        joyVec = norm(t.clientX - joyCenter.x, t.clientY - joyCenter.y)
        applyJoystickToKeys()
        moveThumbClamped(t.clientX, t.clientY)
        active = true
        continue
      }
      if (id === rightId) {
        const ddx = t.clientX - lookPrev.x
        const ddy = t.clientY - lookPrev.y
        controlsObject.rotation.y -= ddx * lookK
        head.rotation.x = clampPitch(head.rotation.x - ddy * lookK)
        lookPad.move(t.clientX, t.clientY)
        lookPrev = { x: t.clientX, y: t.clientY }
        active = true
        continue
      }

      if (Math.hypot(dx0, dy0) >= MOVE_ACTIVATE_PX) {
        const isLeftHalf = t.clientX - rect.left < rect.width * 0.5
        if (isLeftHalf && leftId === null) {
          leftId = id
          joyCenter = { x: sp.x, y: sp.y }
          joyVec = { x: 0, y: 0 }
          movePad.show(joyCenter.x, joyCenter.y)
          moveThumbClamped(joyCenter.x, joyCenter.y)
          applyJoystickToKeys()
          active = true
        } else if (!isLeftHalf && rightId === null) {
          rightId = id
          lookPrev = { x: t.clientX, y: t.clientY }
          lookPad.show(t.clientX, t.clientY)
          active = true
        }
      }
    }

    if (active) {
      e.preventDefault()
      clearSelectionSoon()
    }
  }

  const onTouchEnd = (e) => {
    if (isAutoMoving.value || paymentDialogChek.value) return
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i]
      const id = t.identifier
      const sp = startPos[id],
        lp = lastPos[id]
      const dt = performance.now() - (startTime[id] || 0)
      const move = sp && lp ? Math.hypot(lp.x - sp.x, lp.y - sp.y) : 1e9

      if (id === leftId) {
        leftId = null
        joyVec = { x: 0, y: 0 }
        applyJoystickToKeys()
        movePad.hide()
        e.preventDefault()
      } else if (id === rightId) {
        rightId = null
        lookPad.hide()
        e.preventDefault()
      } else if (sp && dt <= TAP_MAX_TIME_MS && move <= TAP_MAX_MOVE_PX) {
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

  // --- public API
  const attach = () => {
    el.addEventListener('touchstart', onTouchStart, touchOpts)
    el.addEventListener('touchmove', onTouchMove, touchOpts)
    el.addEventListener('touchend', onTouchEnd, touchOpts)
    el.addEventListener('touchcancel', onTouchCancel, touchOpts)
  }
  const detach = () => {
    el.removeEventListener('touchstart', onTouchStart, touchOpts)
    el.removeEventListener('touchmove', onTouchMove, touchOpts)
    el.removeEventListener('touchend', onTouchEnd, touchOpts)
    el.removeEventListener('touchcancel', onTouchCancel, touchOpts)
    movePad.destroy()
    lookPad.destroy()
  }

  return { attach, detach }
}
