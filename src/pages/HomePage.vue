<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="flex flex-center">
      <img alt="logo" src="~assets/roots-logo.png" style="width: 200px; height: 200px" />
    </q-page>
  </transition>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomePage'
})
</script>
