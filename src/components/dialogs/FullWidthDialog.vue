<template>
  <div>
    <slot name="button" @useActivator="useActivator">
      <q-btn label="Full Width" @click="useActivator" v-bind="$attrs" />
    </slot>
    <q-dialog v-model="activator" full-width>
      <q-card>
        <q-toolbar class="q-pl-xl q-pt-md">
          <q-toolbar-title class="text-h4">
            {{ artistName }}
          </q-toolbar-title>
          <q-btn flat round icon="close" v-close-popup />
        </q-toolbar>
        <div class="row">
          <div class="col-12 col-sm-8">
            <q-card-section>
              <carousel-component :url-images="allUrlImagesWork" />
            </q-card-section>
          </div>
          <div class="col-12 col-sm-4 q-pt-sm-md">
            <q-card-section class="q-pt-none">
              <div class="text-h5" v-text="work.name" />
            </q-card-section>
            <q-card-section>
              <p
                style="white-space: pre-line"
                class="text-justify text-body1"
                v-text="work.materials"
              />
              <p
                style="white-space: pre-line"
                class="text-justify text-body1"
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
  name: 'FullWidthDialog',
  components: {
    CarouselComponent
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
    const useActivator = () => (activator.value = true)
    const { work } = toRefs(props)
    const { urlImageWork, urlSecondImagesWork = ref([]) } = toRefs(work.value)
    const allUrlImagesWork = computed(() => [urlImageWork.value, ...urlSecondImagesWork.value])
    return {
      activator,
      useActivator,
      allUrlImagesWork
    }
  }
}
</script>

<style lang="scss"></style>
