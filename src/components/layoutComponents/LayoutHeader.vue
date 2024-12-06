<template>
  <q-header class="bg-white text-primary">
    <q-toolbar class="q-dark">
      <q-toolbar-title>
        <router-link :to="{ name: 'Home' }" style="text-decoration: none">
          <q-img
            style="max-width: 300px; height: 80px"
            fit="contain"
            src="~assets/aorta-logo.png"
            alt="Aorta"
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
      <language-switcher style="width: 60px" class="gt-sm" />
      <your-account-button />
      <q-btn size="md" flat stretch icon="fa-solid fa-basket-shopping" to="/basket">
        <q-badge class="q-mt-lg q-mr-xs shadow-3 glossy my-badge-class" color="grey" floating>{{
          cartCounter
        }}</q-badge>
      </q-btn>
      <q-btn
        size="md"
        class="lt-md q-ml-xs"
        flat
        dense
        round
        icon="fa-solid fa-bars"
        aria-label="Menu"
        @click="toggleRightDrawer"
      />
    </q-toolbar>
  </q-header>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useSharedStore } from 'stores/shared-store.js'
import { useStripeStore } from 'stores/stripe-store'
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
    const stripeStore = useStripeStore()
    const { cartCounter } = storeToRefs(stripeStore)
    return { essentialLinks, cartCounter, toggleRightDrawer }
  }
}
</script>

<style scoped />
