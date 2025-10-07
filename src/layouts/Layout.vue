<template>
  <q-layout view="hHh lpr fff">
    <layout-header v-if="!headerFooterHidden" />
    <layout-drawer />
    <q-page-container>
      <router-view />
    </q-page-container>
    <dialog-auth />
    <floating-button />
    <layout-footer v-if="!headerFooterHidden" />
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import { useSharedStore } from 'stores/shared-store'
import LayoutFooter from 'components/layoutComponents/LayoutFooter.vue'
import LayoutHeader from 'components/layoutComponents/LayoutHeader.vue'
import LayoutDrawer from 'components/layoutComponents/LayoutDrawer.vue'
import DialogAuth from 'components/auth/DialogAuth.vue'
import FloatingButton from 'components/shared/FloatingButton.vue'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'MainLayout',
  components: {
    LayoutHeader,
    LayoutFooter,
    LayoutDrawer,
    DialogAuth,
    FloatingButton
  },
  setup() {
    const sharedStore = useSharedStore()
    const { headerFooterHidden } = storeToRefs(sharedStore)
    return {
      headerFooterHidden
    }
  }
})
</script>
