<template>
  <q-toolbar>
    <q-toolbar-title class="text-h5">{{ dataCard.name }}</q-toolbar-title>
  </q-toolbar>
  <div class="col-12 col-sm-4 row">
    <q-card square flat style="z-index: 1" class="q-pr-sm-xl">
      <img :src="dataCard.url" :alt="dataCard.name" />
      <slot name="underPicture" />
    </q-card>
  </div>
  <div class="col-12 col-sm-8 relative-position" v-bind="$attrs">
    <p class="text-justify text-subtitle1" style="white-space: pre-line">
      {{ dataCard.description }}
    </p>
    <slot name="button" />
  </div>
</template>

<script>
export default {
  name: 'SharedCard',
  props: {
    dataCard: {
      type: Object,
      require: true
    }
  },
  inheritAttrs: false
}
</script>

<style scoped></style>
