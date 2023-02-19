<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 100px">
      <fixed-top-title name="Exhibitions"
        ><div class="row justify-md-start">
          <q-tabs dense>
            <q-route-tab
              class="text-body1"
              v-for="link in exhibitionsLinks"
              :key="link"
              :name="link"
              :label="link"
              :to="link"
            />
          </q-tabs></div
      ></fixed-top-title>
      <router-view />
    </q-page>
  </transition>
</template>

<script>
import { useSharedStore } from 'stores/shared-store.js'
import { storeToRefs } from 'pinia'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import { useMeta } from 'quasar'

const metaData = {
  title: 'Roots',
  titleTemplate: (title) => `${title} | Exhibitions`,
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
  name: 'AllExhibitionsPage',
  components: {
    FixedTopTitle
  },
  setup() {
    const shredStore = useSharedStore()
    const { exhibitionsLinks } = storeToRefs(shredStore)
    useMeta(metaData)
    return {
      exhibitionsLinks
    }
  }
}
</script>

<style scoped></style>
