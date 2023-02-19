<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
      <div>
        <div style="font-size: 30vh">404</div>

        <div class="text-h2" style="opacity: 0.4">Oops. Nothing here...</div>

        <q-btn
          class="q-mt-xl"
          color="white"
          text-color="blue"
          unelevated
          to="/"
          label="Go Home"
          no-caps
        />
      </div>
    </div>
  </transition>
</template>

<script>
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'

const metaData = {
  title: 'Roots',
  titleTemplate: (title) => `${title} | Error`
}

export default defineComponent({
  name: 'ErrorNotFound',
  setup() {
    useMeta(metaData)
  }
})
</script>
