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

export default defineComponent({
  name: 'ErrorNotFound',
  setup() {
    useMeta(() => {
      return {
        title: 'Aorta Social Art Gallery',
        titleTemplate: (title) => `${title} | Error`,
        meta: {
          robots: {
            name: 'robots',
            content: 'noindex, nofollow'
          }
        }
      }
    })
  }
})
</script>
