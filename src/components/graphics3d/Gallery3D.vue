<template>
  <div ref="container" class="webgl-container"></div>
</template>

<script>
import { onMounted, onUnmounted, ref, toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { useSceneSetup } from 'src/composables/3D/useSceneSetup'
import { usePlayerControls } from 'src/composables/3D/usePlayerControls'
import { useCollidableMeshes } from 'src/composables/3D/useCollidableMeshes'
import { useRaycastInteraction } from 'src/composables/3D/useRaycastInteraction'
import { setAnimationLoop } from 'src/composables/3D/setAnimationLoop'
import { removeElement } from 'src/composables/3D/removeElement'
import { watchSelectedGallery } from 'src/composables/3D/watchSelectedGallery'

export default {
  name: 'Gallery3D',
  props: {
    newElement: {
      type: Object,
      required: true
    }
  },
  emits: ['clearNewElement'],
  setup(props, { emit }) {
    const container = ref(null)
    const unmountedArray = ref([])
    let scene, renderer

    onMounted(async () => {

      const { camera, sceneSetupUnmounted, ...rest } = useSceneSetup(container)
      scene = rest.scene
      renderer = rest.renderer
      unmountedArray.value.push(sceneSetupUnmounted)

      const { controlsObject, controlsObjectHeight, keysPressed, playerControlsUnmounted } =
        usePlayerControls(camera, renderer, newElement)
      scene.add(controlsObject)
      unmountedArray.value.push(playerControlsUnmounted)

      const { loadModelGallery, createBox } = useCollidableMeshes(scene, collidableMeshes)
      await loadModelGallery('3Dmodels/gallery.glb')
      boxes.value.forEach((params) => createBox(params))

      const { raycastInteractionUnmounted } = useRaycastInteraction({
        camera,
        scene,
        renderer,
        collidableMeshes,
        newElement,
        emit
      })
      unmountedArray.value.push(raycastInteractionUnmounted)

      setAnimationLoop({
        scene,
        camera,
        renderer,
        controlsObject,
        controlsObjectHeight,
        collidableMeshes,
        keysPressed
      })
      watchSelectedGallery(scene, renderer, collidableMeshes)
    })
    onUnmounted(() => {
      unmountedArray.value.forEach((func) => func())
      window.removeEventListener('keydown', handleDelete)
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
