<template>
  <q-footer class="q-py-md">
    <div class="row justify-around q-gutter-xs">
      <div>
        <a
          v-for="item in socialMedia"
          :key="item.icon"
          :href="item.path"
          target="_blank"
          style="text-decoration: none; color: white"
        >
          <q-icon :name="item.icon" size="sm" class="q-mr-md" />
        </a>
      </div>
      <div class="text-body1">&copy; {{ date }} Aorta</div>
      <router-link
        v-if="!$q.screen.xs"
        class="text-body1"
        style="text-decoration: none; color: white"
        to="/termsSale"
        >{{ $t('auth.termsSale') }}</router-link
      >
      <router-link
        v-if="!$q.screen.xs"
        class="text-body1"
        style="text-decoration: none; color: white"
        to="/privacy"
        >{{ $t('auth.privacyPolicy') }}</router-link
      >
      <router-link
        v-if="!$q.screen.xs"
        class="text-body1"
        style="text-decoration: none; color: white"
        to="/rules"
        >{{ $t('common.rulesGallery') }}</router-link
      >
    </div>
    <div v-if="$q.screen.xs" class="row justify-around q-gutter-xs q-mt-xs">
      <router-link class="text-body1" style="text-decoration: none; color: white" to="/termsSale">{{
        $t('auth.termsSale')
      }}</router-link>
      <router-link class="text-body1" style="text-decoration: none; color: white" to="/privacy">{{
        $t('auth.privacyPolicy')
      }}</router-link>
      <router-link class="text-body1" style="text-decoration: none; color: white" to="/rules">{{
        $t('common.rulesGallery')
      }}</router-link>
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
      {
        icon: 'fa-brands fa-facebook',
        path: 'https://www.facebook.com/profile.php?id=100088816940231'
      },
      { icon: 'fa-brands fa-instagram', path: 'https://www.instagram.com/aorta.socialartgallery/' },
      { icon: 'fa-regular fa-envelope', path: 'mailto:aorta.gallery@gmail.com' }
    ])
    return {
      date,
      socialMedia
    }
  }
}
</script>

<style scoped />
