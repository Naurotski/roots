<template>
  <div
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
      ref="img"
      v-if="portraitData.imageSrc"
      :src="portraitData.imageSrc"
      alt="alt"
      :style="imageStyle"
      class="background-image"
    />
    <div class="overlay"></div>
  </div>
</template>

<script>
import { ref, computed, toRefs, watch, watchEffect } from 'vue'
export default {
  name: 'ImageSelector',
  props: {
    portraitData: {
      type: Object,
      require: true
    }
  },
  emits: ['updateTranslate'],
  setup(props, { emit }) {
    const { portraitData } = toRefs(props)
    const aspectRatio = ref(null)
    const isDragging = ref(false)
    const img = ref(null)
    const lastX = ref(0)
    const lastY = ref(0)
    const translateX = ref(0)
    const translateY = ref(0)

    const imageStyle = computed(() => {
      return {
        transform: `translate(${translateX.value}px, ${translateY.value}px)`,
        transition: isDragging.value ? 'none' : 'transform 0,2s',
        width: '100%',
        height: '100%',
        'object-fit': 'contain'
      }
    })
    watch(
      () => portraitData.value.imageSrc,
      () => {
        translateX.value = 0
        translateY.value = 0
      },
      { immediate: true }
    )
    watchEffect(() => {
      if (img.value) {
        const coefficientX = Math.floor((portraitData.value.width / img.value.width) * 100) / 100
        const coefficientY = Math.floor((portraitData.value.width / img.value.width) * 100) / 100
        let difference
        if (img.value.width / img.value.height > 1) {
          difference = img.value.width / 2 - img.value.height / 2
        } else {
          difference = img.value.height / 2 - img.value.width / 2
        }
        if (difference < Math.abs(translateX.value)) {
          if (translateX.value < 0) {
            translateX.value = -difference
          } else {
            translateX.value = difference
          }
        }
        if (difference < Math.abs(translateY.value)) {
          if (translateY.value < 0) {
            translateY.value = -difference
          } else {
            translateY.value = difference
          }
        }
        emit('updateTranslate', {
          translateX: translateX.value * coefficientX,
          translateY: translateY.value * coefficientY
        })
      }
    })
    const startDrag = (event) => {
      isDragging.value = true
      lastX.value = event.clientX || event.touches[0].clientX
      lastY.value = event.clientY || event.touches[0].clientY
      event.preventDefault()
    }
    const stopDrag = () => {
      isDragging.value = false
    }
    const drag = (event) => {
      if (!isDragging.value) return
      const currentX = event.clientX || event.touches[0].clientX
      const currentY = event.clientY || event.touches[0].clientY
      if (
        img.value.width / img.value.height > 1 &&
        (img.value.width / 2 - img.value.height / 2 > Math.abs(translateX.value) ||
          translateX.value * (currentX - lastX.value) < 0)
      ) {
        translateX.value += currentX - lastX.value
        lastX.value = currentX
      } else if (
        img.value.width / img.value.height < 1 &&
        (img.value.height / 2 - img.value.width / 2 > Math.abs(translateY.value) ||
          translateY.value * (currentY - lastY.value) < 0)
      ) {
        translateY.value += currentY - lastY.value
        lastY.value = currentY
      }
    }
    return {
      translateX,
      translateY,
      imageStyle,
      img,
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
  cursor: grabbing
.overlay
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: rgba(236, 239, 241, 0.8)
  mask-image: radial-gradient(circle closest-side, transparent 99%, black 1%)
  mask-size: 100%
  mask-position: center
</style>
