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
import { createSticker } from 'src/composables/graphics3d/createSticker'
import { loadModel } from 'src/composables/graphics3d/loadModel'
import { modelPositioning } from 'src/composables/graphics3d/modelPositioning'
import { useVideo } from 'src/composables/graphics3d/useVideo'
import { useAudio } from 'src/composables/graphics3d/useAudio'

export default {
  name: 'Gallery3D',

  setup() {
    const graphics3DStore = useGraphics3DStore()
    const { selectedGallery, models3d } = storeToRefs(graphics3DStore)
    const { startLoading, endLoading, clearSelectedGallery } = graphics3DStore
    const container = ref(null)
    const unmountedArray = ref([])
    const modelGalleryReady = ref(false)
    const collidableMeshes = []
    let scene, renderer, camera, cleanupAudio, cleanupVideo

    const pLimit = (n) => {
      const q = []
      let a = 0
      return (fn) =>
        new Promise((res, rej) => {
          const run = () => {
            a++
            fn()
              .then(res, rej)
              .finally(() => {
                a--
                q.shift()?.()
              })
          }
          a < n ? run() : q.push(run)
        })
    }
    const limit = pLimit(4)
    onMounted(async () => {
      try {
        const { sceneSetupUnmounted, ...rest } = useSceneSetup(container)
        scene = rest.scene
        renderer = rest.renderer
        camera = rest.camera
        unmountedArray.value.push(sceneSetupUnmounted)

        const { controlsObject, controlsObjectHeight, keysPressed, playerControlsUnmounted } =
          usePlayerControls(camera, renderer)
        scene.add(controlsObject)
        unmountedArray.value.push(playerControlsUnmounted)

        startLoading('Loading Model…')
        modelGalleryReady.value = await loadModelGallery(
          '/3Dmodels/gallery.glb',
          scene,
          collidableMeshes
        )
        endLoading()
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
      } finally {
        endLoading()
      }
    })

    watch(
      () => selectedGallery.value.galleryId,
      async (newVal, oldVal) => {
        if (newVal === oldVal) return
        try {
          startLoading()
          if (oldVal) {
            startLoading()
            scene.children
              .filter(
                (i) =>
                  i.userData.isPlaceableObject ||
                  i.userData.isPainting ||
                  i.userData.isSticker ||
                  i.userData.isFurnitureObject
              )
              .forEach((elem) => removeElement(scene, collidableMeshes, elem))
            removeVideoFromScene(scene, 'Smart_TV_1')
            cleanupAudio?.()
            cleanupVideo?.()
            await clearSelectedGallery()
            endLoading()
          }
          if (!newVal) return
          if (selectedGallery.value.storeroom) {
            startLoading('Loading Paintings...')
            const items = Object.values(selectedGallery.value.storeroom).filter((e) => e.position)
            await Promise.allSettled(
              items.map((item) =>
                limit(() =>
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
                    paintingId: item.id
                  })
                )
              )
            )
            endLoading()
          }
          if (selectedGallery.value.storeStickers) {
            startLoading('Loading Stickers...')
            const items = Object.values(selectedGallery.value.storeStickers).filter(
              (e) => e.position
            )
            await Promise.allSettled(
              items.map((item) =>
                limit(() =>
                  createSticker({
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
                    stickerId: item.id,
                    rotation: item.position.rotation
                  })
                )
              )
            )
            endLoading()
          }
          if (selectedGallery.value.store) {
            startLoading('Loading Objects...')
            const items = Object.values(selectedGallery.value.store).filter((e) => e.position)
            await Promise.allSettled(
              items.map((item) =>
                limit(async () => {
                  const modelData = await loadModel({
                    url: item.url,
                    targetHeight: item.targetHeight
                  })
                  modelPositioning({
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
                    objectId: item.id,
                    collidableMeshes,
                    rotation: item.position.rotation
                  })
                })
              )
            )
            endLoading()
          }
        } finally {
          endLoading()
        }
      },
      { immediate: true, flush: 'post' }
    )
    watch(
      [() => selectedGallery.value.videoStore, () => modelGalleryReady.value],
      async ([newVideoStore, isModelReady], [oldVideoStore]) => {
        if (
          oldVideoStore &&
          JSON.stringify(toRaw(newVideoStore)) !== JSON.stringify(toRaw(oldVideoStore))
        ) {
          Object.keys(oldVideoStore).forEach((key) => {
            removeVideoFromScene(scene, key)
            cleanupVideo?.()
          })
        }
        if (isModelReady && newVideoStore) {
          startLoading('Loading Video...')
          for (const key of Object.keys(newVideoStore)) {
            cleanupVideo = await useVideo(scene, newVideoStore[key])
          }
          endLoading()
        }
      },
      { deep: true }
    )
    watch(
      () => selectedGallery.value.audioStore,
      async (newVal, oldVal) => {
        if (!newVal && !oldVal) return
        if (oldVal) cleanupAudio?.()
        if (newVal) {
          startLoading('Loading Audio...')
          cleanupAudio = await useAudio(camera, newVal['backgroundMusic'])
          endLoading()
        }
      }
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
      cleanupAudio?.()
      cleanupVideo?.()
      unmountedArray.value.forEach((func) => func())
      clearSelectedGallery()
      scene = null
      camera = null
      renderer = null
      cleanupAudio = null
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
