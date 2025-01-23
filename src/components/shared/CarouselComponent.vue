<template>
  <div class="row">
    <q-scroll-area
      v-if="$q.screen.gt.md && urlImages.length > 1"
      visible
      class="col-2"
      style="height: 500px"
      :horizontal-offset="[0, 15]"
      :thumb-style="{ borderRadius: '5px', background: 'red', width: '10px', opacity: 0.5 }"
    >
      <div class="column flex-center q-gutter-y-sm">
        <div
          v-for="(url, index) in urlImages"
          :key="url"
          class="cursor-pointer"
          @click="slide = index"
        >
          <q-icon
            v-if="url.includes('video')"
            :style="index === slide ? 'border: 2px solid red' : 'border: none'"
            name="fa-solid fa-film"
            size="xl"
          />
          <img
            v-else
            :src="url"
            height="50px"
            :style="index === slide ? 'border: 2px solid red' : 'border: none'"
            alt="photo"
          />
        </div>
      </div>
    </q-scroll-area>
    <div :class="$q.screen.gt.md && urlImages.length > 1 ? 'col-10' : 'col-12'">
      <q-carousel
        v-model="slide"
        swipeable
        animated
        infinite
        :arrows="$q.screen.lt.lg ? false : urlImages.length > 1"
        transition-prev="slide-right"
        transition-next="slide-left"
        control-type="unelevated"
        :height="$q.screen.xs ? '300px' : '500px'"
        control-text-color="black"
        control-color="white"
        v-model:fullscreen="fullscreen"
      >
        <q-carousel-slide v-for="(url, index) in urlImages" :key="url" :name="index">
          <div class="row justify-center q-pb-md">
            <q-video v-if="checkVideo" class="absolute-full" :src="url" />
            <q-img v-else :src="url" fit="contain" alt="artwork" class="absolute-full" />
          </div>
        </q-carousel-slide>
        <template v-slot:control v-if="!checkVideo">
          <q-carousel-control position="bottom-right" :offset="[12, 12]">
            <q-btn
              unelevated
              round
              dense
              color="white"
              text-color="primary"
              :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="fullscreen = !fullscreen"
            />
          </q-carousel-control>
        </template>
      </q-carousel>
    </div>
  </div>
  <div v-if="$q.screen.lt.lg && urlImages.length > 1" class="text-center">
    <q-radio
      v-model="slide"
      checked-icon="fiber_manual_record"
      unchecked-icon="panorama_fish_eye"
      v-for="(item, index) in urlImages"
      :key="item"
      :val="index"
      size="xs"
    />
  </div>
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
