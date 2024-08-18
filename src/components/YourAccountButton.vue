<template>
  <q-btn-dropdown
    style="width: 100px"
    no-caps
    v-model="status"
    :disable-dropdown="!login && !status"
    auto-close
    stretch
    flat
    @click="loginUser"
    ><template v-slot:label>
      <div v-if="login" class="text-center overflow-hidden">{{ $t('auth.hello') }}<br />Nadia</div>
      <div v-else class="text-center">{{ $t('auth.singIn') }}</div>
    </template>
    <q-list>
      <q-item v-close-popup clickable @click="locale = value">
        <q-item-section> {{ $t('auth.yourAccount') }} </q-item-section>
      </q-item>
    </q-list>
    <q-list>
      <q-item v-close-popup clickable @click="logoutUser">
        <q-item-section>{{ $t('auth.signOut') }}</q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'YourAccountButton',
  setup() {
    const login = ref(false)
    const status = ref(false)
    const loginUser = () => {
      console.log('loginUser')
      login.value = true
    }
    const logoutUser = () => {
      console.log('logoutUser')
      login.value = false
    }

    return {
      login,
      status,
      loginUser,
      logoutUser
    }
  }
}
</script>

<style scoped></style>
