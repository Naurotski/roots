<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div class="fullscreen bg-grey text-white text-center q-pa-md flex flex-center">
      <div>
        <div style="font-size: 8vh">{{ $t('common.thank') }}</div>

        <div class="text-h4" style="opacity: 0.4">
          {{ $t('common.acquired') }}
        </div>
        <div class="text-h4" style="opacity: 0.4">
          {{ $t('common.delivery') }}
        </div>

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
import { useMeta } from 'quasar'

const metaData = {
  title: 'Roots',
  titleTemplate: (title) => `${title} | Thank You`
}

export default {
  name: 'ThankYouPage',
  setup() {
    useMeta(metaData)
  }
}
</script>

<style scoped></style>
