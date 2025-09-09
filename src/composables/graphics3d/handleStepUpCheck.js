import { Euler, MathUtils, Raycaster, Vector3 } from 'three'
import { storeToRefs } from 'pinia'
import { useGraphics3DStore } from 'stores/graphics3D-store'
const graphics3DStore = useGraphics3DStore()
const { selectedElementId } = storeToRefs(graphics3DStore)// для проверки где пол
const wallRaycaster = new Raycaster() // для проверки препятствий снизу
const downRay = new Raycaster()
const velocity = new Vector3()
const moveSpeed = 1
const maxStepHeight = 0.3
const stepUpSpeed = 5 // скорость подъема
let stepLerpAlpha = 0
const minDistance = 0.3 // насколько близко можно подойти
let floorLevel = 0

export const handleStepUpCheck = (
  delta,
  moveVector,
  controlsObject,
  controlsObjectHeight,
  collidableMeshes
) => {
  if (moveVector.lengthSq() === 0) return
  moveVector.normalize()
  moveVector.applyEuler(new Euler(0, controlsObject.rotation.y, 0, 'YXZ'))
  velocity.copy(moveVector).multiplyScalar(moveSpeed * delta)
  const direction = velocity.clone().normalize()

  // === Проверка препятствия перед игроком ===
  // Определение уровня пола
  const rayOrigin = controlsObject.position.clone()
  rayOrigin.addScaledVector(direction, 0.1) // чуть впереди
  downRay.set(rayOrigin, new Vector3(0, -1, 0))
  const groundHits = downRay.intersectObjects(collidableMeshes, false) //Ищем все пересечения луча с объектами в collidableMeshes
  floorLevel = groundHits[0]?.point.y

  //определение уровня ног
  const floorY = controlsObject.position.y - controlsObjectHeight // предполагаем рост 1.6м

  // Точка чуть выше (для проверки возможности "перешагнуть")
  const rayOriginHigh = new Vector3(
    controlsObject.position.x,
    floorY + maxStepHeight,
    controlsObject.position.z
  )
  wallRaycaster.set(rayOriginHigh, direction)

  const highHits = wallRaycaster.intersectObjects(collidableMeshes, false)
  const canStepUp = highHits.length === 0 || highHits[0].distance > minDistance

  let deltaHeight = floorLevel - floorY
  if (canStepUp && (floorLevel - floorY <= maxStepHeight || selectedElementId.value?.id)) {
    if (Math.abs(deltaHeight) > 0.01) {
      stepLerpAlpha = Math.min(1, stepLerpAlpha + delta * stepUpSpeed)
      controlsObject.position.y = MathUtils.lerp(
        controlsObject.position.y,
        floorLevel + controlsObjectHeight,
        stepLerpAlpha
      )
      controlsObject.position.add(velocity) // двигаемся параллельно
    } else {
      stepLerpAlpha = 0 // сброс если уже дошли
      controlsObject.position.add(velocity)
    }
  }
}
