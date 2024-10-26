<template>
<!--  <q-btn no-caps outline rounded color="primary" class="full-width"-->
<!--    ><q-icon left name="mdi-apple" /><slot name="apple" />-->
<!--  </q-btn>-->
  <google-button @click="logInGoogle"> <slot name="google" /></google-button>
  <q-btn no-caps outline rounded color="primary" class="full-width" @click="logInFacebook"
    ><q-icon left name="mdi-facebook" class="text-blue" /><slot name="facebook" />
  </q-btn>
</template>

<script>
import { useAuthStore } from 'stores/auth-store.js'
import GoogleButton from 'components/auth/GoogleButton.vue'
export default {
  name: 'AuthProvidersButtons',
  components: {
    GoogleButton
  },
  setup() {
    const authStore = useAuthStore()
    const { logInGoogle, logInFacebook } = authStore
    return {
      logInGoogle,
      logInFacebook
    }
  }
}
</script>

<style scoped></style>
