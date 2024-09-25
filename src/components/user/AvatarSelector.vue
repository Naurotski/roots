<template>
  <div
    :style="{
      width: $q.screen.xs ? '100%' : '400px',
      height: $q.screen.xs ? '90%' : '400px'
    }"
    class="container relative-position"
    @mousedown="startDrag"
    @mouseup="stopDrag"
    @mousemove="drag"
    @mouseleave="stopDrag"
    @touchstart="startDrag"
    @touchend="stopDrag"
    @touchmove="drag"
  >
    <img
      v-if="portraitData.imageSrc"
      :src="portraitData.imageSrc"
      alt="alt"
      :style="imageStyle"
      class="background-image"
    />
    <div class="overlay"></div>

    <!--    <pre>translateX - {{ translateX }}</pre>-->
    <!--    <pre>translateY - {{ translateY }}</pre>-->
    <!--    <div class="clipped-container q-mt-xl">-->
    <!--      <img-->
    <!--        v-if="portraitData.imageSrc"-->
    <!--        :src="portraitData.imageSrc"-->
    <!--        class="clipped-image"-->
    <!--        :style="clippedImageStyle"-->
    <!--        alt="alt"-->
    <!--      />-->
    <!--    </div>-->
  </div>
</template>

<script>
import { ref, computed, toRefs } from 'vue'
export default {
  name: 'ImageSelector',
  props: {
    portraitData: {
      type: Object,
      default: () => ({
        imageSrc: ''
      })
    }
  },
  setup(props) {
    const { portraitData } = toRefs(props)
    const aspectRatio = ref(null)
    const isDragging = ref(false)
    const lastX = ref(0)
    const lastY = ref(0)
    const translateX = ref(0)
    const translateY = ref(0)

    const imageStyle = computed(() => ({
      transform: `translate(${translateX.value}px, ${translateY.value}px)`,
      transition: isDragging.value ? 'none' : 'transform 0.1s',
      width: portraitData.value.aspectRatio < 1 ? '100%' : 'auto',
      height: portraitData.value.aspectRatio >= 1 ? '100%' : 'auto'
    }))
    // const clippedImageStyle = computed(() => ({
    //   transform: `translate(${translateX.value}px, ${translateY.value}px)`
    // }))
    const startDrag = (event) => {
      console.log('startDrag ---', event)
      isDragging.value = true
      lastX.value = event.clientX || event.touches[0].clientX
      lastY.value = event.clientY || event.touches[0].clientY
      event.preventDefault()
    }
    const stopDrag = () => {
      isDragging.value = false
    }

    const drag = (event) => {
      // console.log('drag ---', event)
      if (!isDragging.value) return
      const currentX = event.clientX || event.touches[0].clientX
      const currentY = event.clientY || event.touches[0].clientY
      translateX.value += currentX - lastX.value
      translateY.value += currentY - lastY.value
      lastX.value = currentX
      lastY.value = currentY
    }
    return {
      translateX,
      translateY,
      imageStyle,
      aspectRatio,
      startDrag,
      stopDrag,
      drag
    }
  }
}
</script>
<style scoped lang="sass">
.container
  display: flex
  justify-content: center
  align-items: center
  cursor: grab

.container:active
  cursor: grabbing /* Курсор во время перетаскивания */

.background-image
  //object-fit: contain /* Чтобы изображение не искажалось */
  //width: 100%
  //height: 100%
//  align-items: center !important
.overlay
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: rgba(236, 239, 241, 0.8) /* Полупрозрачный фон */
  mask-image: radial-gradient(circle closest-side, transparent 95%, black 5%)
  mask-size: 100%
  mask-position: center

.clipped-container
  position: relative
  width: 300px /* Задайте размеры блока */
  height: 300px /* Задайте размеры блока */
  overflow: hidden
  border: 1px solid gray
  clip-path: circle(40% at center) /* Круглая область */


.clipped-image
  width: 100%
  height: 100%
  object-fit: cover /* Чтобы изображение не искажалось */
</style>
