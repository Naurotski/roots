<template>
  <q-drawer v-model="rightDrawerOpen" side="right">
    <q-list>
      <q-item-label class="text-right q-mr-lg q-mt-md">
        <q-btn
          size="lg"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleRightDrawer"
        />
      </q-item-label>
      <div class="q-mx-md" v-for="{ name, path } in essentialLinks" :key="name">
        <q-item inset exact clickable :to="path" active-class="bg-grey-2">
          <q-item-section class="text-body1">
            <q-item-label>{{ $t(name) }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
      </div>
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
