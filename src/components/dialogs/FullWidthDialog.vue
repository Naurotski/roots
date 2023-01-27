<template>
  <div>
    <slot name="button" @useActivator="useActivator">
      <q-btn label="Full Width" color="primary" @click="useActivator" />
    </slot>
    <q-dialog v-model="activator" full-width>
      <q-card>
        <secondary-title class="q-pt-md" :title="artistName"
          ><q-btn flat round icon="close" v-close-popup
        /></secondary-title>
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
                <q-carousel-slide
                  v-for="(url, index) in allUrlImagesWork"
                  :key="url"
                  :name="index"
                  class="flex flex-center"
                >
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
              <div class="text-h6" v-text="work.name" />
            </q-card-section>
            <q-card-section>
              <p class="text-subtitle2" v-text="work.materials" />
              <p class="text-subtitle2" v-text="work.description" />
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
import SecondaryTitle from 'components/shared/Titles/SecondaryTitle.vue'
export default {
  name: 'FullWidthDialog',
  components: {
    SecondaryTitle
  },
  props: {
    work: {
      type: Object,
      require: true
    },
    artistName: {
      type: String,
      require: true
    }
  },
  setup(props) {
    const activator = ref(false)
    const fullscreen = ref(false)
    const useActivator = () => (activator.value = true)
    const { work } = toRefs(props)
    const { urlImageWork, urlSecondImagesWork } = toRefs(work.value)
    const allUrlImagesWork = computed(() => [urlImageWork.value, ...urlSecondImagesWork.value])
    console.log(Screen.xs)
    const carouselSlideHeight = computed(() => {
      return fullscreen.value ? 90 : Screen.xs ? 40 : 60
    })
    console.log(carouselSlideHeight.value)
    return {
      slide: ref(0),
      fullscreen,
      activator,
      useActivator,
      allUrlImagesWork,
      carouselSlideHeight
    }
  }
}
</script>

<style lang="scss"></style>
