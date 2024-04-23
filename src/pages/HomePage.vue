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
          v-for="(
            { urlImageWork, artistName, openingDate, closingDate }, index
          ) in carouselHomePage"
          :name="index"
          :img-src="urlImageWork"
          :key="urlImageWork"
        >
          <div
            :class="$q.screen.xs ? 'absolute-center' : 'absolute-bottom'"
            class="custom-caption full-width"
          >
            <div class="text-h2">{{ artistName }}</div>
            <div
              class="text-h6"
              v-text="`${openingDate} - ${closingDate}`"
              :class="{ 'text-body1': $q.screen.xs }"
            />
          </div>
        </q-carousel-slide>
        <template v-slot:control>
          <q-carousel-control
            :position="$q.screen.xs ? 'top' : 'bottom-right'"
            :offset="[30, $q.screen.xs ? 30 : 30]"
            class="text-white rounded-borders text-center"
            style="background: rgba(0, 0, 0, 0.3); padding: 4px 8px"
          >
            <q-btn
              size="xl"
              text-color="white text-weight-bolder"
              unelevated
              :to="`actions/exhibitions?lifeTime=${lifeTimeExhibition}&id=${selectedExhibitionsData.id}`"
              :label="$t('common.goExhibition')"
              no-caps
              icon-right="mdi-arrow-right-bold"
            />
          </q-carousel-control>
        </template>
      </q-carousel>
    </q-page>
  </transition>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import { date, useMeta } from 'quasar'
import { useSharedStore } from 'stores/shared-store.js'
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
    const slide = ref(0)
    const sharedStore = useSharedStore()
    const { carouselHomePage, selectedExhibitionsData } = storeToRefs(sharedStore)
    const { getHomePageData } = sharedStore
    if (!carouselHomePage.value.length) getHomePageData()
    const lifeTimeExhibition = computed(() =>
      date.formatDate(selectedExhibitionsData.value.openingDate, 'x') > Date.now()
        ? 'upcoming'
        : new Date(
            new Date(selectedExhibitionsData.value.closingDate).setDate(
              new Date(selectedExhibitionsData.value.closingDate).getDate() + 1
            )
          ) < Date.now()
        ? 'archive'
        : 'current'
    )
    useMeta(metaData)
    return {
      slide,
      carouselHomePage,
      lifeTimeExhibition,
      selectedExhibitionsData
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
