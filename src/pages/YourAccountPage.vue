<template>
  <h2>YourAccountPage</h2>
  <pre>userData - {{ userData }}</pre>
</template>

<script>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'stores/auth-store.js'
import { watch } from 'vue'

export default {
  name: 'YourAccountPage',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const { loggedIn, userData } = storeToRefs(authStore)
    watch(loggedIn, (val) => {
      if (!val) router.replace('/')
    })
    return {
      userData
    }
  }
}
</script>

<style scoped></style>
