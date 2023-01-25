<template>
  <!--  <q-page class="q-pa-md" style="margin-top: 60px">-->
  <div class="fixed-top bg-white q-px-md" style="padding-top: 60px; z-index: 2">
    <p class="text-h4 q-ml-md">{{ name }}</p>
    <q-separator />
  </div>
</template>

<script>
export default {
  name: 'TitleFixedTop',
  props: {
    name: {
      style: String,
      require: true
    }
  }
}
</script>

<style scoped></style>
