<template>
  <div ref="container" class="webgl-container"></div>
</template>

<script>
import { onMounted, onUnmounted, ref, toRaw, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Vector3 } from 'three'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { useSceneSetup } from 'src/composables/graphics3d/useSceneSetup'
import { usePlayerControls } from 'src/composables/graphics3d/usePlayerControls'
import { loadModelGallery } from 'src/composables/graphics3d/loadModelGallery'
import { useRaycastInteraction } from 'src/composables/graphics3d/automaticMovement/useRaycastInteraction'
import { setAnimationLoop } from 'src/composables/graphics3d/setAnimationLoop'
import { removeVideoFromScene } from 'src/composables/graphics3d/removeVideoFromScene'
import { removeElement } from 'src/composables/graphics3d/removeElement'
import { createPainting } from 'src/composables/graphics3d/createPainting'
import { loadModel } from 'src/composables/graphics3d/loadModel'
import { modelPositioning } from 'src/composables/graphics3d/modelPositioning'
import { useVideo } from 'src/composables/graphics3d/useVideo'

export default {
  name: 'Gallery3D',

  setup() {
    const graphics3DStore = useGraphics3DStore()
    const { selectedGallery, models3d } = storeToRefs(graphics3DStore)
    const { clearSelectedGallery } = graphics3DStore
    const container = ref(null)
    const unmountedArray = ref([])
    const modelGalleryReady = ref(false)
    const collidableMeshes = []
    let scene, renderer

    onMounted(async () => {
      const { camera, sceneSetupUnmounted, ...rest } = useSceneSetup(container)
      scene = rest.scene
      renderer = rest.renderer
      unmountedArray.value.push(sceneSetupUnmounted)

      const { controlsObject, controlsObjectHeight, keysPressed, playerControlsUnmounted } =
        usePlayerControls(camera, renderer)
      scene.add(controlsObject)
      unmountedArray.value.push(playerControlsUnmounted)
      modelGalleryReady.value = await loadModelGallery(
        '/3Dmodels/gallery.glb',
        scene,
        collidableMeshes
      )
      const { updateMoveToPainting, raycastInteractionUnmounted } = useRaycastInteraction({
        camera,
        renderer,
        controlsObject,
        collidableMeshes
      })
      unmountedArray.value.push(raycastInteractionUnmounted)

      setAnimationLoop({
        scene,
        camera,
        renderer,
        controlsObject,
        controlsObjectHeight,
        collidableMeshes,
        keysPressed,
        updateMoveToPainting
      })
    })
    watch(
      () => selectedGallery.value.galleryId,
      async (newVal, oldVal) => {
        console.log(newVal, oldVal)
        if (oldVal) {
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

          modelGalleryReady.value = false
        }
        if (newVal) {
          console.log(selectedGallery.value)
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
            for (const item of Object.values(selectedGallery.value.store).filter(
              (elem) => elem.position
            )) {
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
        }
      },
      { immediate: true, deep: true }
    )
    watch(
      [() => selectedGallery.value.videoStore, () => modelGalleryReady.value],
      async ([newVideoStore, isModelReady], [oldVideoStore]) => {
        if (!isModelReady || !newVideoStore) return
        if (oldVideoStore) {
          Object.keys(oldVideoStore).forEach((key) => {
            removeVideoFromScene(scene, key)
          })
        }
        for (const key of Object.keys(newVideoStore)) {
          await useVideo(scene, newVideoStore[key])
        }
      },
      { deep: true }
    )

    onUnmounted(() => {
      if (selectedGallery.value.videoStore) {
        Object.keys(selectedGallery.value.videoStore).forEach((key) => {
          removeVideoFromScene(scene, key)
        })
      }
      Object.values(models3d.value).forEach((value) => {
        if (value.mixer) toRaw(value.mixer).stopAllAction()
      })
      unmountedArray.value.forEach((func) => func())
      clearSelectedGallery()
    })
    return {
      container
    }
  }
}
</script>

<style scoped>
.webgl-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
canvas {
  display: block;
}
</style>
