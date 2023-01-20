<template>
  <q-drawer v-model="rightDrawerOpen" side="right">
    <q-list>
      <q-item-label class="text-right q-mr-sm q-mt-sm">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleRightDrawer" />
      </q-item-label>
      <template v-for="link in essentialLinks" :key="link">
        <q-item exact clickable :to="{ name: link }">
          <q-item-section>
            <q-item-label>{{ link }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator inset />
      </template>
    </q-list>
  </q-drawer>
</template>

<script>
import { useSharedStore } from 'stores/shared-store.js'
import { storeToRefs } from 'pinia'

export default {
  name: 'LayoutDrawer',
  setup() {
    const sharedStore = useSharedStore()
    const { essentialLinks, rightDrawerOpen } = storeToRefs(sharedStore)
    const { toggleRightDrawer } = sharedStore

    return { essentialLinks, rightDrawerOpen, toggleRightDrawer }
  }
}
</script>

<style scoped />
