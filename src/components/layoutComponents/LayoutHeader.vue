<template>
  <q-header bordered class="bg-white text-primary">
    <q-toolbar>
      <q-toolbar-title>
        <router-link :to="{ name: 'Home' }" style="text-decoration: none">
          <q-img
            class="q-ml-md"
            style="max-width: 100px; height: 80px"
            fit="contain"
            src="~assets/roots-logo.png"
          />
        </router-link>
      </q-toolbar-title>
      <q-tabs narrow-indicator stretch class="gt-xs">
        <q-route-tab
          style="width: 100px"
          class="text-body1"
          v-for="{ label, path } in essentialLinks"
          :key="label"
          :label="$t(label)"
          :to="path"
        />
      </q-tabs>
      <language-switcher style="width: 80px" />
      <q-btn
        size="lg"
        class="lt-sm q-mr-md"
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

export default {
  name: 'LayoutHeader',
  components: {
    LanguageSwitcher
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
