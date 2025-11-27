import { toRaw } from 'vue'
import { storeToRefs } from 'pinia'
import { Clock, Vector3 } from 'three'
import { handleStepUpCheck } from 'src/composables/graphics3d/handleStepUpCheck'
import { useGraphics3DStore } from 'stores/graphics3D-store'
const graphics3DStore = useGraphics3DStore()
const { models3d } = storeToRefs(graphics3DStore)
const moveVector = new Vector3()

export const setAnimationLoop = ({
  scene,
  camera,
  renderer,
  controlsObject,
  controlsObjectHeight,
  collidableMeshes,
  keysPressed,
  updateMoveToPainting
}) => {
  const clock = new Clock()
  renderer.setAnimationLoop(() => {
    const delta = clock.getDelta()
    // Обновляем все миксеры
    Object.values(models3d.value)
      .filter((elem) => elem.mixer)
      .forEach((model) => toRaw(model.mixer).update(delta))

    // Управление клавишами
    moveVector.set(0, 0, 0)
    if (keysPressed['KeyW'] || keysPressed['ArrowUp']) moveVector.z -= 1
    if (keysPressed['KeyS'] || keysPressed['ArrowDown']) moveVector.z += 1
    if (keysPressed['KeyA'] || keysPressed['ArrowLeft']) moveVector.x -= 1
    if (keysPressed['KeyD'] || keysPressed['ArrowRight']) moveVector.x += 1

    // === Проверка препятствия перед игроком ===
    handleStepUpCheck(delta, moveVector, controlsObject, controlsObjectHeight, collidableMeshes)

    //Перемещение к картине
    updateMoveToPainting(delta)

    renderer.render(scene, camera)
  })
}
