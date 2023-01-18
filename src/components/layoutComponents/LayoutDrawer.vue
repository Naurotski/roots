<template>
  <q-drawer v-model="rightDrawerOpen" side="right">
    <q-list>
      <q-item-label class="text-right q-mr-sm q-mt-sm">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleRightDrawer" />
      </q-item-label>
      <essential-link v-for="link in essentialLinks" :key="link.title" :link="link" />
    </q-list>
  </q-drawer>
</template>

<script>
import { useSharedStore } from 'stores/shared-store.js'
import { storeToRefs } from 'pinia'
import EssentialLink from 'components/EssentialLink.vue'

export default {
  name: 'LayoutDrawer',
  components: {
    EssentialLink
  },
  setup() {
    const sharedStore = useSharedStore()
    const { essentialLinks, rightDrawerOpen } = storeToRefs(sharedStore)
    const { toggleRightDrawer } = sharedStore
    console.log(essentialLinks.value)
    return { essentialLinks, toggleRightDrawer, rightDrawerOpen }
  }
}
</script>

<style scoped />
