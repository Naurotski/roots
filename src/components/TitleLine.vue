<template>
  <div class="row q-dark justify-center">
    <div class="col-10 col-sm-6">
      <component class="comp" :is="$q.screen.xs ? 'h6' : 'h5'">
        <slot />
      </component>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TitleLine'
}
</script>

<style scoped lang="sass">
.col-10
  overflow: hidden

.comp
  display: inline-block
  position: relative
  padding-right: 10px
  letter-spacing: 5px

.comp:after
  content: ''
  position: absolute
  top: 50%
  height: 1px
  background: white
  left: 100%
  right: -1000%
</style>
