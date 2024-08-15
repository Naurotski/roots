<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page>
      <q-carousel
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
          v-for="({ imageUrl }, index) in carouselHomePage"
          :name="index"
          :img-src="imageUrl"
          :key="imageUrl"
        >
          <div
            :class="$q.screen.xs ? 'absolute-center' : 'absolute-bottom'"
            class="custom-caption full-width"
          >
            <!--            <div class="text-h2">{{ artistName }}</div>-->
            <div class="text-h4">
              {{ locale === 'it' ? selectedExhibitionsData.nameIt : selectedExhibitionsData.name }}
            </div>
            <div
              class="text-h6"
              v-text="
                `${selectedExhibitionsData.openingDate} - ${selectedExhibitionsData.closingDate}`
              "
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
      <title-line v-if="worksForSale.length" class="q-mt-lg">
        {{ $t('common.shopArt').toUpperCase() }}
      </title-line>
      <transition appear enter-active-class="animated fadeIn">
        <small-page-container class="justify-around">
          <works-list :works-list="worksForSale" />
        </small-page-container>
      </transition>
    </q-page>
  </transition>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import { date, useMeta } from 'quasar'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useSharedStore } from 'stores/shared-store.js'

import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import WorksList from 'components/WorksList.vue'
import TitleLine from 'components/TitleLine.vue'

const metaData = {
  title: 'Aorta Social Art Gallery ',
  meta: {
    description: {
      name: 'description',
      content:
        'Aorta Social Art Gallery is a young and aspiring online gallery of contemporary art. Roots Gallery sees its mission in promoting art that can help the viewer to learn about, examine, live and comprehend sensory experience.'
    },
    ogTitle: {
      property: 'og:title'
    }
  }
}
export default defineComponent({
  name: 'HomePage',
  components: {
    SmallPageContainer,
    WorksList,
    TitleLine
  },
  setup() {
    const slide = ref(0)
    const { locale } = useI18n({ useScope: 'global' })
    const sharedStore = useSharedStore()
    const { carouselHomePage, selectedExhibitionsData, worksForSale } = storeToRefs(sharedStore)
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
    const worksList = computed(() => {
      if (worksForSale.value.length) {
        let localArray = worksForSale.value.filter((work) => work.price)
        if (locale.value === 'it') {
          return localArray.map((item) => ({
            ...item,
            description: item.descriptionIt,
            materials: item.materialsIt,
            name: item.nameIt
          }))
        } else {
          return localArray
        }
      } else {
        return []
      }
    })
    useMeta(metaData)
    return {
      locale,
      slide,
      carouselHomePage,
      lifeTimeExhibition,
      selectedExhibitionsData,
      worksList,
      worksForSale
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
