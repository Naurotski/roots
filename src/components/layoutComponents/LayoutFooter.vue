<template>
  <q-footer bordered class="bg-white text-primary">
    <q-tabs no-caps active-color="primary" indicator-color="transparent" class="text-grey">
      <q-tab icon="list" name="images" label="Images" />
    </q-tabs>
  </q-footer>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'LayoutFooter',
  setup() {
    const date = ref(new Date().getFullYear())
    const socialMedia = ref([
      { icon: 'mdi-facebook', path: 'https://www.facebook.com/Naurotskaya.ART' },
      { icon: 'mdi-instagram', path: 'https://instagram.com/art_navrotskaya?utm_medium=copy_link' }
    ])
    return {
      date,
      socialMedia
    }
  }
}
</script>

<style scoped />
