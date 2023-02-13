<template>
  <q-carousel
    v-model="slide"
    swipeable
    animated
    infinite
    arrows
    transition-prev="slide-right"
    transition-next="slide-left"
    :navigation="!checkVideo"
    control-type="push"
    navigation-icon="radio_button_unchecked"
    height="100%"
    class="bg-grey-1"
    control-color="grey"
    v-model:fullscreen="fullscreen"
  >
    <q-carousel-slide v-for="(url, index) in urlImages" :key="url" :name="index">
      <div class="row justify-center" :class="{}">
        <q-video
          v-if="checkVideo"
          :style="{ height: carouselSlideHeight + 'vh' }"
          style="width: 100%"
          :src="url"
        />
        <q-img
          v-else
          :src="url"
          fit="contain"
          style="max-width: 100%"
          :style="{ height: carouselSlideHeight + 'vh' }"
          alt="alt"
        />
      </div>
    </q-carousel-slide>
    <template v-slot:control v-if="!checkVideo">
      <q-carousel-control position="bottom-right" :offset="[8, 8]">
        <q-btn
          flat
          round
          dense
          text-color="primary"
          :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="fullscreen = !fullscreen"
        />
      </q-carousel-control>
    </template>
  </q-carousel>
</template>

<script>
import { computed, ref, toRefs, watch } from 'vue'
import { Screen } from 'quasar'

export default {
  name: 'CarouselComponent',
  props: {
    urlImages: {
      type: Array,
      require: true
    }
  },
  emits: ['update:slide'],
  setup(props, { emit }) {
    const { urlImages } = toRefs(props)
    const slide = ref(0)
    const fullscreen = ref(false)
    const carouselSlideHeight = computed(() => {
      return fullscreen.value ? 95 : Screen.xs ? 40 : 60
    })
    const checkVideo = computed(() => urlImages.value[slide.value].includes('video'))
    watch(slide, (value) => emit('update:slide', value), { immediate: true })
    return {
      slide,
      fullscreen,
      carouselSlideHeight,
      checkVideo
    }
  }
}
</script>

<style scoped></style>
