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
  <carousel-auth v-model="dialog" />
</template>

<script>
import { ref } from 'vue'
import CarouselAuth from 'components/auth/DialogAuth.vue'
export default {
  name: 'YourAccountButton',
  components: {
    CarouselAuth
  },
  setup() {
    const login = ref(false)
    const status = ref(false)
    const dialog = ref(false)
    const loginUser = () => {
      console.log('loginUser')
      if (!dialog.value && !login.value) {
        login.value = true
        dialog.value = true
      }
    }
    const logoutUser = () => {
      console.log('logoutUser')
      login.value = false
    }
    return {
      login,
      status,
      dialog,
      loginUser,
      logoutUser
    }
  }
}
</script>

<style scoped></style>
