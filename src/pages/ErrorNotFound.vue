<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div class="fullscreen bg-grey text-white text-center q-pa-md flex flex-center">
      <div>
        <div style="font-size: 30vh">404</div>

        <div class="text-h2" style="opacity: 0.4">{{ $t('common.oops') }}</div>

        <q-btn
          class="q-mt-xl"
          color="white"
          text-color="grey"
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
  title: 'Roots Gallery',
  titleTemplate: (title) => `${title} | Error`
}

export default defineComponent({
  name: 'ErrorNotFound',
  setup() {
    useMeta(metaData)
  }
})
</script>
