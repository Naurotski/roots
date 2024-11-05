<template>
  <q-header class="bg-white text-primary">
    <q-toolbar class="q-dark">
      <q-toolbar-title>
        <router-link :to="{ name: 'Home' }" style="text-decoration: none">
          <q-img
            style="max-width: 300px; height: 80px"
            fit="contain"
            src="~assets/aorta-logo.png"
          />
        </router-link>
      </q-toolbar-title>
      <q-tabs narrow-indicator stretch class="gt-sm">
        <q-route-tab
          class="text-body1"
          v-for="{ label, path } in essentialLinks"
          :key="label"
          :label="$t(label)"
          :to="path"
        />
      </q-tabs>
      <language-switcher style="width: 60px" />
      <your-account-button />
      <q-btn
        size="lg"
        class="lt-md"
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleRightDrawer"
      />
    </q-toolbar>
  </q-header>
</template>

<script>
import { useSharedStore } from 'stores/shared-store.js'
import { storeToRefs } from 'pinia'
import LanguageSwitcher from 'components/LanguageSwitcher.vue'
import YourAccountButton from 'components/auth/YourAccountButton.vue'

export default {
  name: 'LayoutHeader',
  components: {
    LanguageSwitcher,
    YourAccountButton
  },
  setup() {
    const sharedStore = useSharedStore()
    const { essentialLinks } = storeToRefs(sharedStore)
    const { toggleRightDrawer } = sharedStore
    return { essentialLinks, toggleRightDrawer }
  }
}
</script>

<style scoped />
