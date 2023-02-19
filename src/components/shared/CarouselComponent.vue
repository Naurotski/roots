<template>
  <q-carousel
    v-model="slide"
    swipeable
    animated
    infinite
    :arrows="urlImages.length > 1"
    transition-prev="slide-right"
    transition-next="slide-left"
    control-type="push"
    navigation-icon="radio_button_unchecked"
    :height="$q.screen.xs ? '300px' : '500px'"
    class="bg-grey-1"
    control-color="grey"
    v-model:fullscreen="fullscreen"
  >
    <q-carousel-slide v-for="(url, index) in urlImages" :key="url" :name="index">
      <div class="row justify-center">
        <q-video v-if="checkVideo" class="absolute-full" :src="url" />
        <q-img v-else :src="url" fit="contain" alt="alt" class="absolute-full" />
      </div>
    </q-carousel-slide>
    <template v-slot:control v-if="!checkVideo">
      <q-carousel-control position="bottom-right" :offset="[8, 8]">
        <q-btn
          size="xl"
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
    const checkVideo = computed(() => urlImages.value[slide.value].includes('video'))
    watch(slide, (value) => emit('update:slide', value), { immediate: true })
    return {
      slide,
      fullscreen,
      checkVideo
    }
  }
}
</script>

<style scoped></style>
