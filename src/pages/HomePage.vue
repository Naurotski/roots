<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="flex flex-center">
      <img alt="logo" src="~assets/3F0A9210.jpg" style="height: 80vh" />
    </q-page>
  </transition>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'HomePage'
})
</script>
