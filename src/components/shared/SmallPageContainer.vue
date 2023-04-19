<template>
  <div class="row justify-center">
    <div class="row" style="width: 100%; max-width: 1400px" v-bind="$attrs">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SmallPageContainer',
  inheritAttrs: false
}
</script>

<style scoped />
