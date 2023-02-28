<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 65px">
      <fixed-top-title :name="$t('links.about')" />
      <small-page-container class="q-pt-md">
        <div class="col-12 col-sm-4 row">
          <q-card square flat style="z-index: 1" class="q-pr-sm-xl">
            <img src="~assets/icon.png" alt="roots-logo" style="max-height: 400px" />
          </q-card>
        </div>
        <div class="col-12 col-sm-8 relative-position" v-bind="$attrs">
          <p class="text-justify text-body1" style="white-space: pre-line">
            Roots Gallery is a young and aspiring online gallery of contemporary art. Roots Gallery
            sees its mission in promoting art that can help the viewer to learn about, examine, live
            and comprehend sensory experience. <br />
            We collaborate with artists for whom art is a field for living their own complex
            emotional experiences, whether they be personal or collective crises, traumas, phases or
            archaic images of the unconscious. We welcome all types of art, from painting and
            photography to installations. For us, there are no restrictions on the age, experience
            of the artist, his nationality, gender or education. We are looking for new and
            expressive ways of accurately conveying emotional experiences. <br />
            We have a virtual permanent address but we go offline with our projects and involve a
            large number of viewers.<br />
            <br />roots.gallery.it@gmail.com <br /><br />Nadzeya Naurotskaya, curator +393925568834
            <br />
            Asya Zuyeva, communications director +393884733424
          </p>
        </div>
      </small-page-container>
    </q-page>
  </transition>
</template>

<script>
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import { useMeta } from 'quasar'

const metaData = {
  title: 'Roots',
  titleTemplate: (title) => `${title} | About`,
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
export default {
  name: 'AboutPage',
  components: {
    FixedTopTitle,
    SmallPageContainer
  },
  setup() {
    useMeta(metaData)
  }
}
</script>

<style scoped></style>
