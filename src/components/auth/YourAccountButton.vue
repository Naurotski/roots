<template>
  <q-btn-dropdown
    style="width: 100px"
    no-caps
    v-model="status"
    :disable-dropdown="!loggedIn && !status"
    auto-close
    stretch
    flat
    @click="singIn"
    ><template v-slot:label>
      <div v-if="loggedIn" class="text-center overflow-hidden">
        {{ $t('auth.hello') }}<br />{{ userData.displayName }}
      </div>
      <div v-else class="text-center">{{ $t('auth.singIn') }}</div>
    </template>
    <q-list>
      <q-item clickable to="/account">
        <q-item-section> {{ $t('auth.yourAccount') }} </q-item-section>
      </q-item>
    </q-list>
    <q-list>
      <q-item clickable @click="logoutUser">
        <q-item-section>{{ $t('auth.signOut') }}</q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'stores/auth-store.js'
import { useUserStore } from 'stores/user-store.js'

export default {
  name: 'YourAccountButton',
  setup() {
    const authStore = useAuthStore()
    const { loggedIn, loginDialog } = storeToRefs(authStore)
    const userStore = useUserStore()
    const { userData } = storeToRefs(userStore)
    const { showLoginDialog } = authStore
    const { logoutUser } = authStore
    const status = ref(false)
    const singIn = () => {
      if (!loginDialog.value && !loggedIn.value) {
        showLoginDialog(true)
      }
    }
    return {
      loggedIn,
      userData,
      status,
      singIn,
      logoutUser
    }
  }
}
</script>

<style scoped></style>
