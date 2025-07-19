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
    () => selectedGallery.value,
    async (newVal, oldVal) => {
      if (oldVal?.galleryId) {
        collidableMeshes
          .filter((item) => item.userData.isPainting)
          .forEach((painting) => {
            removeElement(scene, collidableMeshes, painting)
          })
        scene.children
          .filter((item) => item.userData.isPlaceableObject)
          .forEach((elem) => {
            removeElement(scene, collidableMeshes, elem)
          })
        if (oldVal.videoStore) {
          Object.keys(oldVal.videoStore).forEach((key) => {
            removeVideoFromScene(scene, key)
          })
        }
      }
      if (newVal?.galleryId) {
        if (newVal.storeroom) {
          Object.values(newVal.storeroom)
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
        if (newVal.store) {
          for (const item of Object.values(newVal.store).filter((elem) => elem.position)) {
            const modelData = await loadModel({ url: item.url, targetHeight: item.targetHeight })
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
          }
        }
        if (newVal.videoStore) {
          for (const key of Object.keys(newVal.videoStore)) {
            await useVideo(scene, newVal.videoStore[key])
          }
        }
      }
    },
    { immediate: true }
  )
}
