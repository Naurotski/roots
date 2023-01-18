<template>
  <q-header bordered class="bg-white text-primary">
    <q-toolbar>
      <q-toolbar-title>
        <router-link to="/" style="text-decoration: none">
          <q-img
            style="max-width: 100px; height: 50px"
            fit="contain"
            src="~assets/roots-logo.png"
          />
        </router-link>
      </q-toolbar-title>
      <q-tabs class="gt-xs">
        <q-route-tab
          v-for="{ title } in essentialLinks"
          :key="title"
          :name="title"
          :label="title"
          :to="{ name: title }"
        />
      </q-tabs>
      <q-btn
        class="lt-sm"
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

export default {
  name: 'LayoutHeader',
  setup() {
    const sharedStore = useSharedStore()
    const { essentialLinks } = storeToRefs(sharedStore)
    const { toggleRightDrawer } = sharedStore
    return { essentialLinks, toggleRightDrawer }
  }
}
</script>

<style scoped />
