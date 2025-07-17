import { useGraphics3DStore } from 'stores/graphics3D-store'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { Vector3 } from 'three'
import { removeElement } from 'src/composables/graphics3d/removeElement'
import { removeVideoFromScene } from 'src/composables/graphics3d/removeVideoFromScene'
import { createPainting } from 'src/composables/graphics3d/createPainting'
import { loadModel } from 'src/composables/graphics3d/loadModel'
import { modelPositioning } from 'src/composables/graphics3d/modelPositioning'
import { useVideo } from 'src/composables/graphics3d/useVideo'
const graphics3DStore = useGraphics3DStore()
const { selectedGallery } = storeToRefs(graphics3DStore)
export const watchSelectedGallery = (scene, renderer, collidableMeshes) => {
  watch(
    () => selectedGallery.value.galleryId,
    (newVal, oldVal) => {
      if (oldVal) {
        collidableMeshes
          .filter((item) => item.userData.isPainting)
          .forEach(async (painting) => {
            await removeElement(scene, collidableMeshes, painting)
          })
        scene.children
          .filter((item) => item.userData.isPlaceableObject)
          .forEach(async (elem) => {
            await removeElement(scene, collidableMeshes, elem)
          })
        removeVideoFromScene(scene, 'Smart_TV_1')
      }
      if (newVal) {
        if (selectedGallery.value.storeroom) {
          Object.values(selectedGallery.value.storeroom)
            .filter((elem) => elem.position)
            .forEach((item) =>
              createPainting({
                renderer,
                point: new Vector3(
                  item.position.point.x,
                  item.position.point.y,
                  item.position.point.z
                ),
                normal: new Vector3(
                  item.position.normal.x,
                  item.position.normal.y,
                  item.position.normal.z
                ),
                scene,
                collidableMeshes,
                url: item.url,
                width: item.width,
                height: item.height,
                paintingId: item.paintingId
              })
            )
        }
        if (selectedGallery.value.store) {
          Object.values(selectedGallery.value.store)
            .filter((elem) => elem.position)
            .forEach(async (item) => {
              let modelData = await loadModel({ url: item.url, targetHeight: item.targetHeight })
              await modelPositioning({
                scene,
                modelData,
                point: new Vector3(
                  item.position.point.x,
                  item.position.point.y,
                  item.position.point.z
                ),
                normal: new Vector3(
                  item.position.normal.x,
                  item.position.normal.y,
                  item.position.normal.z
                ),
                objectId: item.objectId,
                collidableMeshes,
                rotation: item.position.rotation
              })
            })
        }
      }
    },
    { immediate: true }
  )
  watch(
    () => selectedGallery.value.videoStore,
    (newVal, oldVal) => {
      console.log('watch -------', newVal, oldVal)
      const newKeys = newVal ? Object.keys(newVal) : []
      const oldKeys = oldVal ? Object.keys(oldVal) : []
      newKeys.forEach(async (key) => {
        await useVideo(scene, newVal[key])
      })
      const removedKeys = oldKeys.filter((key) => !newKeys.includes(key))
      removedKeys.forEach((key) => {
        removeVideoFromScene(scene, key)
      })
    },
    { immediate: true }
  )
}
