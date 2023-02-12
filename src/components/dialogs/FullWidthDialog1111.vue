<template>
  <div>
    <slot name="button" @useActivator="useActivator">
      <q-btn label="Full Width" @click="useActivator" v-bind="$attrs" />
    </slot>
    <q-dialog v-model="activator" full-width>
      <q-card>
        <q-toolbar class="q-pl-xl q-pt-md">
          <q-toolbar-title class="text-h5">
            {{ title }}
          </q-toolbar-title>
          <q-btn flat round icon="close" v-close-popup />
        </q-toolbar>
        <div class="row">
          <div class="col-12 col-sm-8">
            <q-card-section>
              <q-carousel
                v-model="slide"
                swipeable
                animated
                infinite
                arrows
                height="100%"
                class="bg-grey-1"
                control-color="primary"
                v-model:fullscreen="fullscreen"
              >
                <q-carousel-slide v-for="(url, index) in urlImages" :key="url" :name="index">
                  <div class="row justify-center">
                    <img
                      :src="url"
                      style="max-width: 100%; object-fit: contain"
                      :style="{ height: carouselSlideHeight + 'vh' }"
                      alt="alt"
                    />
                  </div>
                </q-carousel-slide>
                <template v-slot:control>
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
            </q-card-section>
          </div>
          <div class="col-12 col-sm-4 q-pt-sm-md">
            <q-card-section class="q-pt-none">
              <div class="text-h6" v-text="work.artistName" />
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div class="text-h6" v-text="work.name" />
            </q-card-section>
            <q-card-section>
              <p
                style="white-space: pre-line"
                class="text-justify text-subtitle2"
                v-text="work.description"
              />
            </q-card-section>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { computed, ref, toRefs } from 'vue'
import { Screen } from 'quasar'

export default {
  name: 'FullWidthDialog1111',
  props: {
    title: {
      type: String,
      require: true
    },
    dialogData: {
      type: Object,
      require: true
    }
  },
  setup(props) {
    const activator = ref(false)
    const slide = ref(0)
    const fullscreen = ref(false)
    const useActivator = () => (activator.value = true)
    const { dialogData } = toRefs(props)
    const urlImages = computed(() => dialogData.value.map((item) => item.urlWork))
    const work = computed(() => dialogData.value[slide.value])
    const carouselSlideHeight = computed(() => {
      return fullscreen.value ? 97 : Screen.xs ? 40 : 60
    })
    return {
      slide,
      fullscreen,
      activator,
      useActivator,
      urlImages,
      work,
      carouselSlideHeight
    }
  }
}
</script>

<style scoped></style>
