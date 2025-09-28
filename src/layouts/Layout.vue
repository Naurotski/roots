<template>
  <q-layout view="hHh lpr fff">
    <q-banner
      v-if="!isOnline || !isReachable"
      dense
      class="bg-negative text-white q-pa-sm"
      style="position: fixed; top: 0; left: 0; right: 0; z-index: 3000"
    >
      <template v-slot:avatar>
        <q-icon v-if="!isOnline" name="signal_wifi_off" color="primary" />
      </template>
      <div class="row items-center no-wrap justify-between" style="gap: 0.5rem">
        <div>
          {{ !isOnline ? 'Нет соединения (offline)' : 'Интернет недоступен' }}
          <span v-if="latencyMs != null && isReachable" class="q-ml-sm">({{ latencyMs }} ms)</span>
        </div>
        <q-btn flat dense label="Повторить" @click="pingOnce" />
      </div>
    </q-banner>
    <layout-header />
    <layout-drawer />
    <q-page-container class="q-pt-lg">
      <!-- отступ под баннер -->
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
import { useNetworkGuard } from 'src/composables/useNetworkGuard'

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
    const { isOnline, isReachable, latencyMs, pingOnce } = useNetworkGuard()
    return { isOnline, isReachable, latencyMs, pingOnce }
  }
})
</script>
