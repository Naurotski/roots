<template>
  <q-btn no-caps outline rounded color="primary" class="full-width"
    ><q-icon left name="mdi-apple" /><slot name="apple" />
  </q-btn>
  <q-btn no-caps outline rounded color="primary" class="full-width" @click="logInGoogle"
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 48 48"
      class="q-mr-md"
    >
      <path
        fill="#4285F4"
        d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h13.2c-.6 3-2.5 5.5-5.3 7.2v6h8.5c4.9-4.4 7.7-10.8 7.7-17.7z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 11.9-2.1 15.8-5.6l-8.5-6c-2.4 1.6-5.4 2.5-8.7 2.5-6.7 0-12.4-4.5-14.4-10.5H0v6.3C4 43.5 13.3 48 24 48z"
      />
      <path
        fill="#FBBC05"
        d="M9.6 28.5c-1-2.7-1-5.6 0-8.3V14h-8V21c-2.5 4.6-2.5 10 0 14.7l8-6.3z"
      />
      <path
        fill="#EA4335"
        d="M24 9.5c3.2 0 6.1 1.1 8.3 3.1l6.2-6.2C33.3 2.3 28.9 0 24 0 13.3 0 4 4.5 0 12.7l8 6.3c2-6 7.7-9.5 14-9.5z"
      /></svg
    ><slot name="google" />
  </q-btn>
  <q-btn no-caps outline rounded color="primary" class="full-width"
    ><q-icon left name="mdi-facebook" class="text-blue" /><slot name="facebook" />
  </q-btn>
</template>

<script>
import { useAuthStore } from 'stores/auth-store.js'
export default {
  name: 'AuthProvidersButtons',
  setup() {
    const authStore = useAuthStore()
    const { logInGoogle } = authStore
    return {
      logInGoogle
    }
  }
}
</script>

<style scoped></style>
