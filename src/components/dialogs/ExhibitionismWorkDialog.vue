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
              <carousel-component :url-images="urlImages" @update:slide="slide = $event" />
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
import CarouselComponent from 'components/shared/CarouselComponent.vue'

export default {
  name: 'ExhibitionismWorkDialog',
  components: {
    CarouselComponent
  },
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
    const useActivator = () => (activator.value = true)
    const { dialogData } = toRefs(props)
    const urlImages = computed(() => dialogData.value.map((item) => item.urlWork))
    const work = computed(() => dialogData.value[slide.value])
    return {
      slide,
      activator,
      useActivator,
      urlImages,
      work
    }
  }
}
</script>

<style scoped></style>
