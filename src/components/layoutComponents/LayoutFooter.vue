<template>
  <q-footer :reveal="$route.name === 'Home'" bordered class="bg-white text-primary">
    <div class="row justify-center q-mt-md">
      <a
        v-for="item in socialMedia"
        :key="item.icon"
        :href="item.path"
        target="_blank"
        style="text-decoration: none; color: #1d1d1d"
      >
        <q-icon :name="item.icon" size="sm" class="q-mr-md"
      /></a>
      <p class="text-body1">&copy; {{ date }} Roots</p>
    </div>
  </q-footer>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'LayoutFooter',
  setup() {
    const date = ref(new Date().getFullYear())
    const socialMedia = ref([
      { icon: 'mdi-facebook', path: 'https://www.facebook.com/profile.php?id=100088816940231' },
      { icon: 'mdi-instagram', path: 'https://www.instagram.com/roots_art_gallery/' }
    ])
    return {
      date,
      socialMedia
    }
  }
}
</script>

<style scoped />
