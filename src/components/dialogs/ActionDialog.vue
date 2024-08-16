<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div>
      <slot name="button" @useActivator="useActivator">
        <q-btn label="Full Width" @click="useActivator" v-bind="$attrs" />
      </slot>
      <q-dialog v-model="activator" full-width>
        <q-card>
          <q-toolbar class="q-pl-xl q-pt-md">
            <q-toolbar-title class="text-h5" style="white-space: pre-line">
              {{ title }}
            </q-toolbar-title>
            <q-btn flat round icon="close" v-close-popup />
          </q-toolbar>
          <div class="row" :class="{ 'justify-center': !showDescription }">
            <div class="col-12 col-sm-8">
              <q-card-section>
                <carousel-component :url-images="urlImages" @update:slide="slide = $event" />
              </q-card-section>
            </div>
            <div v-if="showDescription" class="col-12 col-sm-4 q-pt-sm-md">
              <q-card-section v-if="typeAction !== 'events' && work.firstName" class="q-pt-none">
                <router-link
                  v-if="work.phat"
                  style="text-decoration: none; color: #1d1d1d"
                  :to="work.phat"
                >
                  <div class="text-h5" v-text="`${work.firstName} ${work.lastName}`" />
                </router-link>
                <div v-else class="text-h5" v-text="`${work.firstName} ${work.lastName}`" />
              </q-card-section>
              <q-card-section v-if="work.name" class="q-pt-none">
                <div class="text-h6" v-text="work.name" />
              </q-card-section>
              <q-card-section>
                <p
                  v-if="work.description"
                  style="white-space: pre-line"
                  class="text-justify text-body1"
                >
                  {{ description }}
                  <span
                    style="cursor: pointer; color: #0d47a1"
                    v-if="work.description.length >= 400 && !show"
                    @click="show = !show"
                    >{{ $t('common.more') }}</span
                  ><span
                    style="cursor: pointer; color: #0d47a1"
                    v-if="work.description.length >= 400 && show"
                    @click="show = !show"
                  >
                    <br />&#8679;</span
                  >
                </p>
                <router-link
                  v-if="work.idSale"
                  :to="`/work/${work.idSale}`"
                  class="text-h6"
                  style="color: #1d1d1d"
                  >For sale</router-link
                >
              </q-card-section>
            </div>
          </div>
        </q-card>
      </q-dialog>
    </div>
  </transition>
</template>

<script>
import { computed, ref, toRefs, watchEffect } from 'vue'
import CarouselComponent from 'components/shared/CarouselComponent.vue'
import { useArtistsStore } from 'stores/artists-store.js'
import { storeToRefs } from 'pinia'
export default {
  name: 'ActionDialog',
  components: {
    CarouselComponent
  },
  props: {
    title: {
      type: String,
      require: true
    },
    typeAction: {
      type: String,
      require: true
    },
    dialogData: {
      type: Object,
      require: true
    }
  },
  setup(props) {
    const show = ref(false)
    const activator = ref(false)
    const slide = ref(0)
    const useActivator = () => (activator.value = true)
    const { dialogData } = toRefs(props)
    const urlImages = computed(() => dialogData.value.map((item) => item.urlWork))
    const work = computed(() => dialogData.value[slide.value])
    const description = computed(() => {
      if (work.value.description.length < 400 || show.value) {
        return work.value.description
      } else {
        return `${work.value.description.substring(0, 400)}...`
      }
    })
    const artistsStore = useArtistsStore()
    const { filterArtistsDraft } = storeToRefs(artistsStore)
    const { getArtists } = artistsStore
    if (!filterArtistsDraft.value.length) getArtists()
    watchEffect(() =>
      dialogData.value.forEach((action) => {
        filterArtistsDraft.value.forEach((artist) => {
          if (action.artistName === artist.name) {
            action.phat = `/artists/${artist.artistId}`
          }
        })
      })
    )
    const showDescription = computed(
      () =>
        !!work.value.firstName ||
        !!work.value.description ||
        !!work.value.name ||
        !!work.value.idSale
    )

    return {
      slide,
      activator,
      useActivator,
      urlImages,
      show,
      work,
      description,
      showDescription
    }
  }
}
</script>

<style scoped></style>
