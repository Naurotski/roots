<template>
  <div class="q-pl-md col-12 flex">
    <span class="text-h5">{{ title }}</span>
    <q-space />
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SecondaryTitle',
  props: {
    title: {
      type: String,
      require: true
    }
  }
}
</script>

<style scoped />
