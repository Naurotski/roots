<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div class="fullscreen bg-grey text-white text-center q-pa-md flex flex-center">
      <div>
        <div class="text-h3">{{ $t('common.technicalWork') }}</div>
        <div class="text-body1" style="opacity: 0.4">{{ $t('common.maintenance') }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'

const metaData = {
  title: 'Aorta Social Art Gallery',
  titleTemplate: (title) => `${title} | Error`
}

export default defineComponent({
  name: 'MaintenancePage',
  setup() {
    useMeta(metaData)
  }
})
</script>
<style scoped></style>
