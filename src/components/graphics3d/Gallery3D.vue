<template>
  <div ref="container" class="webgl-container"></div>
</template>

<script>
import { onMounted, onUnmounted, ref, toRaw } from 'vue'
import { storeToRefs } from 'pinia'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { useSceneSetup } from 'src/composables/graphics3d/useSceneSetup'
import { usePlayerControls } from 'src/composables/graphics3d/usePlayerControls'
import { useCollidableMeshes } from 'src/composables/graphics3d/useCollidableMeshes'
import { useRaycastInteraction } from 'src/composables/graphics3d/useRaycastInteraction'
import { setAnimationLoop } from 'src/composables/graphics3d/setAnimationLoop'
import { watchSelectedGallery } from 'src/composables/graphics3d/watchSelectedGallery'
import { removeVideoFromScene } from 'src/composables/graphics3d/removeVideoFromScene'

export default {
  name: 'Gallery3D',

  setup() {
    const graphics3DStore = useGraphics3DStore()
    const { selectedGallery, models3d } = storeToRefs(graphics3DStore)
    const { clearSelectedGallery } = graphics3DStore
    const container = ref(null)
    const unmountedArray = ref([])
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

      const { loadModelGallery } = useCollidableMeshes(scene, collidableMeshes)
      await loadModelGallery('/3Dmodels/gallery.glb')
      const { updateMoveToPainting, raycastInteractionUnmounted } = useRaycastInteraction({
        camera,
        scene,
        renderer,
        controlsObject
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

      watchSelectedGallery(scene, renderer, collidableMeshes)
    })
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
