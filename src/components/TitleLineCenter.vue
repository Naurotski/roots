<template>
  <div class="col text-center">
    <div class="comp text-h6 text-grey"><slot /></div>
  </div>
</template>

<script>
export default {
  name: 'TitleLineCenter'
}
</script>

<style scoped lang="sass">
.col
  overflow: hidden
.comp
  display: inline-block
  position: relative
  padding-right: 10px
  padding-left: 10px
  letter-spacing: 5px

.comp:after
  content: ''
  position: absolute
  top: 50%
  height: 1px
  background: grey
  left: 100%
  right: -1000%

.comp:before
  content: ''
  position: absolute
  top: 50%
  height: 1px
  background: grey
  right: 100%
  left: -1000%
</style>
