<template>
  <q-layout view="hHh lpr fff">
    <layout-header />
    <layout-drawer />
    <q-page-container>
      <router-view />
    </q-page-container>
    <dialog-auth />
    <floating-button />
    <layout-footer />
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import LayoutFooter from 'components/layoutComponents/LayoutFooter.vue'
import LayoutHeader from 'components/layoutComponents/LayoutHeader.vue'
import LayoutDrawer from 'components/layoutComponents/LayoutDrawer.vue'
import DialogAuth from 'components/auth/DialogAuth.vue'
import FloatingButton from 'components/shared/FloatingButton.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    LayoutHeader,
    LayoutFooter,
    LayoutDrawer,
    DialogAuth,
    FloatingButton
  }
})
</script>
