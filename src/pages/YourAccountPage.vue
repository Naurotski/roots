<template>
  <h2>YourAccountPage</h2>
  <pre>userData - {{ userData }}</pre>
</template>

<script>
import { useAuthStore } from 'stores/auth-store.js'
import { storeToRefs } from 'pinia'
export default {
  name: 'YourAccountPage',
  setup() {
    const authStore = useAuthStore()
    const { userData } = storeToRefs(authStore)
    return {
      userData
    }
  }
}
</script>

<style scoped></style>
