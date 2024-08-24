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
  <dialog-auth v-model="dialog" />
</template>

<script>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'stores/auth-store.js'
import DialogAuth from 'components/auth/DialogAuth.vue'

export default {
  name: 'YourAccountButton',
  components: {
    DialogAuth
  },
  setup() {
    const authStore = useAuthStore()
    const { loggedIn, userData } = storeToRefs(authStore)
    console.log(userData)
    const { logoutUser } = authStore
    const status = ref(false)
    const dialog = ref(false)
    const singIn = () => {
      if (!dialog.value && !loggedIn.value) {
        dialog.value = true
      }
    }
    return {
      loggedIn,
      userData,
      status,
      dialog,
      singIn,
      logoutUser
    }
  }
}
</script>

<style scoped></style>
