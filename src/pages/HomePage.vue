<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page>
      <q-img alt="logo" src="~assets/3F0A9210.jpg" class="fixed" height="90vh" />
    </q-page>
  </transition>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'HomePage'
})
</script>
