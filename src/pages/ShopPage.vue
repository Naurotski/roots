<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 100px">
      <fixed-top-title :name="$t(`links.shop`)"> </fixed-top-title>
    </q-page>
  </transition>
</template>
<script>
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'

export default {
  name: 'ShopPage',
  components: { FixedTopTitle }
}
</script>

<style scoped></style>
