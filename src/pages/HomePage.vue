<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page>
      <!--      <q-img alt="logo" src="~assets/3F0A9210.jpg" class="fixed" height="90vh" />-->
      <q-carousel
        class="fixed"
        animated
        v-model="slide"
        height="85vh"
        style="width: 100%"
        autoplay
        swipeable
        infinite
        transition-duration="3000"
      >
        <q-carousel-slide
          v-for="({ urlImageWork, artistName }, index) in allWorks"
          :name="index"
          :img-src="urlImageWork"
          :key="urlImageWork"
        >
          <div class="absolute-bottom custom-caption">
            <div class="text-h2">{{ artistName }}</div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-page>
  </transition>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useMeta } from 'quasar'
import { useArtistsStore } from 'stores/artists-store.js'
import { storeToRefs } from 'pinia'

const metaData = {
  title: 'Roots Gallery',
  meta: {
    description: {
      name: 'description',
      content:
        'Roots Gallery is a young and aspiring online gallery of contemporary art. Roots Gallery sees its mission in promoting art that can help the viewer to learn about, examine, live and comprehend sensory experience.'
    },
    ogTitle: {
      property: 'og:title'
    }
  }
}
export default defineComponent({
  name: 'HomePage',
  setup() {
    const artistsStore = useArtistsStore()
    const { filterArtistsDraft, allWorks } = storeToRefs(artistsStore)
    const { getArtists } = artistsStore
    if (!filterArtistsDraft.value.length) getArtists()
    const slide = ref(0)
    useMeta(metaData)
    return {
      allWorks,
      slide
    }
  }
})
</script>
<style lang="sass" scoped>
.custom-caption
  text-align: center
  padding: 80px
  color: white
  background-color: rgba(0, 0, 0, .3)
</style>
