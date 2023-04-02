<template>
  <!--  <q-page class="q-pa-md" style="margin-top: 60px">-->
  <div class="fixed-top bg-white q-px-md" style="padding-top: 90px; z-index: 2">
    <div
      class="text-h4 q-ml-md"
      :class="{
        'q-mb-sm':
          name !== 'Exhibitions' && name !== 'Events' && name !== 'Mostre' && name !== 'Eventi'
      }"
    >
      <slot name="link">
        {{ name }}
      </slot>
    </div>
    <slot />
    <q-separator />
  </div>
</template>

<script>
export default {
  name: 'FixedTopTitle',
  props: {
    name: {
      style: String,
      require: true
    }
  }
}
</script>

<style scoped></style>
