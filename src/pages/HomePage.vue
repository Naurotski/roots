<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page>
      <q-img alt="logo" src="~assets/3F0A9210.jpg" class="fixed" height="90vh" />
    </q-page>
  </transition>
</template>

<script>
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'

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
    useMeta(metaData)
  }
})
</script>
