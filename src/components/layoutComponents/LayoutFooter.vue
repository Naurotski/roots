<template>
  <q-footer bordered class="bg-white text-primary">
    <q-tabs no-caps active-color="primary" indicator-color="transparent" class="text-grey">
      <q-tab icon="list" name="images" label="Images" />
      <q-tab name="videos" label="Videos" />
      <q-tab name="articles" label="Articles" />
    </q-tabs>
  </q-footer>
</template>

<script>
export default {
  name: 'LayoutFooter'
}
</script>

<style scoped />
